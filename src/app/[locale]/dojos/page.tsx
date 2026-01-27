"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Users,
  ChevronDown,
  Search,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import PageTransition, {
  staggerContainer,
} from "@/components/animations/PageTransition";
import dojos from "@/data/dojos.json";

export default function DojosPage() {
  const [expandedDojo, setExpandedDojo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("dojos");
  const locale = useLocale();

  const filteredDojos = dojos.filter(
    (dojo) =>
      dojo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dojo.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dojo.chief_instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
              道場
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-washi tracking-wider mb-4">
              {t("title")}
            </h1>
            <p className="text-washi/70 max-w-2xl mx-auto">
              {t("description")}
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

      {/* Search Section */}
      <section className="py-8 bg-washi border-b border-japan-blue/10 sticky top-20 z-30 backdrop-blur-md bg-washi/95">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sumi-muted"
              size={20}
            />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-washi-cream border border-japan-blue/20 pl-12 pr-4 py-3 font-sans text-sumi placeholder:text-sumi-muted focus:outline-none focus:border-japan-blue transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Dojos List */}
      <section className="section-padding bg-washi">
        <div className="max-w-4xl mx-auto px-6">
          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sumi-muted text-sm mb-8"
          >
            {filteredDojos.length === 1
              ? t("showing", { count: filteredDojos.length })
              : t("showingPlural", { count: filteredDojos.length })}
          </motion.p>

          {/* Dojos List */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredDojos.map((dojo, index) => (
                <motion.article
                  key={dojo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="card-washi overflow-hidden"
                >
                  {/* Main content - always visible */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() =>
                      setExpandedDojo(expandedDojo === dojo.id ? null : dojo.id)
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-japan-blue/10 rounded-full flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 text-japan-blue" />
                          </div>
                          <div>
                            <h2 className="font-serif text-xl text-sumi">
                              {dojo.name}
                            </h2>
                            <p className="text-sm text-sumi-muted">
                              {dojo.chief_instructor}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-sumi-light mt-4 ml-13">
                          <MapPin
                            size={14}
                            className="text-japan-blue shrink-0"
                          />
                          <span className="line-clamp-1">{dojo.address}</span>
                        </div>
                      </div>

                      <motion.button
                        animate={{
                          rotate: expandedDojo === dojo.id ? 180 : 0,
                        }}
                        className="p-2 text-sumi-muted hover:text-japan-blue transition-colors"
                        aria-label="Toggle details"
                      >
                        <ChevronDown size={20} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedDojo === dojo.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-japan-blue/10 pt-6">
                          {/* Description */}
                          {dojo.description && (
                            <p className="text-sumi-light leading-relaxed mb-6">
                              {dojo.description}
                            </p>
                          )}

                          {/* Contact Grid */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            {/* Phone */}
                            {dojo.phone && (
                              <a
                                href={`tel:${dojo.phone}`}
                                className="flex items-center gap-3 p-4 bg-washi-cream hover:bg-japan-blue/5 transition-colors group"
                              >
                                <div className="w-10 h-10 bg-japan-blue/10 rounded-full flex items-center justify-center group-hover:bg-japan-blue/20 transition-colors">
                                  <Phone
                                    size={18}
                                    className="text-japan-blue"
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-sumi-muted uppercase tracking-wider">
                                    {t("phone")}
                                  </p>
                                  <p className="text-sumi font-medium">
                                    {dojo.phone}
                                  </p>
                                </div>
                              </a>
                            )}

                            {/* Email */}
                            {dojo.email && (
                              <a
                                href={`mailto:${dojo.email}`}
                                className="flex items-center gap-3 p-4 bg-washi-cream hover:bg-japan-blue/5 transition-colors group"
                              >
                                <div className="w-10 h-10 bg-japan-blue/10 rounded-full flex items-center justify-center group-hover:bg-japan-blue/20 transition-colors">
                                  <Mail size={18} className="text-japan-blue" />
                                </div>
                                <div>
                                  <p className="text-xs text-sumi-muted uppercase tracking-wider">
                                    {t("email")}
                                  </p>
                                  <p className="text-sumi font-medium truncate max-w-[180px]">
                                    {dojo.email}
                                  </p>
                                </div>
                              </a>
                            )}
                          </div>

                          {/* Map Link */}
                          {dojo.map_link && (
                            <a
                              href={dojo.map_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 flex items-center justify-center gap-2 p-4 border border-japan-blue/20 text-japan-blue hover:bg-japan-blue hover:text-washi transition-colors font-serif tracking-wider"
                            >
                              <MapPin size={18} />
                              {t("viewOnMap")}
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredDojos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <span className="font-jp text-6xl text-japan-blue/10 block mb-4">
                無
              </span>
              <h3 className="font-serif text-xl text-sumi mb-2">
                {t("noDojosFound")}
              </h3>
              <p className="text-sumi-muted">{t("adjustSearch")}</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 btn-outline"
              >
                {t("clearSearch")}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-japan-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 25 50 50 T100 50' stroke='%23ffffff' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: "100px 50px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 text-center relative z-10"
        >
          <span className="font-jp text-4xl text-washi/20 block mb-4">
            稽古
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-washi mb-6">
            {t("beginYourJourney")}
          </h2>
          <p className="text-washi/70 mb-8 leading-relaxed">
            {t("journeyDescription")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/techniques`}
              className="btn-outline bg-transparent text-washi border-washi/30 hover:bg-washi hover:text-japan-blue"
            >
              {t("exploreTechniques")}
            </Link>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
