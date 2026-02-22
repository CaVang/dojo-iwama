"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Users, Calendar, FileText, Settings, UserPlus, CalendarDays } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";

export default function DojoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const pathname = usePathname();

  const links = [
    {
      href: `/${locale}/dashboard/dojo/registrations`,
      label: t("menu_registrations"),
      icon: <UserPlus size={18} />,
    },
    {
      href: `/${locale}/dashboard/dojo/classes`,
      label: "Lớp học",
      icon: <CalendarDays size={18} />,
    },
    {
      href: `/${locale}/dashboard/dojo/students`,
      label: t("menu_students"),
      icon: <Users size={18} />,
    },
    {
      href: `/${locale}/dashboard/dojo/events`,
      label: t("menu_events"),
      icon: <Calendar size={18} />,
    },
    {
      href: "#", // Placeholder for future feature
      label: t("menu_blog"),
      icon: <FileText size={18} />,
      disabled: true,
    },
    {
      href: "#", // Placeholder for future feature
      label: t("menu_settings"),
      icon: <Settings size={18} />,
      disabled: true,
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-washi pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-md border border-japan-blue/10 p-4 sticky top-24">
                <h2 className="text-lg font-serif text-japan-blue mb-4 px-2">{t("dojo_dashboard_title")}</h2>
                <nav className="space-y-1">
                  {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-japan-blue/10 text-japan-blue font-medium"
                            : link.disabled
                            ? "text-sumi-muted cursor-not-allowed hover:bg-transparent opacity-60"
                            : "text-sumi hover:bg-japan-blue/5"
                        } ${link.disabled ? "pointer-events-none" : ""}`}
                        title={link.disabled ? t("coming_soon") : ""}
                      >
                        {link.icon}
                        <span className="text-sm">{link.label}</span>
                        {link.disabled && (
                          <span className="ml-auto text-[10px] uppercase tracking-wider bg-gray-100 px-1.5 rounded text-gray-500">
                            Sau này
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
