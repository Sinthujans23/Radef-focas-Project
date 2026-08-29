import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const secretValue = process.env.JWT_SECRET || "dev-only-insecure-secret-change-me";
const secret = new TextEncoder().encode(secretValue);

export type AdminTokenPayload = {
  adminId: string;
  username: string;
};

export async function signAdminToken(payload: AdminTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.adminId === "string" && typeof payload.username === "string") {
      return { adminId: payload.adminId, username: payload.username };
    }
    return null;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
