import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const where = {
      status: "completed" as const,
      resultUrl: { not: null },
      ...(type ? { type } : {}),
    };

    const [creations, total] = await Promise.all([
      prisma.creation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          model: {
            select: { id: true, name: true, displayName: true, type: true },
          },
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),
      prisma.creation.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: creations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Gallery error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}
