"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = [], 
  redirectTo = "/auth/login" 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for auth state to be loaded from localStorage
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.push(redirectTo);
      return;
    }

    // If specific roles are required, check user role
    if (requiredRole.length > 0 && !requiredRole.includes(user.role)) {
      // Redirect based on user role
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else if (user.role === 'VENDOR') {
        router.push('/vendor');
      } else {
        router.push('/');
      }
      return;
    }
  }, [isAuthenticated, user, isLoading, router, requiredRole, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or wrong role
  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole.length > 0 && !requiredRole.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
