"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import dojos from "@/data/dojos.json";

interface EventCardProps {
  event: {
    id: string;
    title_key: string;
    date: string;
    end_date: string | null;
    dojo_id: string;
    description_key: string;
    event_type: string;
    instructor: string;
  };
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const t = useTranslations("events");
  const dojo = dojos.find((d) => d.id === event.dojo_id);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en", { month: "short" }).toUpperCase(),
    };
  };

  const startDate = formatDate(event.date);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "gasshuku":
        return "bg-japan-blue/10 text-japan-blue border-japan-blue/30";
      case "seminar":
        return "bg-bamboo/10 text-bamboo border-bamboo/30";
      case "workshop":
        return "bg-cinnabar/10 text-cinnabar border-cinnabar/30";
      case "examination":
        return "bg-gold/10 text-gold-deep border-gold/30";
      default:
        return "bg-sumi/10 text-sumi border-sumi/30";
    }
  };

  return (
    <motion.div
      className="group cursor-pointer relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      <div className="bg-washi-cream border border-japan-blue/10 hover:border-japan-blue/30 transition-all duration-300 overflow-hidden">
        {/* Date Badge */}
        <div className="flex">
          <div className="w-20 shrink-0 bg-linear-to-br from-japan-blue to-japan-blue/80 text-washi flex flex-col items-center justify-center py-4">
            <span className="text-3xl font-serif font-bold">
              {startDate.day}
            </span>
            <span className="text-xs tracking-widest opacity-80">
              {startDate.month}
            </span>
          </div>

          <div className="flex-1 p-4">
            {/* Event Type Badge */}
            <span
              className={`inline-block text-xs px-2 py-1 border mb-2 ${getEventTypeColor(event.event_type)}`}
            >
              {t(`eventTypes.${event.event_type}`)}
            </span>

            {/* Title */}
            <h3 className="font-serif text-lg text-sumi group-hover:text-japan-blue transition-colors line-clamp-1">
              {t(event.title_key)}
            </h3>

            {/* Hover reveal: Location & Description */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              whileHover={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="pt-2 space-y-1">
                {dojo && (
                  <div className="flex items-center gap-1 text-sm text-sumi-muted">
                    <MapPin size={14} className="text-japan-blue/60" />
                    <span className="line-clamp-1">{dojo.name}</span>
                  </div>
                )}
                <p className="text-xs text-sumi-muted line-clamp-2 leading-relaxed">
                  {t(event.description_key)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Japanese accent line */}
        <div className="h-0.5 bg-linear-to-r from-transparent via-japan-blue/20 to-transparent" />
      </div>

      {/* Corner decoration on hover */}
      <motion.div
        className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-japan-blue/0 group-hover:border-japan-blue/40 transition-colors"
        initial={false}
      />
      <motion.div
        className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-japan-blue/0 group-hover:border-japan-blue/40 transition-colors"
        initial={false}
      />
    </motion.div>
  );
}
