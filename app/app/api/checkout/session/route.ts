import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAuth } from "@/lib/auth";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { getCreditPack, getSubscriptionPlan } from "@/config/pricing";
import { z } from "zod";

const createSessionSchema = z.object({
  type: z.enum(["credit_pack", "subscription"]),
  planId: z.string().min(1),
  billingPeriod: z.enum(["monthly", "yearly"]).optional().default("monthly"),
});

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { success: false, error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const { userId } = await requireAuth(req);
    const body = await req.json();
    const { type, planId, billingPeriod } = createSessionSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get or create Stripe customer
    let stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { userId: user.id },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });

      stripeCustomer = await prisma.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    let session: any;
    let paymentRecord: any;

    if (type === "credit_pack") {
      const pack = getCreditPack(planId);
      if (!pack) {
        return NextResponse.json(
          { success: false, error: "Invalid credit pack" },
          { status: 400 }
        );
      }

      paymentRecord = await prisma.paymentRecord.create({
        data: {
          userId: user.id,
          type: "credit_pack",
          credits: pack.credits,
          amount: pack.priceCents,
          currency: "usd",
          status: "pending",
          metadata: { packId: pack.id },
        },
      });

      session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${pack.credits} Fluid Credits`,
                description: `One-time purchase of ${pack.credits} credits. Credits never expire.`,
              },
              unit_amount: pack.priceCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          paymentRecordId: paymentRecord.id,
          credits: String(pack.credits),
          type: "credit_pack",
        },
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/checkout/cancel`,
      });
    } else if (type === "subscription") {
      const plan = getSubscriptionPlan(planId);
      if (!plan) {
        return NextResponse.json(
          { success: false, error: "Invalid subscription plan" },
          { status: 400 }
        );
      }

      const priceCents =
        billingPeriod === "yearly" ? plan.priceCentsYearly : plan.priceCentsMonthly;
      const interval = billingPeriod === "yearly" ? "year" : "month";

      paymentRecord = await prisma.paymentRecord.create({
        data: {
          userId: user.id,
          type: "subscription",
          credits: plan.credits,
          amount: priceCents,
          currency: "usd",
          status: "pending",
          metadata: { planId: plan.id, billingPeriod },
        },
      });

      session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Fluid ${plan.name} — ${billingPeriod === "yearly" ? "Yearly" : "Monthly"}`,
                description: `${plan.credits} credits per ${billingPeriod === "yearly" ? "year" : "month"}. Cancel anytime.`,
              },
              unit_amount: priceCents,
              recurring: { interval: interval as "month" | "year" },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          paymentRecordId: paymentRecord.id,
          credits: String(plan.credits),
          type: "subscription",
          billingPeriod,
        },
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/checkout/cancel`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid type" },
        { status: 400 }
      );
    }

    // Update payment record with Stripe session ID
    await prisma.paymentRecord.update({
      where: { id: paymentRecord.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      success: true,
      data: { sessionUrl: session.url },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Checkout session error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
