import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const modelSchema = z.object({
  name: z.string().min(1).max(100),
  displayName: z.string().min(1).max(200),
  type: z.enum(["image", "video", "enhance"]),
  provider: z.string().min(1),
  creditCost: z.number().int().min(1),
  config: z.record(z.any()).optional().default({}),
  active: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const data = modelSchema.parse(body);

    const model = await prisma.modelConfig.create({ data });

    return NextResponse.json({ success: true, data: model });
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
    console.error("Admin create model error:", error);
    return NextResponse.json({ success: false, error: "Failed to create model" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const models = await prisma.modelConfig.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: models });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    console.error("Admin list models error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch models" }, { status: 500 });
  }
}
