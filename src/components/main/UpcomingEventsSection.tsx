"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SeigaihaPattern } from "@/components/ui/JapaneseElements";
import AnimatedSection from "./AnimatedSection";
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

export default function UpcomingEventsSection() {
  const t = useTranslations("events");
  const locale = useLocale();
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [eventsData, setEventsData] = useState<EventType[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);

  // Fetch events from the database
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.events && data.events.length > 0) {
           // We append DB info to the existing placeholder JSON (optional)
           // or completely replace it. Let's merge both for a rich UI:
           setEventsData([...data.events, ...events]); 
        } else {
           setEventsData(events as EventType[]);
        }
      })
      .catch((err) => {
         console.error("Failed to fetch upcoming events", err);
         setEventsData(events as EventType[]);
      });
      
    // Fetch registered events
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

  // Group events by month
  const eventsByMonth = useMemo(() => {
    const now = new Date();
    const upcomingEvents = eventsData
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const grouped: Record<string, EventType[]> = {};

    upcomingEvents.forEach((event) => {
      const date = new Date(event.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });

    return grouped;
  }, []);

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

  const monthKeys = Object.keys(eventsByMonth).slice(0, 3); // Show max 3 months

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <SeigaihaPattern className="opacity-20" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="font-jp text-3xl text-japan-blue/20 block mb-4">
            {t("kanjiTitle")}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-sumi">
            {t("sectionTitle")}
          </h2>
          <p className="text-sumi-muted mt-4 max-w-2xl mx-auto">
            {t("sectionSubtitle")}
          </p>
        </AnimatedSection>

        {monthKeys.length > 0 ? (
          <div className="space-y-12">
            {monthKeys.map((monthKey, monthIndex) => {
              const { name, year } = getMonthName(monthKey);
              const monthEvents = eventsByMonth[monthKey];

              return (
                <motion.div
                  key={monthKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: monthIndex * 0.1 }}
                >
                  {/* Month Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-serif text-2xl text-sumi">{name}</h3>
                      <span className="text-sm text-sumi-muted">{year}</span>
                    </div>
                    <div className="flex-1 h-px bg-linear-to-r from-japan-blue/20 to-transparent" />
                  </div>

                  {/* Events Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthEvents.slice(0, 3).map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
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
          <div className="text-center py-12">
            <p className="text-sumi-muted">{t("noUpcomingEvents")}</p>
          </div>
        )}

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href={`/${locale}/events`}
            className="btn-primary inline-flex items-center gap-2"
          >
            {t("viewAllEvents")}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}
