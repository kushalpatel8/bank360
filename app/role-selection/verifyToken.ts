"use server";

export async function verifyAdminToken(token: string) {
  const expectedToken = process.env.ADMIN_TOKEN;
  if (!expectedToken) {
    console.error("ADMIN_TOKEN is not defined in environment variables");
    return false;
  }
  return token === expectedToken;
}
