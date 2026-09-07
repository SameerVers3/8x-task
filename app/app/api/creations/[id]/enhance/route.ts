import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAuth } from "@/lib/auth";
import { enhanceImage } from "@/config/inference";
import { z } from "zod";

const enhanceSchema = z.object({
  enhancementType: z.enum(["upscale", "denoise", "restore", "style_transfer"]),
  scaleFactor: z.number().min(1).max(4).optional().default(2),
  modelId: z.string().min(1, "Enhancement model is required"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(req);
    const { id: creationId } = await params;

    const body = await req.json();
    const { enhancementType, scaleFactor, modelId } = enhanceSchema.parse(body);

    // Verify creation belongs to user and has a result
    const creation = await prisma.creation.findFirst({
      where: { id: creationId, userId },
    });

    if (!creation) {
      return NextResponse.json(
        { success: false, error: "Creation not found" },
        { status: 404 }
      );
    }

    if (!creation.resultUrl) {
      return NextResponse.json(
        { success: false, error: "Creation has no result to enhance" },
        { status: 400 }
      );
    }

    // Get model config
    const model = await prisma.modelConfig.findFirst({
      where: { id: modelId, active: true },
    });

    if (!model) {
      return NextResponse.json(
        { success: false, error: "Enhancement model not found or inactive" },
        { status: 404 }
      );
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < model.creditCost) {
      return NextResponse.json(
        { success: false, error: "Insufficient credits" },
        { status: 403 }
      );
    }

    // Create enhancement record
    const enhancement = await prisma.enhancement.create({
      data: {
        creationId,
        type: enhancementType,
        status: "processing",
        creditsUsed: model.creditCost,
        metadata: {
          scaleFactor,
          modelName: model.name,
        },
      },
    });

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: model.creditCost } },
    });

    // Record transaction
    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: -model.creditCost,
        type: "enhancement",
        description: `${enhancementType} enhancement with ${model.displayName}`,
        enhancementId: enhancement.id,
      },
    });

    // Call inference API in background
    (async () => {
      try {
        const result = await enhanceImage({
          image_url: creation.resultUrl!,
          enhancement_type: enhancementType,
          scale_factor: scaleFactor,
          model: model.name,
        });

        if (result.success && result.data) {
          await prisma.enhancement.update({
            where: { id: enhancement.id },
            data: {
              status: "completed",
              resultUrl: result.data.enhanced_image_url || null,
              metadata: {
                ...enhancement.metadata,
                inferenceResponse: result,
              },
            },
          });
        } else {
          await prisma.enhancement.update({
            where: { id: enhancement.id },
            data: {
              status: "failed",
              metadata: {
                ...enhancement.metadata,
                error: result.error || "Enhancement failed",
              },
            },
          });

          // Refund on failure
          await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: model.creditCost } },
          });

          await prisma.creditTransaction.create({
            data: {
              userId,
              amount: model.creditCost,
              type: "refund",
              description: `Refund for failed enhancement`,
              enhancementId: enhancement.id,
            },
          });
        }
      } catch (error) {
        console.error("Enhancement error:", error);

        await prisma.enhancement.update({
          where: { id: enhancement.id },
          data: {
            status: "failed",
            metadata: {
              ...enhancement.metadata,
              error: error instanceof Error ? error.message : "Unknown error",
            },
          },
        });

        // Refund on failure
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: model.creditCost } },
        });

        await prisma.creditTransaction.create({
          data: {
            userId,
            amount: model.creditCost,
            type: "refund",
            description: `Refund for failed enhancement`,
            enhancementId: enhancement.id,
          },
        });
      }
    })();

    return NextResponse.json({
      success: true,
      data: {
        enhancement: {
          id: enhancement.id,
          status: enhancement.status,
          type: enhancement.type,
          creditsUsed: enhancement.creditsUsed,
          createdAt: enhancement.createdAt,
        },
        message: "Enhancement started. Check back for results.",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Enhancement error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start enhancement" },
      { status: 500 }
    );
  }
}
