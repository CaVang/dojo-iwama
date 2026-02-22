"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Image as ImageIcon } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import Image from "next/image";
import { useTranslations } from "next-intl";

export type BlogType = {
  id: string;
  dojo_id: string;
  event_id: string | null;
  author_id: string;
  title: string;
  summary: string | null;
  content: string;
  image_url: string | null;
  status: string;
  created_at: string;
};

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingBlog?: BlogType | null;
  dojoId: string;
  prefillEventId?: string; // If creating from Event Modal
}

export default function BlogFormModal({
  isOpen,
  onClose,
  onSuccess,
  editingBlog,
  dojoId,
  prefillEventId
}: BlogFormModalProps) {
  const t = useTranslations("blogs.modal");
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    image_url: "",
    status: "published",
    event_id: prefillEventId || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorConfig, setErrorConfig] = useState<string | null>(null);

  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title,
        summary: editingBlog.summary || "",
        content: editingBlog.content,
        image_url: editingBlog.image_url || "",
        status: editingBlog.status,
        event_id: editingBlog.event_id || "",
      });
    } else {
      setFormData({
        title: "",
        summary: "",
        content: "",
        image_url: "",
        status: "published",
        event_id: prefillEventId || "",
      });
    }
    setErrorConfig(null);
  }, [editingBlog, isOpen, prefillEventId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
        setErrorConfig(t("error_required"));
        return;
    }

    setIsSubmitting(true);
    setErrorConfig(null);

    try {
      const url = "/api/dashboard/dojo/blogs";
      const method = editingBlog ? "PATCH" : "POST";
      const body = {
        ...formData,
        dojo_id: dojoId,
        id: editingBlog?.id,
        event_id: formData.event_id || null // Ensure empty string becomes null
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t("error_failed"));
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorConfig(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-washi w-full max-w-5xl rounded shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-japan-blue p-6 flex justify-between items-center sticky top-0 z-20">
            <h2 className="text-2xl font-serif font-bold text-washi">
              {editingBlog ? t("edit_title") : t("create_title")}
            </h2>
            <button
              onClick={onClose}
              className="text-washi/70 hover:text-washi transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
             {errorConfig && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded">
                  {errorConfig}
                </div>
             )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
              
              {/* Left Column: Metadata */}
              <div className="lg:col-span-1 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-sumi mb-2">{t("title_label")}</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 border border-japan-blue/20 rounded bg-white text-sumi focus:border-japan-blue focus:ring-1 focus:ring-japan-blue transition-all"
                      placeholder={t("title_placeholder")}
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-sumi mb-2">{t("summary_label")}</label>
                    <textarea
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full p-3 border border-japan-blue/20 rounded bg-white text-sumi focus:border-japan-blue focus:ring-1 focus:ring-japan-blue transition-all h-24"
                      placeholder={t("summary_placeholder")}
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-sumi mb-2">{t("thumbnail_label")}</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ImageIcon size={16} className="text-sumi-muted" />
                        </div>
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          className="w-full pl-10 p-3 border border-japan-blue/20 rounded bg-white text-sumi focus:border-japan-blue transition-all text-sm"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    {/* Image Preview */}
                    {formData.image_url && (
                        <div className="mt-3 relative w-full h-32 rounded overflow-hidden border border-japan-blue/10 bg-sumi-muted/10">
                            <Image 
                               src={formData.image_url} 
                               alt="Preview" 
                               fill 
                               className="object-cover"
                               onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.style.display = 'none';
                               }}
                            />
                        </div>
                    )}
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-sumi mb-2">{t("status_label")}</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-3 border border-japan-blue/20 rounded bg-white text-sumi"
                    >
                      <option value="published">{t("status_published")}</option>
                      <option value="draft">{t("status_draft")}</option>
                    </select>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold text-sumi mb-2">{t("event_id_label")}</label>
                    <input
                      type="text"
                      value={formData.event_id}
                      onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                      className="w-full p-3 border border-japan-blue/20 rounded bg-white text-sumi focus:border-japan-blue text-sm"
                      placeholder={t("event_id_placeholder")}
                    />
                 </div>
              </div>

              {/* Right Column: Rich Text Editor */}
              <div className="lg:col-span-2 flex flex-col">
                 <label className="block text-sm font-bold text-sumi mb-2">{t("content_label")}</label>
                 <div className="flex-1 min-h-[500px] border border-japan-blue/20 rounded overflow-hidden bg-white shadow-inner relative">
                    {/* The RichTextEditor uses TipTap and grows internally */}
                    <RichTextEditor 
                       content={formData.content} 
                       onChange={(html) => setFormData({...formData, content: html})}
                    />
                 </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-japan-blue/10">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 border border-japan-blue/20 text-sumi rounded hover:bg-black/5 transition-colors disabled:opacity-50"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-japan-blue text-white rounded hover:bg-japan-blue/90 font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    {editingBlog ? t("save") : t("publish")}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
