"use client";

import {
  LogOut,
  UserCircle,
  Users,
  User2,
  Home,
  Database,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Tutup sidebar saat route berubah (untuk mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-blue-900 text-white rounded-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside
        className={clsx(
          "fixed h-full pt-23 w-64 bg-blue-900 flex flex-col transition-transform duration-300 py-6 px-4 text-white",
          {
            "translate-x-0": isOpen,
            "-translate-x-full sm:translate-x-0": !isOpen,
          }
        )}
      >
        {/* Atas: Profil & Navigasi */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col items-center py-6 border-b border-white/30">
            <UserCircle size={48} />
            <p className="mt-2 text-sm font-semibold uppercase">
              {user?.username}
            </p>
            <p className="text-xs text-gray-300">{user?.role}</p>
          </div>

          <nav className="mt-6 px-4 space-y-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className={clsx(
                "block border-b border-white/30 pb-2 flex items-center gap-2",
                pathname === "/dashboard"
                  ? "text-[#F26A21]" // oranye untuk aktif
                  : "hover:text-[#ffffff]" 
              )}
            >
              <Home size={16} />
              Beranda
            </Link>
            <Link
              href="/data"
              className={clsx(
                "block border-b border-white/30 pb-2 flex items-center gap-2",
                pathname === "/data"
                  ? "text-[#F26A21]" // oranye untuk aktif
                  : "hover:text-[#ffffff]" 
              )}
            >
              <Database size={16} />
              List Aktivitas User
            </Link>
            <Link
              href="/user"
              className={clsx(
                "block border-b border-white/30 pb-2 flex items-center gap-2",
                pathname === "/user"
                  ? "text-[#F26A21]" // oranye untuk aktif
                  : "hover:text-[#ffffff]" 
              )}
            >
              <Users size={16} />
              Nominatif User BS
            </Link>

            {/* Hanya Super Admin */}
            {user?.role === "superadmin" && (
              <>
                <Link
                  href="/admin"
                  className={clsx(
                    "block border-b border-white/30 pb-2 flex items-center gap-2",
                    pathname === "/admin"
                      ? "text-[#F26A21]" // oranye untuk aktif
                      : "hover:text-[#ffffff]" 
                  )}
                >
                  <User2 size={16} />
                  Manajemen Admin
                </Link>
                <Link
                  href="/admin/options"
                  className={clsx(
                    "block border-b border-white/30 pb-2 flex items-center gap-2",
                    pathname === "/admin/option"
                      ? "text-[#F26A21]" // oranye untuk aktif
                      : "hover:text-[#ffffff]" 
                  )}
                >
                  <Settings size={16} />
                  Manajemen Dropdown
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-4">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
