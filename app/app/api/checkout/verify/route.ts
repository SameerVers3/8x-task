import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAuth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing session_id" },
        { status: 400 }
      );
    }

    const record = await prisma.paymentRecord.findFirst({
      where: { stripeSessionId: sessionId, userId },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Payment record not found" },
        { status: 404 }
      );
    }

    if (record.status === "completed") {
      return NextResponse.json({
        success: true,
        data: { status: "completed", credits: record.credits },
      });
    }

    // Poll Stripe for latest status
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isPaid =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required";

    if (isPaid && record.status !== "completed") {
      await prisma.$transaction(async (tx) => {
        await tx.paymentRecord.updateMany({
          where: { stripeSessionId: sessionId },
          data: { status: "completed" },
        });
        await tx.user.update({
          where: { id: userId },
          data: { credits: { increment: record.credits } },
        });
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: record.credits,
            type: "topup",
            description:
              record.type === "subscription"
                ? `Subscription credits: ${record.credits}`
                : `Credit pack: ${record.credits} credits`,
          },
        });
      });

      return NextResponse.json({
        success: true,
        data: { status: "completed", credits: record.credits },
      });
    }

    return NextResponse.json({
      success: true,
      data: { status: record.status, credits: record.credits },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Verify checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify checkout" },
      { status: 500 }
    );
  }
}
