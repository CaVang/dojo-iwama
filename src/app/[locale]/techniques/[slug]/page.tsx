import { notFound } from "next/navigation";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import techniquesData from "@/data/techniques.json";
import TechniqueDetailClient from "./TechniqueDetailClient";

const techniques = techniquesData.techniques;

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Generate static params for all techniques and locales
export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    techniques.map((technique) => ({
      locale,
      slug: technique.slug,
    })),
  );
}

// Generate metadata for each technique page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const technique = techniques.find((t) => t.slug === slug);

  if (!technique) {
    return {
      title: "Technique Not Found",
    };
  }

  return {
    title: `${technique.name_en} (${technique.name_jp})`,
    description: `${technique.name_en} - Iwama Aikido technique`,
    openGraph: {
      title: `${technique.name_en} - Iwama Aikido`,
      description: `${technique.name_en} - Iwama Aikido technique`,
    },
  };
}

export default async function TechniqueDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const technique = techniques.find((t) => t.slug === slug);

  if (!technique) {
    notFound();
  }

  return <TechniqueDetailClient technique={technique} />;
}
