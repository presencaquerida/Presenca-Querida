export function hasAdminAccess(request: Request): boolean {
  const requiredToken = process.env.ADMIN_ACCESS_TOKEN;

  if (!requiredToken || requiredToken === "troque-este-token") {
    return true;
  }

  const headerToken = request.headers.get("x-admin-token");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return headerToken === requiredToken || bearer === requiredToken;
}
