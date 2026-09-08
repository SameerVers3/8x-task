import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req);

    const records = await prisma.paymentRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        credits: user?.credits ?? 0,
        records,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Billing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch billing history" },
      { status: 500 }
    );
  }
}
