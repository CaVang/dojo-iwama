"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Filter, Sword, Users, Grip } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import PageTransition, {
  staggerContainer,
} from "@/components/animations/PageTransition";
import techniques from "@/data/techniques.json";

type Category = "All" | "Taijutsu" | "Aiki-Ken" | "Aiki-Jo";
type Difficulty = "All" | "Beginner" | "Intermediate" | "Advanced";

export default function TechniquesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("All");
  const t = useTranslations("techniques");
  const tTechniqueData = useTranslations("techniqueData");
  const locale = useLocale();

  const categories: { value: Category; label: string; icon: typeof Users }[] = [
    { value: "All", label: t("allTechniques"), icon: Grip },
    { value: "Taijutsu", label: "Taijutsu", icon: Users },
    { value: "Aiki-Ken", label: "Aiki-Ken", icon: Sword },
    { value: "Aiki-Jo", label: "Aiki-Jo", icon: Grip },
  ];

  const difficulties: { value: Difficulty; label: string }[] = [
    { value: "All", label: t("allLevels") },
    { value: "Beginner", label: t("beginner") },
    { value: "Intermediate", label: t("intermediate") },
    { value: "Advanced", label: t("advanced") },
  ];

  const filteredTechniques = useMemo(() => {
    return techniques.filter((technique) => {
      const categoryMatch =
        selectedCategory === "All" || technique.category === selectedCategory;
      const difficultyMatch =
        selectedDifficulty === "All" ||
        technique.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [selectedCategory, selectedDifficulty]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Taijutsu":
        return Users;
      case "Aiki-Ken":
        return Sword;
      case "Aiki-Jo":
        return Grip;
      default:
        return Users;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return t("beginner");
      case "Intermediate":
        return t("intermediate");
      case "Advanced":
        return t("advanced");
      default:
        return difficulty;
    }
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-japan-blue overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2.5a2.5 2.5 0 015 0V16h15v2H25v2.5a2.5 2.5 0 01-5 0z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
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
              技
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

      {/* Filters Section */}
      <section className="py-8 bg-washi border-b border-japan-blue/10 sticky top-20 z-30 backdrop-blur-md bg-washi/95">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-serif tracking-wider transition-all duration-300 ${
                    selectedCategory === cat.value
                      ? "bg-japan-blue text-washi"
                      : "bg-washi-cream text-sumi hover:bg-japan-blue/10"
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-3">
              <Filter size={16} className="text-sumi-muted" />
              <select
                value={selectedDifficulty}
                onChange={(e) =>
                  setSelectedDifficulty(e.target.value as Difficulty)
                }
                className="bg-washi-cream border border-japan-blue/20 px-4 py-2 text-sm font-serif focus:outline-none focus:border-japan-blue"
              >
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Techniques Grid */}
      <section className="section-padding bg-washi">
        <div className="max-w-6xl mx-auto px-6">
          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sumi-muted text-sm mb-8"
          >
            {filteredTechniques.length === 1
              ? t("showing", { count: filteredTechniques.length })
              : t("showingPlural", { count: filteredTechniques.length })}
          </motion.p>

          {/* Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredTechniques.map((technique, index) => {
                const Icon = getCategoryIcon(technique.category);
                return (
                  <motion.div
                    key={technique.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link
                      href={`/${locale}/techniques/${technique.slug}`}
                      className="block group h-full"
                    >
                      <motion.div
                        className="card-washi h-full overflow-hidden flex flex-col border border-japan-blue/10"
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Image/Visual Area */}
                        <div className="aspect-4/3 bg-linear-to-br from-japan-blue/10 via-japan-blue/5 to-transparent relative overflow-hidden shrink-0">
                          {/* Decorative frame */}
                          <div className="absolute inset-3 border border-japan-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Large Japanese character background */}
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            <motion.span
                              className="font-jp text-5xl lg:text-7xl text-japan-blue/10"
                              whileHover={{ scale: 1.1, rotate: 3 }}
                              transition={{ duration: 0.4 }}
                            >
                              {technique.name_jp}
                            </motion.span>
                          </div>

                          {/* Category badge */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1.5 bg-japan-blue text-washi text-xs px-3 py-1 uppercase tracking-wider">
                              <Icon size={12} />
                              {technique.category}
                            </span>
                          </div>

                          {/* Difficulty indicator */}
                          <div className="absolute top-4 right-4">
                            <span
                              className={`text-xs px-2 py-1 uppercase tracking-wider ${
                                technique.difficulty === "Beginner"
                                  ? "bg-bamboo/20 text-bamboo"
                                  : technique.difficulty === "Intermediate"
                                    ? "bg-gold/20 text-gold"
                                    : "bg-cinnabar/20 text-cinnabar"
                              }`}
                            >
                              {getDifficultyLabel(technique.difficulty)}
                            </span>
                          </div>

                          {/* Corner decorations */}
                          <div className="absolute top-2 right-2 w-6 h-6 border-r border-t border-cinnabar/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-2 left-2 w-6 h-6 border-l border-b border-cinnabar/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-japan-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col grow">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="font-serif text-xl text-sumi group-hover:text-japan-blue transition-colors">
                              {technique.name_en}
                            </h3>
                            <span className="font-jp text-lg text-japan-blue/50 shrink-0">
                              {technique.name_jp}
                            </span>
                          </div>

                          <p className="text-sm text-sumi-muted line-clamp-2 mb-4 grow">
                            {tTechniqueData(`${technique.slug}.description`)}
                          </p>

                          {/* Footer with stats */}
                          <div className="flex items-center justify-between pt-4 border-t border-japan-blue/10 mt-auto">
                            <div className="flex items-center gap-4 text-xs text-sumi-muted">
                              <span>
                                {t("postures", {
                                  count: technique.content.key_postures.length,
                                })}
                              </span>
                              <span>
                                {t("notes", {
                                  count:
                                    technique.content.important_notes.length,
                                })}
                              </span>
                            </div>

                            <div className="flex items-center text-japan-blue text-sm font-serif tracking-wider group-hover:gap-2 transition-all">
                              <span>{t("view")}</span>
                              <ArrowRight
                                size={16}
                                className="ml-1 group-hover:translate-x-1 transition-transform"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredTechniques.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <span className="font-jp text-6xl text-japan-blue/10 block mb-4">
                無
              </span>
              <h3 className="font-serif text-xl text-sumi mb-2">
                {t("noTechniquesFound")}
              </h3>
              <p className="text-sumi-muted">{t("adjustFilters")}</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                }}
                className="mt-6 btn-outline"
              >
                {t("clearFilters")}
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
