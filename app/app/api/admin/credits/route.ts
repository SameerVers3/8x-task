import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const creditTopupSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  amount: z.number().int().positive("Amount must be positive"),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { userId, amount, description } = creditTopupSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    });

    await prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type: "topup",
        description: description || `Admin credit top-up of ${amount} credits`,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userId,
        newBalance: updatedUser.credits,
        added: amount,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("Admin credit topup error:", error);
    return NextResponse.json({ success: false, error: "Failed to add credits" }, { status: 500 });
  }
}
