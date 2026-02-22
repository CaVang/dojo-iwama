"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import PageTransition from "@/components/animations/PageTransition";
import { BlogType } from "@/app/[locale]/dashboard/dojo/blogs/BlogFormModal";

export default function BlogsIndexPage() {
  const t = useTranslations("blogs.public");
  const tDash = useTranslations("blogs.dashboard");
  const locale = useParams().locale as string;
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.blogs || []);
        }
      } catch (e) {
        console.error("Failed to fetch public blogs", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <PageTransition>
      <main className="min-h-screen pt-32 pb-24 bg-washi-cream text-sumi">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16 relative">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-sumi mb-6 leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-sumi-muted max-w-2xl mx-auto leading-relaxed">
              {t("description")}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-washi border border-japan-blue/5 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-japan-blue/10 shadow-sm">
               <FileText className="w-16 h-16 mx-auto text-japan-blue/30 mb-4" />
               <h3 className="text-xl font-serif font-bold text-sumi mb-2">{t("empty")}</h3>
               <p className="text-sumi-muted">{t("empty_desc")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link
                  href={`/${locale}/blogs/${blog.id}`}
                  key={blog.id}
                  className="group bg-white rounded-2xl border border-japan-blue/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="w-full h-56 relative bg-sumi-muted/5 overflow-hidden">
                    {blog.image_url ? (
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-japan-blue/20 bg-japan-blue/5">
                         <FileText size={48} />
                      </div>
                    )}
                    
                    {/* Event Link Badge */}
                    {blog.event_id && (
                        <div className="absolute top-4 right-4 bg-bamboo/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                           {t("event_badge")}
                        </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-sumi-muted uppercase tracking-wider font-semibold mb-4">
                      <Calendar size={14} className="text-japan-blue" />
                      {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                    </div>
                    
                    <h3 className="text-xl font-serif font-bold text-sumi mb-3 line-clamp-2 group-hover:text-japan-blue transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-sumi-muted line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                      {blog.summary || tDash("no_summary")}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-japan-blue/10 flex items-center justify-between text-sm font-bold text-japan-blue group-hover:text-japan-blue/80">
                      <span>{t("read_more")}</span>
                      <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
