export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: "free" | "luxe" | "studio";
  createdAt: string;
}
