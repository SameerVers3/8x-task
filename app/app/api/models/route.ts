import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const models = await prisma.modelConfig.findMany({
      where: {
        active: true,
        ...(type ? { type } : {}),
      },
      orderBy: { type: "asc" },
      select: {
        id: true,
        name: true,
        displayName: true,
        type: true,
        provider: true,
        creditCost: true,
        config: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: models });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("List models error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
