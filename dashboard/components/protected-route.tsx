"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "AGENT" | "MANAGER" | "ADMIN" | "SUPPORT";
  requireVerification?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredRole = "AGENT",
  requireVerification = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (!isLoading && user) {
      // Check role
      const roles = ["AGENT", "MANAGER", "ADMIN", "SUPPORT"];
      const userRoleIndex = roles.indexOf(user.role);
      const requiredRoleIndex = roles.indexOf(requiredRole);

      if (userRoleIndex < requiredRoleIndex) {
        router.push("/unauthorized");
        return;
      }

      // Check verification
      if (requireVerification && !user.isVerified) {
        router.push("/verify-email");
        return;
      }
    }
  }, [user, isLoading, router, requiredRole, requireVerification]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
