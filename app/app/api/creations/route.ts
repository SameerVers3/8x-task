import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { requireAuth } from "@/lib/auth";
import { generateImage, generateVideo } from "@/config/inference";
import { fetchAndUploadToR2, generateR2Key, isR2Configured } from "@/lib/storage";
import { z } from "zod";

const createCreationSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(10000),
  negativePrompt: z.string().optional(),
  modelId: z.string().min(1, "Model is required"),
  systemPromptId: z.string().optional(),
  width: z.number().int().min(64).max(4096).optional(),
  height: z.number().int().min(64).max(4096).optional(),
  seed: z.number().int().optional(),
  nologo: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req);

    const body = await req.json();
    const { prompt, negativePrompt, modelId, systemPromptId, width, height, seed, nologo } =
      createCreationSchema.parse(body);

    // Get model config and verify credit cost
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

    // Build final prompt with system prompt if provided
    let finalPrompt = prompt;
    if (systemPromptId) {
      const systemPrompt = await prisma.systemPrompt.findFirst({
        where: { id: systemPromptId, active: true },
      });
      if (systemPrompt) {
        finalPrompt = `${systemPrompt.prompt}\n\n${prompt}`;
      }
    }

    // Create creation record (pending)
    const creation = await prisma.creation.create({
      data: {
        userId,
        type: model.type,
        prompt: finalPrompt,
        negativePrompt,
        status: "processing",
        creditsUsed: model.creditCost,
        modelId: model.id,
        metadata: {
          originalPrompt: prompt,
          systemPromptId: systemPromptId || null,
          width: width || (model.config as any)?.width || 1024,
          height: height || (model.config as any)?.height || 1024,
          seed,
          nologo,
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
        type: "creation",
        description: `Created ${model.type} with ${model.displayName}`,
        creationId: creation.id,
      },
    });

    // Call inference API in the background
    (async () => {
      try {
        let result;

        if (model.type === "image") {
          result = await generateImage({
            prompt: finalPrompt,
            width: width || (model.config as any)?.width || 1024,
            height: height || (model.config as any)?.height || 1024,
            seed,
            negative_prompt: negativePrompt,
            nologo,
            model: model.name,
          });
        } else if (model.type === "video") {
          result = await generateVideo({
            prompt: finalPrompt,
            width: width || (model.config as any)?.width || 512,
            height: height || (model.config as any)?.height || 512,
            model: model.name,
          });
        } else {
          throw new Error(`Unsupported model type: ${model.type}`);
        }

        if (result.success && result.data) {
          let resultUrl = result.data.image_url || result.data.video_url || null;

          // Upload to R2 for permanent storage
          if (resultUrl && isR2Configured()) {
            try {
              const r2Key = generateR2Key(userId, creation.id, model.type);
              resultUrl = await fetchAndUploadToR2(resultUrl, r2Key);
            } catch (r2Error) {
              console.error("R2 upload failed, keeping inference URL:", r2Error);
              // Fallback: keep the inference URL
            }
          }

          await prisma.creation.update({
            where: { id: creation.id },
            data: {
              status: "completed",
              resultUrl,
              metadata: {
                ...(creation.metadata as any),
                inferenceResponse: result,
              },
            },
          });
        } else {
          await prisma.creation.update({
            where: { id: creation.id },
            data: {
              status: "failed",
              metadata: {
                ...(creation.metadata as any),
                error: result.error || "Generation failed",
              },
            },
          });

          // Refund credits on failure
          await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: model.creditCost } },
          });

          await prisma.creditTransaction.create({
            data: {
              userId,
              amount: model.creditCost,
              type: "refund",
              description: `Refund for failed ${model.type} creation`,
              creationId: creation.id,
            },
          });
        }
      } catch (error) {
        console.error("Generation error:", error);

        await prisma.creation.update({
          where: { id: creation.id },
          data: {
            status: "failed",
            metadata: {
              ...(creation.metadata as any),
              error: error instanceof Error ? error.message : "Unknown error",
            },
          },
        });

        // Refund credits on failure
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: model.creditCost } },
        });

        await prisma.creditTransaction.create({
          data: {
            userId,
            amount: model.creditCost,
            type: "refund",
            description: `Refund for failed ${model.type} creation`,
            creationId: creation.id,
          },
        });
      }
    })();

    return NextResponse.json({
      success: true,
      data: {
        creation: {
          id: creation.id,
          status: creation.status,
          type: creation.type,
          prompt: creation.prompt,
          creditsUsed: creation.creditsUsed,
          createdAt: creation.createdAt,
        },
        message: "Generation started. Check back for results.",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Create creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start generation" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req);

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
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
          revisions: {
            orderBy: { createdAt: "desc" },
            select: { id: true, status: true, resultUrl: true, createdAt: true },
          },
          enhancements: {
            orderBy: { createdAt: "desc" },
            select: { id: true, type: true, status: true, resultUrl: true, createdAt: true },
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
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("List creations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch creations" },
      { status: 500 }
    );
  }
}
