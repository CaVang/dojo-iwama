"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import PageTransition from "@/components/animations/PageTransition";
import EventCard from "@/components/events/EventCard";
import EventModal from "@/components/events/EventModal";
import events from "@/data/events.json";

type EventType = {
  id: string;
  title?: string;
  title_key?: string;
  date: string;
  end_date: string | null;
  dojo_id: string;
  description?: string;
  description_key?: string;
  image_url: string;
  event_type: string;
  instructor?: string;
  related_blog_ids?: string[];
};

export default function EventsPage() {
  const t = useTranslations("events");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [eventsData, setEventsData] = useState<EventType[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);

  // Fetch dynamic events
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.events && data.events.length > 0) {
           setEventsData([...data.events, ...events]); 
        } else {
           setEventsData(events as EventType[]);
        }
      })
      .catch((err) => {
         console.error("Failed to fetch events page", err);
         setEventsData(events as EventType[]);
      });
      
    // Fetch registered events if user is somehow logged in
    fetch('/api/user/events/registrations')
      .then(res => {
         if (res.ok) return res.json();
         throw new Error("Failed");
      })
      .then(data => {
         if (data.registeredEventIds) {
             setRegisteredEventIds(data.registeredEventIds);
         }
      })
      .catch((err) => console.log("Guest visually", err));
  }, []);

  // Get all unique months from events
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    eventsData.forEach((event) => {
      const date = new Date(event.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      months.add(monthKey);
    });
    return Array.from(months).sort();
  }, [eventsData]);

  // Filter events by selected month
  const filteredEvents = useMemo(() => {
    const now = new Date();
    let filtered = eventsData
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
    <PageTransition>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-japan-blue overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="font-jp text-4xl text-washi/20 block mb-4">
              {t("kanjiTitle")}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-washi tracking-wider mb-4">
              {t("pageTitle")}
            </h1>
            <p className="text-washi/70 max-w-2xl mx-auto">
              {t("pageDescription")}
            </p>
          </motion.div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z"
              fill="var(--washi-white)"
            />
          </svg>
        </div>
      </section>

      <section className="section-padding bg-washi">
        <div className="max-w-6xl mx-auto px-6">
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
                                isRegistered={registeredEventIds.includes(event.id)}
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
      </section>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </PageTransition>
  );
}
