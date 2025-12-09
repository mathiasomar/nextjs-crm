export type User = {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  password: string;
  avatarUrl?: string;
  role: "ADMIN" | "MANAGER" | "AGENT" | "SUPPORT";
  department?: string; // 'Sales', 'Support', 'Marketing'
  isActive?: boolean;
  createdAt?: Date;
};
