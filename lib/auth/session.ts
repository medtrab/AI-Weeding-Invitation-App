import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export type SessionUser = { id: string; name?: string | null; email?: string | null; image?: string | null };

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  if (!user?.id) return null;
  return user;
}
