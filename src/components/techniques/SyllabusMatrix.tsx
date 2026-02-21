"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Check, Minus } from "lucide-react";

interface Attack {
  id: string;
  name_jp: string;
  name_en: string;
}

interface Technique {
  id: string;
  slug: string;
  type: string;
  attack?: string;
  baseTechnique?: string;
  beltLevels?: string[];
  name_jp: string;
  name_en: string;
}

interface SyllabusMatrixProps {
  attacks: Attack[];
  techniques: Technique[];
  selectedBeltLevel: string;
}

// Base techniques to show as columns (matching syllabus)
const BASE_TECHNIQUES = [
  { id: "ikkyo", name_en: "Ikkyo", name_jp: "一教" },
  { id: "nikyo", name_en: "Nikyo", name_jp: "二教" },
  { id: "sankyo", name_en: "Sankyo", name_jp: "三教" },
  { id: "yonkyo", name_en: "Yonkyo", name_jp: "四教" },
  { id: "gokyo", name_en: "Gokyo", name_jp: "五教" },
  { id: "shihonage", name_en: "Shiho-nage", name_jp: "四方投げ" },
  { id: "iriminage", name_en: "Irimi-nage", name_jp: "入り身投げ" },
  { id: "kotegaeshi", name_en: "Kote-gaeshi", name_jp: "小手返し" },
  { id: "kaitennage", name_en: "Kaiten-nage", name_jp: "回転投げ" },
  { id: "tenchinage", name_en: "Tenchi-nage", name_jp: "天地投げ" },
  { id: "kokyunage", name_en: "Kokyu-nage", name_jp: "呼吸投げ" },
  { id: "kokyuho", name_en: "Kokyu-ho", name_jp: "呼吸法" },
];

export default function SyllabusMatrix({
  attacks,
  techniques,
  selectedBeltLevel,
}: SyllabusMatrixProps) {
  const locale = useLocale();
  const t = useTranslations("techniques");

  // Create a lookup map for grading techniques
  const techniqueMap = useMemo(() => {
    const map = new Map<string, Technique>();
    techniques
      .filter((tech) => tech.type === "grading")
      .forEach((tech) => {
        const key = `${tech.attack}-${tech.baseTechnique}`;
        map.set(key, tech);
      });
    return map;
  }, [techniques]);

  // Check if technique is available for selected belt level
  const isAvailableForBelt = (technique: Technique | undefined) => {
    if (!technique || !technique.beltLevels) return false;
    if (selectedBeltLevel === "all") return true;
    return technique.beltLevels.includes(selectedBeltLevel);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr>
            <th className="sticky left-0 bg-washi-cream z-10 p-3 text-left font-serif text-sm text-sumi border-b border-r border-japan-blue/20">
              {t("attack")}
            </th>
            {BASE_TECHNIQUES.map((tech) => (
              <th
                key={tech.id}
                className="p-2 text-center font-serif text-xs text-sumi border-b border-japan-blue/20 min-w-[80px]"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-jp text-japan-blue/40 text-sm">
                    {tech.name_jp}
                  </span>
                  <span>{tech.name_en}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attacks.map((attack, rowIndex) => (
            <motion.tr
              key={attack.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="group/row hover:bg-japan-blue/5 transition-colors"
            >
              <td className="sticky left-0 bg-washi-cream group-hover/row:bg-japan-blue/10 z-10 p-3 border-b border-r border-japan-blue/20 transition-colors">
                <div className="flex flex-col">
                  <span className="font-jp text-japan-blue/50 text-sm">
                    {attack.name_jp}
                  </span>
                  <span className="font-serif text-sm text-sumi">
                    {attack.name_en}
                  </span>
                </div>
              </td>
              {BASE_TECHNIQUES.map((baseTech) => {
                const key = `${attack.id}-${baseTech.id}`;
                const technique = techniqueMap.get(key);
                const isAvailable = isAvailableForBelt(technique);
                const displayName = technique?.name_en || null;

                return (
                  <td
                    key={baseTech.id}
                    className="p-2 text-center border-b border-japan-blue/10"
                  >
                    {technique ? (
                      <div className="relative">
                        <Link
                          href={`/${locale}/techniques/${technique.slug}`}
                          className={`group/tooltip inline-flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                            isAvailable
                              ? "bg-bamboo/20 text-bamboo hover:bg-bamboo hover:text-washi hover:scale-110"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          <Check size={16} />
                          {/* Tooltip */}
                          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-washi text-xs rounded-lg shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap pointer-events-none">
                            <span className="font-medium text-sumi">{displayName}</span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sumi"></div>
                          </div>
                        </Link>
                      </div>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 text-gray-300">
                        <Minus size={16} />
                      </span>
                    )}
                  </td>
                );
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 text-sm text-sumi-muted">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-bamboo/20 text-bamboo">
            <Check size={12} />
          </span>
          <span>{t("requiredForBelt")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
            <Check size={12} />
          </span>
          <span>{t("higherLevel")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 text-gray-300">
            <Minus size={12} />
          </span>
          <span>{t("notApplicable")}</span>
        </div>
      </div>
    </div>
  );
}
