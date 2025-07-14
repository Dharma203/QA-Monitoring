"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuperAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "superadmin") {
        router.push("/"); // redirect ke halaman utama
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) return <p>Loading...</p>;
  if (!user || user.role !== "superadmin") return null;

  return <>{children}</>;
}
