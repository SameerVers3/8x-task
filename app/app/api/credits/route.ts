import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/config/database";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const transactions = await prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        creation: {
          select: { id: true, type: true, prompt: true, status: true },
        },
        revision: {
          select: { id: true, status: true },
        },
        enhancement: {
          select: { id: true, type: true, status: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        balance: user.credits,
        transactions: transactions.map((t) => ({
          id: t.id,
          amount: t.amount,
          type: t.type,
          description: t.description,
          createdAt: t.createdAt,
          relatedItem: t.creation || t.revision || t.enhancement,
        })),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Get credits error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
