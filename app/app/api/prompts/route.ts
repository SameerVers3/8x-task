import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const prompts = await prisma.systemPrompt.findMany({
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
        prompt: true,
        description: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: prompts });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("List prompts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}
