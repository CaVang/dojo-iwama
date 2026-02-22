"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Shield, Settings, LayoutDashboard } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const { user, profile, isAdmin, isDojoChief, signOut, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("dashboard");

  // Check for first time Dojo Owner
  useEffect(() => {
    if (isDojoChief && typeof window !== "undefined") {
      const hasSeenGuide = localStorage.getItem("dojo_owner_guide_seen");
      if (!hasSeenGuide) {
        setShowGuide(true);
      }
      
      // Fetch unread registrations
      const fetchUnread = async () => {
        try {
           const res = await fetch('/api/dashboard/dojo/notifications/unread');
           if (res.ok) {
             const data = await res.json();
             setUnreadCount(data.unreadCount || 0);
           }
        } catch (e) {
           console.error(e);
        }
      };
      
      fetchUnread();
    }
  }, [isDojoChief]);

  const dismissGuide = () => {
    setShowGuide(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("dojo_owner_guide_seen", "true");
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (showGuide) {
      dismissGuide();
    }
  };

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
        onClick={handleToggle}
        className="flex items-center gap-2 focus:outline-none relative"
      >
        <div className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-colors ${showGuide ? 'border-cinnabar shadow-[0_0_15px_rgba(235,94,85,0.5)]' : 'border-japan-blue/20 hover:border-japan-blue'}`}>
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
        
        {/* Red Ping Dot for Notification / Guide */}
        {(unreadCount > 0 || showGuide) && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center z-10 shadow-sm">
            {showGuide && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinnabar opacity-75"></span>}
            <span className={`relative inline-flex flex-col items-center justify-center rounded-full bg-red-600 text-white font-bold text-[10px] leading-none ${unreadCount > 0 ? 'h-4 min-w-[16px] px-1' : 'h-3 w-3'}`}>
              {unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : ''}
            </span>
          </span>
        )}
      </button>

      {/* First Time Guide Popover */}
      <AnimatePresence>
        {showGuide && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-[120%] mt-2 w-72 bg-japan-blue text-washi rounded-md shadow-2xl z-50 p-5 border border-japan-blue/20"
          >
            {/* Arrow pointing up */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-japan-blue rotate-45 rounded-sm" />
            
            <div className="relative z-10">
              <h4 className="font-serif font-bold text-lg mb-2 text-white">{t("guide_title")}</h4>
              <p className="text-sm text-washi/90 mb-4 leading-relaxed">
                {t("guide_desc")}
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); dismissGuide(); }}
                className="w-full bg-washi text-japan-blue font-bold py-2.5 rounded hover:bg-washi-cream transition-colors shadow-sm"
              >
                {t("guide_got_it")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {isDojoChief && (
                <Link
                  href={`/${locale}/dashboard/dojo/registrations`}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-between items-center px-4 py-2 hover:bg-japan-blue/5 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-sm text-sumi">
                     <LayoutDashboard size={16} />
                     <span>Quản lý Dojo</span>
                  </div>
                  {unreadCount > 0 && (
                     <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {unreadCount}
                     </span>
                  )}
                </Link>
              )}
              
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
