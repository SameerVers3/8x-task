import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { createToken, CREDIT_CONSTANTS } from "@/config/auth";
import { z } from "zod";

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Code must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = verifyOTPSchema.parse(body);

    // Find the most recent unused OTP for this email
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // New user - create with signup credits
      user = await prisma.user.create({
        data: {
          email,
          credits: CREDIT_CONSTANTS.DEFAULT_SIGNUP_CREDITS,
        },
      });

      // Record signup bonus transaction
      await prisma.creditTransaction.create({
        data: {
          userId: user.id,
          amount: CREDIT_CONSTANTS.DEFAULT_SIGNUP_CREDITS,
          type: "signup_bonus",
          description: "Welcome signup bonus",
        },
      });
    }

    // Create JWT token
    const token = await createToken({ userId: user.id, email: user.email });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          credits: user.credits,
        },
        token,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
