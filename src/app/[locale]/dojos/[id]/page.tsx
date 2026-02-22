"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, Globe, ArrowLeft,
  BookOpen, Calendar, FileText, Flag, Clock, Users
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import PageTransition from "@/components/animations/PageTransition";
import "leaflet/dist/leaflet.css";
import RegistrationDialog from "@/components/dojos/RegistrationDialog";
import staticDojos from "@/data/dojos.json";

const DojoMiniMap = dynamic(
  () => import("@/components/dojos/DojoMiniMap") as Promise<{ default: React.ComponentType<{ lat: number; lng: number; name: string }> }>,
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] bg-gradient-to-br from-sky-50 to-emerald-50 rounded-lg flex items-center justify-center">
        <span className="text-sumi-muted text-xs">Loading map...</span>
      </div>
    ),
  }
);

interface ClassSchedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface DojoClass {
  id: string;
  name: string;
  target_audience: string;
  class_schedules: ClassSchedule[];
}

interface DojoEvent {
  id: string;
  title: string;
  event_date: string;
  location: string;
  image_url?: string;
}

interface DojoBlog {
  id: string;
  title: string;
  summary?: string;
  image_url?: string;
  created_at: string;
}

interface DojoData {
  id: string;
  name: string;
  chief_instructor?: string;
  address?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  email?: string;
  avatar_url?: string;
  background_url?: string;
  description?: string;
}

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const AUDIENCE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  kids: { bg: "bg-bamboo/15", text: "text-bamboo", label: "Trẻ em" },
  teens: { bg: "bg-amber-500/15", text: "text-amber-700", label: "Thiếu niên" },
  adults: { bg: "bg-japan-blue/12", text: "text-japan-blue", label: "Người lớn" },
  all: { bg: "bg-primary/12", text: "text-primary", label: "Tất cả" },
};

export default function DojoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dojoDetail");
  const dojoId = params.id as string;

  const [dojo, setDojo] = useState<DojoData | null>(null);
  const [events, setEvents] = useState<DojoEvent[]>([]);
  const [blogs, setBlogs] = useState<DojoBlog[]>([]);
  const [classes, setClasses] = useState<DojoClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegOpen, setIsRegOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dojos/${dojoId}`);
        if (res.ok) {
          const data = await res.json();
          setDojo(data.dojo);
          setEvents(data.events || []);
          setBlogs(data.blogs || []);
          setClasses(data.classes || []);
        } else {
          // Fallback to static data
          const staticDojo = staticDojos.find(d => d.id === dojoId);
          if (staticDojo) {
            setDojo({
              id: staticDojo.id,
              name: staticDojo.name,
              chief_instructor: staticDojo.chief_instructor,
              address: staticDojo.address,
              lat: staticDojo.lat,
              lng: staticDojo.lng,
              phone: staticDojo.phone,
              email: staticDojo.email,
              description: staticDojo.description,
            });
          }
        }
      } catch {
        const staticDojo = staticDojos.find(d => d.id === dojoId);
        if (staticDojo) {
          setDojo({
            id: staticDojo.id,
            name: staticDojo.name,
            chief_instructor: staticDojo.chief_instructor,
            address: staticDojo.address,
            lat: staticDojo.lat,
            lng: staticDojo.lng,
            phone: staticDojo.phone,
            email: staticDojo.email,
            description: staticDojo.description,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dojoId]);

  // Build timetable data: group schedules by time slot rows
  const buildTimetable = () => {
    const timeSlots = new Map<string, Map<number, { className: string; audience: string; start: string; end: string }[]>>();

    classes.forEach(cls => {
      cls.class_schedules?.forEach(schedule => {
        const hour = schedule.start_time.substring(0, 5);
        if (!timeSlots.has(hour)) {
          timeSlots.set(hour, new Map());
        }
        const dayMap = timeSlots.get(hour)!;
        if (!dayMap.has(schedule.day_of_week)) {
          dayMap.set(schedule.day_of_week, []);
        }
        dayMap.get(schedule.day_of_week)!.push({
          className: cls.name,
          audience: cls.target_audience,
          start: schedule.start_time.substring(0, 5),
          end: schedule.end_time.substring(0, 5),
        });
      });
    });

    return Array.from(timeSlots.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, dayMap]) => ({ time, dayMap }));
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-washi pt-20">
          <div className="h-[280px] bg-japan-blue/10 animate-pulse" />
          <div className="max-w-[1100px] mx-auto px-6 pt-16">
            <div className="h-8 bg-japan-blue/5 animate-pulse rounded w-1/3 mb-4" />
            <div className="h-40 bg-japan-blue/5 animate-pulse rounded" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!dojo) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-washi pt-32 flex flex-col items-center justify-center gap-4">
          <p className="text-sumi-muted">{t("not_found")}</p>
          <button onClick={() => router.back()} className="text-japan-blue hover:underline text-sm flex items-center gap-2">
            <ArrowLeft size={14} /> {t("back")}
          </button>
        </div>
      </PageTransition>
    );
  }

  const timetable = buildTimetable();

  return (
    <PageTransition>
      {/* HERO — matches site's japan-blue style */}
      <section className="relative pt-32 pb-20 bg-japan-blue overflow-hidden">
        {/* Background image if set */}
        {dojo.background_url && (
          <Image src={dojo.background_url} alt="" fill className="object-cover opacity-20" priority />
        )}
        {/* Cross pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Kanji watermark */}
            <span className="font-jp text-4xl text-washi/20 block mb-4">道場</span>

            {/* Avatar + Title */}
            <div className="flex items-center justify-center gap-5 mb-4">
              {dojo.avatar_url && (
                <div className="w-16 h-16 rounded-full border-2 border-washi/30 overflow-hidden flex-shrink-0 shadow-lg">
                  <Image src={dojo.avatar_url} alt={dojo.name} width={64} height={64} className="object-cover w-full h-full" />
                </div>
              )}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-washi tracking-wider">
                {dojo.name}
              </h1>
            </div>

            {/* Sub-info */}
            <div className="flex flex-col items-center gap-1.5">
              {dojo.chief_instructor && (
                <p className="text-washi/70">{dojo.chief_instructor}</p>
              )}
              {dojo.address && (
                <p className="text-washi/50 text-sm flex items-center gap-1.5">
                  <MapPin size={12} /> {dojo.address}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="var(--washi-white)" />
          </svg>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-12 flex flex-col md:flex-row gap-8">

        {/* STICKY SIDEBAR */}
        <aside className="w-full md:w-[300px] shrink-0 md:sticky md:top-24 md:self-start flex flex-col gap-4">
          {/* Contact Card */}
          <div className="bg-white border border-japan-blue/10 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-japan-blue mb-3.5">{t("contact")}</h3>
            {dojo.phone && (
              <div className="flex items-center gap-2.5 py-2 text-sm text-sumi border-b border-japan-blue/5 last:border-0">
                <Phone size={14} className="text-japan-blue/50" />
                <span>{dojo.phone}</span>
              </div>
            )}
            {dojo.email && (
              <div className="flex items-center gap-2.5 py-2 text-sm text-sumi border-b border-japan-blue/5 last:border-0">
                <Mail size={14} className="text-japan-blue/50" />
                <span>{dojo.email}</span>
              </div>
            )}
            {dojo.lat && dojo.lng && (
              <div className="flex items-center gap-2.5 py-2 text-sm">
                <Globe size={14} className="text-japan-blue/50" />
                <a
                  href={`https://maps.google.com/?q=${dojo.lat},${dojo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-japan-blue hover:underline"
                >
                  Google Maps →
                </a>
              </div>
            )}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsRegOpen(true)}
            className="w-full py-3.5 bg-japan-blue text-washi rounded-xl font-bold text-sm shadow-md hover:bg-japan-blue/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            🥋 {t("register_cta")}
          </motion.button>

          {/* Mini Map */}
          {dojo.lat && dojo.lng && (
            <div className="bg-white border border-japan-blue/10 rounded-xl overflow-hidden">
              <DojoMiniMap lat={dojo.lat} lng={dojo.lng} name={dojo.name} />
            </div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 space-y-10">

          {/* About */}
          {dojo.description && (
            <section>
              <h2 className="font-serif text-xl font-bold text-sumi flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-japan-blue" /> {t("about")}
              </h2>
              <p className="text-[15px] leading-[1.8] text-sumi/85">{dojo.description}</p>
            </section>
          )}

          {/* Timetable */}
          {classes.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-bold text-sumi flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-japan-blue" /> {t("schedule")}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-japan-blue/10 rounded-xl overflow-hidden text-xs">
                  <thead>
                    <tr>
                      <th className="bg-japan-blue text-white py-2.5 px-2 text-[11px] font-semibold uppercase tracking-wide w-[60px]"></th>
                      {[1, 2, 3, 4, 5, 6].map(day => (
                        <th key={day} className="bg-japan-blue text-white py-2.5 px-2 text-[11px] font-semibold uppercase tracking-wide">
                          {DAY_LABELS[day]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map(({ time, dayMap }) => (
                      <tr key={time}>
                        <td className="bg-washi-cream/60 py-1.5 px-2 text-center align-top border border-japan-blue/5">
                          <span className="text-[10px] text-sumi-muted">{time}</span>
                        </td>
                        {[1, 2, 3, 4, 5, 6].map(day => {
                          const entries = dayMap.get(day);
                          return (
                            <td key={day} className="py-1.5 px-1 text-center align-top border border-japan-blue/5 h-[60px]">
                              {entries?.map((entry, i) => {
                                const style = AUDIENCE_STYLES[entry.audience] || AUDIENCE_STYLES.all;
                                return (
                                  <div key={i} className={`${style.bg} ${style.text} rounded-md p-1.5 text-[10px] font-semibold leading-snug`}>
                                    <div>{entry.start}–{entry.end}</div>
                                    <div>{entry.className}</div>
                                    <span className={`inline-block mt-0.5 px-1.5 py-px rounded text-[9px] ${style.bg} ${style.text} font-bold uppercase`}>
                                      {style.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Events */}
          {events.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-bold text-sumi flex items-center gap-2 mb-4">
                <Flag size={18} className="text-japan-blue" /> {t("upcoming_events")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.slice(0, 3).map(event => {
                  const date = new Date(event.event_date);
                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ y: -4 }}
                      className="bg-white border border-japan-blue/10 rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
                    >
                      <div className="h-[100px] bg-gradient-to-br from-japan-blue/15 to-bamboo/10 flex items-center justify-center relative">
                        {event.image_url && (
                          <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                        )}
                        <div className="bg-japan-blue text-white py-1.5 px-2.5 rounded-lg text-center leading-tight z-10">
                          <span className="text-xl font-bold block">{date.getDate()}</span>
                          <span className="text-[9px] uppercase tracking-wider">
                            {date.toLocaleDateString(locale, { month: "short" })}
                          </span>
                        </div>
                      </div>
                      <div className="p-3.5">
                        <h4 className="font-serif text-sm font-bold text-sumi leading-snug mb-1 line-clamp-2">{event.title}</h4>
                        <p className="text-[11px] text-sumi-muted flex items-center gap-1">
                          <MapPin size={10} /> {event.location || dojo.address || ""}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <Link
                href={`/${locale}/dojos`}
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-japan-blue hover:gap-2.5 transition-all"
              >
                {t("view_all_events")} <span>→</span>
              </Link>
            </section>
          )}

          {/* Blogs */}
          {blogs.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-bold text-sumi flex items-center gap-2 mb-4">
                <FileText size={18} className="text-japan-blue" /> {t("latest_blogs")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.slice(0, 3).map(blog => (
                  <Link key={blog.id} href={`/${locale}/blogs/${blog.id}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white border border-japan-blue/10 rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-lg h-full"
                    >
                      <div className="h-[120px] bg-gradient-to-br from-japan-blue/10 to-primary/8 flex items-center justify-center relative overflow-hidden">
                        {blog.image_url ? (
                          <Image src={blog.image_url} alt={blog.title} fill className="object-cover" />
                        ) : (
                          <FileText size={28} className="text-sumi-muted/30" />
                        )}
                      </div>
                      <div className="p-3.5">
                        <h4 className="font-serif text-sm font-bold text-sumi leading-snug mb-1.5 line-clamp-2">{blog.title}</h4>
                        <p className="text-[11px] text-sumi-muted flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(blog.created_at).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
              <Link
                href={`/${locale}/blogs`}
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-japan-blue hover:gap-2.5 transition-all"
              >
                {t("view_all_blogs")} <span>→</span>
              </Link>
            </section>
          )}

          {/* Empty state */}
          {events.length === 0 && blogs.length === 0 && classes.length === 0 && !dojo.description && (
            <div className="text-center py-16 text-sumi-muted">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p>{t("empty_state")}</p>
            </div>
          )}
        </main>
      </div>

      {/* Registration Dialog */}
      {isRegOpen && (
        <RegistrationDialog
          isOpen={isRegOpen}
          onClose={() => setIsRegOpen(false)}
          dojoId={dojo.id}
          dojoName={dojo.name}
          dojoEmail={dojo.email}
        />
      )}
    </PageTransition>
  );
}
