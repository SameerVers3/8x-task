import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAuth } from "@/lib/auth";
import { generateImage, generateVideo } from "@/config/inference";
import { z } from "zod";

const revisionSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(10000),
  negativePrompt: z.string().optional(),
  modelId: z.string().min(1, "Model is required"),
  systemPromptId: z.string().optional(),
  width: z.number().int().min(64).max(4096).optional(),
  height: z.number().int().min(64).max(4096).optional(),
  seed: z.number().int().optional(),
  nologo: z.boolean().optional().default(true),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(req);
    const { id: creationId } = await params;

    const body = await req.json();
    const { prompt, negativePrompt, modelId, systemPromptId, width, height, seed, nologo } =
      revisionSchema.parse(body);

    // Verify creation belongs to user
    const creation = await prisma.creation.findFirst({
      where: { id: creationId, userId },
    });

    if (!creation) {
      return NextResponse.json(
        { success: false, error: "Creation not found" },
        { status: 404 }
      );
    }

    // Get model config
    const model = await prisma.modelConfig.findFirst({
      where: { id: modelId, active: true },
    });

    if (!model) {
      return NextResponse.json(
        { success: false, error: "Model not found or inactive" },
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

    // Build final prompt
    let finalPrompt = prompt;
    if (systemPromptId) {
      const systemPrompt = await prisma.systemPrompt.findFirst({
        where: { id: systemPromptId, active: true },
      });
      if (systemPrompt) {
        finalPrompt = `${systemPrompt.prompt}\n\n${prompt}`;
      }
    }

    // Create revision record
    const revision = await prisma.revision.create({
      data: {
        creationId,
        prompt: finalPrompt,
        negativePrompt,
        status: "processing",
        creditsUsed: model.creditCost,
        modelId: model.id,
        metadata: {
          originalPrompt: prompt,
          systemPromptId: systemPromptId || null,
          width: width || model.config?.width || 1024,
          height: height || model.config?.height || 1024,
          seed,
          nologo,
          parentCreationId: creationId,
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
        type: "revision",
        description: `Revision of ${creation.type} with ${model.displayName}`,
        revisionId: revision.id,
      },
    });

    // Call inference API in background
    (async () => {
      try {
        let result;

        if (model.type === "image") {
          result = await generateImage({
            prompt: finalPrompt,
            width: width || model.config?.width || 1024,
            height: height || model.config?.height || 1024,
            seed,
            negative_prompt: negativePrompt,
            nologo,
            model: model.name,
          });
        } else if (model.type === "video") {
          result = await generateVideo({
            prompt: finalPrompt,
            width: width || model.config?.width || 512,
            height: height || model.config?.height || 512,
            model: model.name,
          });
        } else {
          throw new Error(`Unsupported model type: ${model.type}`);
        }

        if (result.success && result.data) {
          await prisma.revision.update({
            where: { id: revision.id },
            data: {
              status: "completed",
              resultUrl: result.data.image_url || result.data.video_url || null,
              metadata: {
                ...revision.metadata,
                inferenceResponse: result,
              },
            },
          });
        } else {
          await prisma.revision.update({
            where: { id: revision.id },
            data: {
              status: "failed",
              metadata: {
                ...revision.metadata,
                error: result.error || "Generation failed",
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
              description: `Refund for failed revision`,
              revisionId: revision.id,
            },
          });
        }
      } catch (error) {
        console.error("Revision generation error:", error);

        await prisma.revision.update({
          where: { id: revision.id },
          data: {
            status: "failed",
            metadata: {
              ...revision.metadata,
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
            description: `Refund for failed revision`,
            revisionId: revision.id,
          },
        });
      }
    })();

    return NextResponse.json({
      success: true,
      data: {
        revision: {
          id: revision.id,
          status: revision.status,
          prompt: revision.prompt,
          creditsUsed: revision.creditsUsed,
          createdAt: revision.createdAt,
        },
        message: "Revision generation started. Check back for results.",
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

    console.error("Create revision error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start revision" },
      { status: 500 }
    );
  }
}
