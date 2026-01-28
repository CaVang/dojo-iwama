"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import PageTransition from "@/components/animations/PageTransition";

export default function ProfilePage() {
  const { user, profile, role, isAdmin, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createClient();

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setIsSaving(false);

    if (error) {
      setMessage({
        type: "error",
        text: "Không thể lưu thông tin. Vui lòng thử lại.",
      });
    } else {
      setMessage({ type: "success", text: "Đã lưu thông tin thành công!" });
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-japan-blue" />
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-sumi mb-4">
              Vui lòng đăng nhập
            </h1>
            <p className="text-sumi-muted">
              Bạn cần đăng nhập để xem trang này.
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 section-padding bg-washi">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-serif text-sumi mb-2">
              Hồ sơ cá nhân
            </h1>
            <p className="text-sumi-muted">
              Quản lý thông tin tài khoản của bạn
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-washi-cream border border-japan-blue/10 p-8"
          >
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-japan-blue/10">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-japan-blue/20">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-japan-blue/10 flex items-center justify-center">
                    <User className="w-10 h-10 text-japan-blue" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-serif text-sumi">
                  {displayName || user.email?.split("@")[0]}
                </h2>
                <div className="flex items-center gap-2 text-sm text-sumi-muted mt-1">
                  <Mail size={14} />
                  {user.email}
                </div>
                {role && (
                  <div className="flex items-center gap-2 mt-2">
                    <Shield
                      size={14}
                      className={isAdmin ? "text-cinnabar" : "text-japan-blue"}
                    />
                    <span
                      className={`text-sm ${
                        isAdmin ? "text-cinnabar" : "text-japan-blue"
                      }`}
                    >
                      {role === "admin"
                        ? "Administrator"
                        : role === "content_moderator"
                          ? "Content Moderator"
                          : role === "dojo_chief"
                            ? "Dojo Chief"
                            : "User"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-sumi mb-2"
                >
                  Tên hiển thị
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-washi border border-japan-blue/20 focus:border-japan-blue focus:outline-none transition-colors"
                  placeholder="Nhập tên hiển thị"
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-sumi mb-2"
                >
                  Giới thiệu
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-washi border border-japan-blue/20 focus:border-japan-blue focus:outline-none transition-colors resize-none"
                  placeholder="Giới thiệu về bản thân..."
                />
              </div>

              {/* Account Info */}
              <div className="pt-4 border-t border-japan-blue/10">
                <div className="flex items-center gap-2 text-sm text-sumi-muted">
                  <Calendar size={14} />
                  <span>
                    Tham gia từ:{" "}
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`p-4 text-sm ${
                    message.type === "success"
                      ? "bg-bamboo/10 text-bamboo border border-bamboo/20"
                      : "bg-cinnabar/10 text-cinnabar border border-cinnabar/20"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Save Button */}
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-japan-blue text-washi font-medium hover:bg-sumi transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
