"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useTranslations } from "next-intl";

interface RegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dojoId: string;
  dojoName: string;
  dojoEmail?: string;
}

export default function RegistrationDialog({
  isOpen,
  onClose,
  dojoId,
  dojoName,
  dojoEmail,
}: RegistrationDialogProps) {
  const t = useTranslations("dojos");
  
  const [formData, setFormData] = useState({
    contactName: "",
    contactInfo: "",
    studentAge: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/dojos/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dojoId,
          dojoName,
          dojoEmail,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit registration");
      }

      setStatus("success");
      // Optional: auto-close after a delay
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setFormData({ contactName: "", contactInfo: "", studentAge: "", message: "" });
      }, 3000);

    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-sumi/60 backdrop-blur-sm"
        />

        {/* Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-washi rounded-sm shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-japan-blue/10 bg-washi-cream">
            <div>
              <h2 className="font-serif text-xl text-sumi">
                {t("registerButton")}
              </h2>
              <p className="text-sm text-sumi-muted mt-1">{dojoName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-sumi-muted hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={28} />
                </div>
                <h3 className="text-xl font-serif text-sumi mb-2">
                  {t("successMessageTitle", { fallback: "Thành công!" })}
                </h3>
                <p className="text-sumi-muted">
                  {t("successMessage")}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-sumi mb-1">
                    {t("contactName")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-japan-blue/20 rounded-sm focus:outline-none focus:border-japan-blue focus:ring-1 focus:ring-japan-blue transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo" className="block text-sm font-medium text-sumi mb-1">
                    {t("contactInfo")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    required
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-japan-blue/20 rounded-sm focus:outline-none focus:border-japan-blue focus:ring-1 focus:ring-japan-blue transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="studentAge" className="block text-sm font-medium text-sumi mb-1">
                    {t("studentAge")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="studentAge"
                    name="studentAge"
                    required
                    value={formData.studentAge}
                    onChange={handleChange}
                    placeholder="VD: 8 tuổi, hoặc Người lớn"
                    className="w-full px-4 py-2 bg-white border border-japan-blue/20 rounded-sm focus:outline-none focus:border-japan-blue focus:ring-1 focus:ring-japan-blue transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-sumi mb-1">
                    {t("messageOptional")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-japan-blue/20 rounded-sm focus:outline-none focus:border-japan-blue focus:ring-1 focus:ring-japan-blue transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <div className="pt-4 mt-6 border-t border-japan-blue/10 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={status === "submitting"}
                    className="px-4 py-2 text-sumi-muted hover:text-sumi transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn-solid min-w-[120px] flex justify-center"
                  >
                    {status === "submitting" ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Đang gửi...
                      </span>
                    ) : (
                      t("submit")
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
