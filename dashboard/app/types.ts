export type User = {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  role: "AMIN" | "MANAGER" | "AGENT" | "SUPPORT";
  department?: string; // 'Sales', 'Support', 'Marketing'
  isActive: boolean;
  createdAt: Date;
};
