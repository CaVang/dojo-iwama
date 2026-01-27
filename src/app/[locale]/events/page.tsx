"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AsanohaPattern } from "@/components/ui/JapaneseElements";
import EventCard from "@/components/events/EventCard";
import EventModal from "@/components/events/EventModal";
import events from "@/data/events.json";

type EventType = {
  id: string;
  title_key: string;
  date: string;
  end_date: string | null;
  dojo_id: string;
  description_key: string;
  image_url: string;
  event_type: string;
  instructor: string;
  related_blog_ids: string[];
};

export default function EventsPage() {
  const t = useTranslations("events");
  const locale = useLocale();
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  // Get all unique months from events
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    (events as EventType[]).forEach((event) => {
      const date = new Date(event.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      months.add(monthKey);
    });
    return Array.from(months).sort();
  }, []);

  // Filter events by selected month
  const filteredEvents = useMemo(() => {
    const now = new Date();
    let filtered = (events as EventType[])
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (selectedMonth !== "all") {
      filtered = filtered.filter((event) => {
        const date = new Date(event.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        return monthKey === selectedMonth;
      });
    }

    return filtered;
  }, [selectedMonth]);

  // Group filtered events by month
  const eventsByMonth = useMemo(() => {
    const grouped: Record<string, EventType[]> = {};
    filteredEvents.forEach((event) => {
      const date = new Date(event.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    return {
      name: t(`months.${monthNames[date.getMonth()]}`),
      year: year,
    };
  };

  return (
    <div className="min-h-screen bg-washi">
      <AsanohaPattern className="fixed inset-0 opacity-5 pointer-events-none" />

      {/* Hero Header */}
      <div className="relative bg-linear-to-br from-japan-blue to-japan-blue/80 py-20 md:py-28">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="relative z-1 w-full text-center">
            <div className="absolute inset-0 bg-sumi/60 backdrop-blur-md z-1 w-full h-full" />
            <span className="font-jp text-[12rem] md:text-[16rem] text-washi/5 select-none">
              {t("kanjiTitle")}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-washi/70 hover:text-washi text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>

          <h1 className="font-serif text-4xl md:text-5xl text-washi mb-4">
            {t("pageTitle")}
          </h1>
          <p className="text-washi/80 max-w-2xl">{t("pageDescription")}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            {/* Month Filter */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
              <div className="flex items-center gap-2 text-sumi-muted shrink-0">
                <Calendar size={18} />
                <span className="text-sm">{t("filterByMonth")}:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMonth("all")}
                  className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                    selectedMonth === "all"
                      ? "bg-japan-blue text-washi"
                      : "bg-washi-cream border border-japan-blue/20 text-sumi hover:border-japan-blue/40"
                  }`}
                >
                  {t("allMonths")}
                </button>
                {availableMonths.map((monthKey) => {
                  const { name, year } = getMonthName(monthKey);
                  return (
                    <button
                      key={monthKey}
                      onClick={() => setSelectedMonth(monthKey)}
                      className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                        selectedMonth === monthKey
                          ? "bg-japan-blue text-washi"
                          : "bg-washi-cream border border-japan-blue/20 text-sumi hover:border-japan-blue/40"
                      }`}
                    >
                      {name} {year}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Events List */}
            {Object.keys(eventsByMonth).length > 0 ? (
              <div className="space-y-12">
                {Object.keys(eventsByMonth).map((monthKey, monthIndex) => {
                  const { name, year } = getMonthName(monthKey);
                  const monthEvents = eventsByMonth[monthKey];

                  return (
                    <motion.div
                      key={monthKey}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: monthIndex * 0.1 }}
                    >
                      {/* Month Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-baseline gap-2">
                          <h2 className="font-serif text-2xl text-sumi">
                            {name}
                          </h2>
                          <span className="text-sm text-sumi-muted">
                            {year}
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-linear-to-r from-japan-blue/20 to-transparent" />
                      </div>

                      {/* Events Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {monthEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <EventCard
                              event={event}
                              onClick={() => setSelectedEvent(event)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-sumi-muted">{t("noUpcomingEvents")}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Latest Posts */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24">
              <div className="bg-washi-cream border border-japan-blue/10 p-6">
                <h3 className="font-serif text-lg text-sumi mb-4 flex items-center gap-2">
                  {t("latestPosts")}
                </h3>

                <div className="space-y-4">
                  {/* Placeholder for related posts */}
                  <p className="text-sm text-sumi-muted italic">
                    Coming soon...
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
