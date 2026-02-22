"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, User, FileText, Plus, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { BlogType } from "@/app/[locale]/dashboard/dojo/blogs/BlogFormModal";
import dojos from "@/data/dojos.json";

interface EventModalProps {
  event: {
    id: string;
    title?: string;
    title_key?: string;
    date: string;
    end_date: string | null;
    dojo_id: string;
    description?: string;
    description_key?: string;
    event_type: string;
    instructor?: string;
    image_url: string;
  } | null;
  isOpen: boolean;
  isRegistered?: boolean;
  onClose: () => void;
  onRegistrationChange?: () => void;
}

export default function EventModal({
  event,
  isOpen,
  isRegistered = false,
  onClose,
  onRegistrationChange,
}: EventModalProps) {
  const t = useTranslations("events");
  const locale = useLocale();
  const { isDojoChief } = useAuth();
  const [localRegistered, setLocalRegistered] = useState(isRegistered);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [linkedBlogs, setLinkedBlogs] = useState<BlogType[]>([]);

  // Sync prop to local state
  useEffect(() => {
    setLocalRegistered(isRegistered);
    setErrorMsg("");
  }, [isRegistered, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fetch Linked Blogs
  useEffect(() => {
    if (isOpen && event?.id) {
       fetch(`/api/blogs?event_id=${event.id}`)
         .then(res => res.json())
         .then(data => {
            if (data.blogs) {
               setLinkedBlogs(data.blogs);
            }
         })
         .catch(console.error);
    } else {
       setLinkedBlogs([]);
    }
  }, [isOpen, event?.id]);

  if (!event) return null;

  const dojo = dojos.find((d) => d.id === event.dojo_id);

  const handleRegistrationToggle = async () => {
    if (!event) return;
    setIsProcessing(true);
    setErrorMsg("");
    
    try {
      if (localRegistered) {
         // Unregister
         const res = await fetch(`/api/user/events/registrations?event_id=${event.id}`, { method: 'DELETE' });
         if (res.ok) {
            setLocalRegistered(false);
            if (onRegistrationChange) onRegistrationChange();
         } else {
            const data = await res.json();
            setErrorMsg(data.error || "Lỗi hủy đăng ký");
         }
      } else {
         // Register
         const res = await fetch('/api/user/events/registrations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_id: event.id })
         });
         
         const data = await res.json();
         if (res.ok) {
            setLocalRegistered(true);
            if (onRegistrationChange) onRegistrationChange();
         } else {
            setErrorMsg(data.error || "Để đăng ký sự kiện, bạn cần đăng nhập tài khoản trước.");
         }
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Đã xảy ra lỗi kết nối");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDateRange = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (end) {
      const endDate = new Date(end);
      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.getDate()} - ${endDate.toLocaleDateString("en", options)}`;
      }
      return `${startDate.toLocaleDateString("en", options)} - ${endDate.toLocaleDateString("en", options)}`;
    }
    return startDate.toLocaleDateString("en", options);
  };

  const getEventTypeStyle = (type: string) => {
    switch (type) {
      case "gasshuku":
        return "from-japan-blue to-japan-blue/80";
      case "seminar":
        return "from-bamboo to-bamboo/80";
      case "workshop":
        return "from-cinnabar to-cinnabar/80";
      case "examination":
        return "from-gold-deep to-gold/80";
      default:
        return "from-sumi to-sumi/80";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-sumi/60 backdrop-blur-xl z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-washi z-50 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Japanese frame decoration */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-japan-blue/30" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-japan-blue/30" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-japan-blue/30" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-japan-blue/30" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-washi/80 hover:text-washi bg-sumi/20 hover:bg-sumi/40 transition-colors"
              aria-label={t("close")}
            >
              <X size={20} />
            </button>

            {/* Header with event type gradient */}
            <div
              className={`h-32 bg-linear-to-br ${getEventTypeStyle(event.event_type)} relative`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-jp text-6xl text-washi/10">
                  {t("kanjiTitle")}
                </span>
              </div>
              <div className="absolute bottom-4 left-6">
                <span className="text-xs text-washi/70 uppercase tracking-widest">
                  {t(`eventTypes.${event.event_type}`)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <h2 className="font-serif text-2xl md:text-3xl text-sumi mb-6">
                {event.title || (event.title_key ? t(event.title_key) : "Sự kiện")}
              </h2>

              <div className="space-y-4 mb-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-japan-blue mt-0.5" />
                  <div>
                    <div className="text-sm text-sumi-muted uppercase tracking-wide">
                      {t("date")}
                    </div>
                    <div className="text-sumi font-medium">
                      {formatDateRange(event.date, event.end_date)}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {dojo && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-japan-blue mt-0.5" />
                    <div>
                      <div className="text-sm text-sumi-muted uppercase tracking-wide">
                        {t("location")}
                      </div>
                      <div className="text-sumi font-medium">{dojo.name}</div>
                      <div className="text-sm text-sumi-muted">
                        {dojo.address}
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructor */}
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-japan-blue mt-0.5" />
                  <div>
                    <div className="text-sm text-sumi-muted uppercase tracking-wide">
                      {t("instructor")}
                    </div>
                    <div className="text-sumi font-medium">
                      {event.instructor}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-japan-blue/10 pt-6">
                <div className="text-sm text-sumi-muted uppercase tracking-wide mb-2">
                  {t("description")}
                </div>
                <p className="text-sumi leading-relaxed mb-6">
                  {event.description || (event.description_key ? t(event.description_key) : "")}
                </p>

                {/* Linked Blogs Section */}
                {(linkedBlogs.length > 0 || isDojoChief) && (
                  <div className="mb-8 mt-8 border-t border-japan-blue/10 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-sumi-muted uppercase tracking-wide flex items-center gap-2">
                        <FileText size={16} /> {t("related_blogs")}
                      </div>
                      {isDojoChief && (
                        <Link
                           href={`/${locale}/dashboard/dojo/blogs?new=true&event_id=${event.id}`}
                           className="text-japan-blue hover:text-white hover:bg-japan-blue text-xs font-bold px-3 py-1.5 border border-japan-blue rounded transition-colors flex items-center gap-1"
                        >
                           <Plus size={14} /> {t("write_new_blog")}
                        </Link>
                      )}
                    </div>

                    {linkedBlogs.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {linkedBlogs.map((blog) => (
                           <Link 
                              key={blog.id} 
                              href={`/${locale}/blogs/${blog.id}`}
                              className="group flex flex-col sm:flex-row items-center gap-4 p-3 bg-white border border-japan-blue/10 rounded hover:border-japan-blue/30 transition-colors shadow-sm"
                           >
                              {blog.image_url && (
                                <div className="w-full sm:w-24 h-16 shrink-0 relative rounded overflow-hidden bg-sumi-muted/10">
                                   {/* eslint-disable-next-line @next/next/no-img-element */}
                                   <img src={blog.image_url} alt={blog.title} className="object-cover w-full h-full" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0 flex justify-between items-center w-full">
                                <div>
                                   <h4 className="font-bold text-sumi line-clamp-1 group-hover:text-japan-blue transition-colors">
                                     {blog.title}
                                   </h4>
                                   <p className="text-xs text-sumi-muted line-clamp-1 mt-1">
                                     {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                                   </p>
                                </div>
                                <ChevronRight className="text-sumi-muted group-hover:text-japan-blue shrink-0 ml-2" size={16} />
                              </div>
                           </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-sumi-muted italic bg-washi p-3 rounded border border-dashed border-japan-blue/20">
                         {t("no_related_blogs")}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Registration Action */}
                <div className="mt-8">
                  {errorMsg && (
                    <div className="mb-4 text-sm text-red-500 bg-red-50 p-3 rounded">
                      {errorMsg}
                    </div>
                  )}
                  
                  <button
                    onClick={handleRegistrationToggle}
                    disabled={isProcessing}
                    className={`w-full py-4 font-bold rounded shadow-md transition-all flex items-center justify-center gap-2 ${
                      localRegistered 
                        ? 'bg-bamboo/10 text-bamboo border border-bamboo hover:bg-bamboo/20' 
                        : 'bg-japan-blue text-white hover:bg-japan-blue/90'
                    } disabled:opacity-50`}
                  >
                    {isProcessing ? (
                      <span className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : localRegistered ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Bạn đã Đăng ký tham gia (Nhấn để Huỷ)
                      </>
                    ) : (
                      "Đăng ký Tham gia Sự kiện"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="h-1 bg-linear-to-r from-transparent via-japan-blue/30 to-transparent" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
