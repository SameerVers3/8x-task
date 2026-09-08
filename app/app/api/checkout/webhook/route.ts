import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markPaymentFailed(session.id);
        break;
      }
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    console.log(`Session ${session.id} not paid. Status: ${session.payment_status}`);
    return;
  }

  const metadata = session.metadata || {};
  const userId = metadata.userId;
  const paymentRecordId = metadata.paymentRecordId;
  const credits = parseInt(metadata.credits || "0", 10);
  const type = metadata.type;

  if (!userId || !paymentRecordId || !credits) {
    console.error("Missing metadata in session:", session.id);
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Update payment record
    await tx.paymentRecord.updateMany({
      where: { stripeSessionId: session.id },
      data: {
        status: "completed",
        stripePaymentId: session.payment_intent as string || null,
      },
    });

    // Add credits to user
    await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: credits } },
    });

    // Record credit transaction
    await tx.creditTransaction.create({
      data: {
        userId,
        amount: credits,
        type: "topup",
        description:
          type === "subscription"
            ? `Subscription credits: ${credits}`
            : `Credit pack: ${credits} credits`,
      },
    });
  });

  console.log(`Processed ${type} for user ${userId}: +${credits} credits`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Skip the first invoice — it's handled by checkout.session.completed
  const billingReason = invoice.billing_reason;
  if (billingReason === "subscription_create") {
    return;
  }

  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  // Get subscription to find metadata
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const metadata = subscription.metadata || {};
  const userId = metadata.userId;
  const credits = parseInt(metadata.credits || "0", 10);

  if (!userId || !credits) {
    console.error("Missing metadata in subscription:", subscriptionId);
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Create payment record for this recurring invoice
    await tx.paymentRecord.create({
      data: {
        userId,
        type: "subscription",
        credits,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: "completed",
        stripeInvoiceId: invoice.id,
        metadata: { subscriptionId, invoiceNumber: invoice.number },
      },
    });

    // Add credits to user
    await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: credits } },
    });

    // Record credit transaction
    await tx.creditTransaction.create({
      data: {
        userId,
        amount: credits,
        type: "topup",
        description: `Monthly subscription refill: ${credits} credits`,
      },
    });
  });

  console.log(`Processed subscription refill for user ${userId}: +${credits} credits`);
}

async function markPaymentFailed(sessionId: string) {
  await prisma.paymentRecord.updateMany({
    where: { stripeSessionId: sessionId },
    data: { status: "failed" },
  });
}
