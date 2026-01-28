"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Shield, Settings } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-japan-blue/10 animate-pulse" />
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    profile?.display_name || user.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-japan-blue/20 hover:border-japan-blue transition-colors">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-japan-blue/10 flex items-center justify-center">
              <User className="w-5 h-5 text-japan-blue" />
            </div>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white border border-japan-blue/10 shadow-lg z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-japan-blue/10">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-japan-blue/20">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-japan-blue/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-japan-blue" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sumi truncate">{displayName}</p>
                  <p className="text-xs text-sumi-muted truncate">
                    {user.email}
                  </p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 text-xs text-cinnabar mt-1">
                      <Shield size={10} />
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href={`/${locale}/profile`}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sumi hover:bg-japan-blue/5 transition-colors"
              >
                <Settings size={16} />
                <span>Hồ sơ cá nhân</span>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sumi hover:bg-japan-blue/5 transition-colors"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
