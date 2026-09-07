import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const promptSchema = z.object({
  name: z.string().min(1).max(100),
  displayName: z.string().min(1).max(200),
  type: z.enum(["image", "video", "enhance"]),
  prompt: z.string().min(1).max(10000),
  description: z.string().optional(),
  active: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const data = promptSchema.parse(body);

    const systemPrompt = await prisma.systemPrompt.create({ data });

    return NextResponse.json({ success: true, data: systemPrompt });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error("Admin create prompt error:", error);
    return NextResponse.json({ success: false, error: "Failed to create prompt" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const prompts = await prisma.systemPrompt.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: prompts });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    console.error("Admin list prompts error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch prompts" }, { status: 500 });
  }
}
