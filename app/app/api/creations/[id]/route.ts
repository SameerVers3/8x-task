import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(req);
    const { id } = await params;

    const creation = await prisma.creation.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        model: {
          select: { id: true, name: true, displayName: true, type: true },
        },
        revisions: {
          orderBy: { createdAt: "desc" },
          include: {
            model: {
              select: { id: true, name: true, displayName: true },
            },
          },
        },
        enhancements: {
          orderBy: { createdAt: "desc" },
        },
        creditTransactions: {
          orderBy: { createdAt: "desc" },
          select: { id: true, amount: true, type: true, description: true, createdAt: true },
        },
      },
    });

    if (!creation) {
      return NextResponse.json(
        { success: false, error: "Creation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: creation });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Get creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch creation" },
      { status: 500 }
    );
  }
}
