"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Calendar, FileText, Image as ImageIcon, Link as LinkIcon, Globe } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import BlogFormModal, { BlogType } from "./BlogFormModal";

export default function BlogsPage() {
  const t = useTranslations("blogs.dashboard");
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dojoId, setDojoId] = useState<string>("dojo-1");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/dojo/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
        if (data.blogs && data.blogs.length > 0) {
           setDojoId(data.blogs[0].dojo_id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string, currentDojoId: string) => {
    if (!window.confirm(t("confirm_delete"))) return;
    try {
      const res = await fetch(`/api/dashboard/dojo/blogs?id=${id}&dojo_id=${currentDojoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBlogs();
      } else {
        alert(t("delete_failed"));
      }
    } catch (e) {
      console.error(e);
      alert(t("delete_error"));
    }
  };

  const handleEdit = (blog: BlogType) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-japan-blue/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-sumi">{t("title")}</h1>
          <p className="text-sumi-muted text-sm mt-1">
            {t("subtitle")}
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-japan-blue text-washi px-4 py-2 rounded shadow-md hover:bg-japan-blue/90 flex items-center gap-2 transition-colors font-bold text-sm"
        >
          <Plus size={16} />
          {t("create")}
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-washi-cream/50 h-[300px] rounded border border-japan-blue/10 animate-pulse"
            />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-washi-cream border border-japan-blue/10 rounded-lg p-12 text-center text-sumi-muted">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50 text-japan-blue" />
          <h3 className="text-lg font-bold text-sumi mb-2">{t("empty")}</h3>
          <p className="mb-6">{t("empty_desc")}</p>
          <button
            onClick={handleAddNew}
            className="text-japan-blue font-bold px-6 py-2 border border-japan-blue rounded hover:bg-japan-blue hover:text-white transition-all inline-block"
          >
            {t("start_writing")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-washi border border-japan-blue/10 overflow-hidden rounded group shadow-sm flex flex-col md:flex-row h-full"
            >
              {/* Image Thumbnail */}
              <div className="w-full md:w-48 h-48 md:h-auto relative shrink-0 bg-sumi-muted/10">
                 {blog.image_url ? (
                    <Image 
                       src={blog.image_url} 
                       alt={blog.title} 
                       fill 
                       className="object-cover"
                    />
                 ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sumi-muted/50">
                       <ImageIcon size={32} />
                    </div>
                 )}
                 {/* Status Badge */}
                 <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm flex items-center gap-1 ${blog.status === 'published' ? 'bg-bamboo' : 'bg-gray-500'}`}>
                    {blog.status === 'published' ? <Globe size={10} /> : <FileText size={10} />}
                    {blog.status === 'published' ? t("published") : t("draft")}
                 </div>
              </div>

              <div className="p-5 flex flex-col flex-1 min-w-0">
                 <div className="text-xs text-sumi-muted mb-2 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                    </span>
                    {blog.event_id && (
                       <span className="flex items-center gap-1 text-japan-blue font-bold" title={t("event_linked")}>
                          <LinkIcon size={12} />
                          {t("event_linked")}
                       </span>
                    )}
                 </div>
                 
                 <h3 className="text-lg font-bold font-serif text-sumi mb-2 line-clamp-2 leading-tight">
                    {blog.title}
                 </h3>
                 <p className="text-sm text-sumi-muted line-clamp-3 mb-4 flex-1">
                    {blog.summary || t("no_summary")}
                 </p>

                 <div className="flex justify-end gap-2 border-t border-japan-blue/5 pt-4 mt-auto">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-sumi-muted hover:text-japan-blue hover:bg-japan-blue/5 rounded transition-colors"
                      title={t("edit")}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id, blog.dojo_id)}
                      className="p-2 text-sumi-muted hover:text-cinnabar hover:bg-cinnabar/5 rounded transition-colors"
                      title={t("delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BlogFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBlogs}
        editingBlog={editingBlog}
        dojoId={dojoId}
      />
    </div>
  );
}
