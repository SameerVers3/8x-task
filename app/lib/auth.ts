import { verifyToken } from "@/config/auth";
import { prisma } from "@/config/database";
import { NextRequest } from "next/server";

export interface AuthContext {
  userId: string;
  email: string;
}

export async function getAuthUser(req: NextRequest): Promise<AuthContext | null> {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) return null;

    return { userId: user.id, email: user.email };
  } catch {
    return null;
  }
}

export async function requireAuth(req: NextRequest): Promise<AuthContext> {
  const user = await getAuthUser(req);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<AuthContext> {
  const user = await requireAuth(req);
  // Check if user is admin (for now, check a specific email or env config)
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean);
  if (!adminEmails.includes(user.email)) {
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}
