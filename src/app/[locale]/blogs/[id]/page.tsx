"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowLeft, Clock, User } from "lucide-react";
import { useTranslations } from "next-intl";
import PageTransition from "@/components/animations/PageTransition";
import { BlogType } from "@/app/[locale]/dashboard/dojo/blogs/BlogFormModal";

export default function BlogPublicPage() {
  const t = useTranslations("blogs.public");
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [blog, setBlog] = useState<BlogType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We can fetch from public api or directly querying if not restricted
    // Let's create a specific fetch for single blog
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (res.ok) {
           const data = await res.json();
           setBlog(data.blog);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
       fetchBlog();
    }
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-washi-cream text-sumi">
        <div className="container mx-auto px-6 max-w-4xl">
           <div className="h-[400px] bg-japan-blue/5 animate-pulse rounded-lg mb-8"></div>
           <div className="h-10 bg-japan-blue/5 animate-pulse rounded mb-4 max-w-2xl"></div>
           <div className="h-4 bg-japan-blue/5 animate-pulse rounded mb-2"></div>
           <div className="h-4 bg-japan-blue/5 animate-pulse rounded mb-2"></div>
           <div className="h-4 bg-japan-blue/5 animate-pulse rounded mb-2 max-w-md"></div>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-washi-cream">
         <div className="text-center">
            <h1 className="text-2xl font-bold text-sumi mb-4">{t("not_found")}</h1>
            <button onClick={() => router.back()} className="text-japan-blue hover:underline">
               {t("back")}
            </button>
         </div>
      </main>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen pt-24 pb-24 bg-washi-cream">
        <div className="container mx-auto px-6 max-w-4xl">
          <button 
             onClick={() => router.back()}
             className="inline-flex items-center gap-2 text-sumi-muted hover:text-japan-blue transition-colors mb-8 text-sm font-medium"
          >
             <ArrowLeft size={16} /> {t("back_to_list")}
          </button>

          {blog.image_url && (
            <div className="w-full relative h-[300px] md:h-[500px] rounded-xl overflow-hidden mb-8 shadow-lg border border-japan-blue/10">
               <Image 
                 src={blog.image_url} 
                 alt={blog.title} 
                 fill 
                 className="object-cover" 
                 priority 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-6 left-6 right-6 text-white">
                 {/* Only display summary here if we wanted an overlay effect, otherwise below */}
               </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-japan-blue/5 p-6 md:p-12 mb-12 relative overflow-hidden">
             {/* Decorative Background Element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-mon/5 blur-3xl -z-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>

             <div className="flex flex-wrap items-center gap-4 text-sm text-sumi-muted mb-6 uppercase tracking-wider font-semibold">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-japan-blue" /> {new Date(blog.created_at).toLocaleDateString("vi-VN", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="w-1 h-1 rounded-full bg-sumi-muted/30"></span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-japan-blue" /> {t("read_time")}</span>
             </div>

             <h1 className="text-3xl md:text-5xl font-serif font-bold text-sumi mb-6 leading-tight">
               {blog.title}
             </h1>

             {blog.summary && (
               <p className="text-lg md:text-xl text-sumi/80 leading-relaxed font-medium mb-10 border-l-4 border-japan-blue/30 pl-6 italic">
                 {blog.summary}
               </p>
             )}

             {/* Rich Text Rendered Content */}
             <div 
               className="prose prose-lg md:prose-xl max-w-none prose-headings:font-serif prose-headings:text-sumi prose-a:text-japan-blue hover:prose-a:text-japan-blue/80 prose-img:rounded-xl prose-img:shadow-md prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6 prose-li:my-1"
               dangerouslySetInnerHTML={{ __html: blog.content }}
             />
          </div>

          <div className="border-t border-japan-blue/10 pt-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-japan-blue/10 flex items-center justify-center text-japan-blue">
                 <User size={24} />
              </div>
              <div>
                 <div className="text-xs text-sumi-muted uppercase tracking-wider mb-1">{t("author")}</div>
                 <div className="font-bold text-sumi">Dojo Admin</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
