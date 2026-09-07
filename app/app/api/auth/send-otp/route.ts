import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/database";
import { generateOTP, getOTPExpiry } from "@/config/auth";
import { sendOTP } from "@/config/email";
import { z } from "zod";

const sendOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = sendOTPSchema.parse(body);

    const code = generateOTP();
    const expiresAt = getOTPExpiry();

    // Clean up old unused OTPs for this email
    await prisma.oTP.deleteMany({
      where: {
        email,
        used: false,
        expiresAt: { lt: new Date() },
      },
    });

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Create OTP record
    await prisma.oTP.create({
      data: {
        email,
        code,
        expiresAt,
        used: false,
        userId: existingUser?.id,
      },
    });

    // Send email
    await sendOTP(email, code);

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
