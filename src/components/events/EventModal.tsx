"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, User } from "lucide-react";
import { useTranslations } from "next-intl";
import dojos from "@/data/dojos.json";

interface EventModalProps {
  event: {
    id: string;
    title_key: string;
    date: string;
    end_date: string | null;
    dojo_id: string;
    description_key: string;
    event_type: string;
    instructor: string;
    image_url: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({
  event,
  isOpen,
  onClose,
}: EventModalProps) {
  const t = useTranslations("events");

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

  if (!event) return null;

  const dojo = dojos.find((d) => d.id === event.dojo_id);

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
                {t(event.title_key)}
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
                <p className="text-sumi leading-relaxed">
                  {t(event.description_key)}
                </p>
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
