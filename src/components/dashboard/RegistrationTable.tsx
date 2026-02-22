"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { MoreHorizontal, Mail, Phone, ExternalLink } from "lucide-react";

export interface Registration {
  id: string;
  dojo_id: string;
  dojo_name: string;
  contact_name: string;
  contact_info: string;
  student_age: string;
  message: string | null;
  status: "pending" | "contacted" | "enrolled" | "declined";
  created_at: string;
}

interface RegistrationTableProps {
  registrations: Registration[];
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
}

export default function RegistrationTable({ registrations, onStatusChange }: RegistrationTableProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">{t("status_pending")}</span>;
      case "contacted":
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{t("status_contacted")}</span>;
      case "enrolled":
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{t("status_enrolled")}</span>;
      case "declined":
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{t("status_declined")}</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    await onStatusChange(id, status);
    setUpdatingId(null);
  };

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-md border border-japan-blue/10">
        <p className="text-sumi-muted">{t("noRegistrations")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm border border-japan-blue/10">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-washi-cream border-b border-japan-blue/10 text-sm text-sumi-muted">
            <th className="p-4 font-medium">{t("date")}</th>
            <th className="p-4 font-medium">{t("contactName")}</th>
            <th className="p-4 font-medium">{t("contactInfo")}</th>
            <th className="p-4 font-medium">{t("studentAge")}</th>
            <th className="p-4 font-medium">{t("status")}</th>
            <th className="p-4 font-medium">{t("actions")}</th>
          </tr>
        </thead>
        <tbody className="text-sm text-sumi">
          {registrations.map((reg) => (
            <tr key={reg.id} className="border-b border-japan-blue/5 hover:bg-japan-blue/5 transition-colors">
              <td className="p-4 whitespace-nowrap">
                {format(new Date(reg.created_at), "dd MMM yyyy", { locale: dateLocale })}
              </td>
              <td className="p-4">
                <div className="font-medium text-japan-blue">{reg.contact_name}</div>
                {reg.message && <div className="text-xs text-sumi-muted mt-1 line-clamp-1" title={reg.message}>{reg.message}</div>}
              </td>
              <td className="p-4">
                {reg.contact_info}
              </td>
              <td className="p-4 whitespace-nowrap">{reg.student_age}</td>
              <td className="p-4 whitespace-nowrap">
                {getStatusBadge(reg.status)}
              </td>
              <td className="p-4 whitespace-nowrap relative">
                <div className="flex items-center gap-2">
                  <select
                    className="p-1 text-xs border border-japan-blue/20 rounded bg-white text-sumi focus:outline-none focus:border-japan-blue disabled:opacity-50"
                    value={reg.status}
                    onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                    disabled={updatingId === reg.id}
                  >
                    <option value="pending">{t("status_pending")}</option>
                    <option value="contacted">{t("status_contacted")}</option>
                    <option value="enrolled">{t("status_enrolled")}</option>
                    <option value="declined">{t("status_declined")}</option>
                  </select>
                  {updatingId === reg.id && <span className="w-3 h-3 border-2 border-japan-blue/30 border-t-japan-blue rounded-full animate-spin flex-shrink-0" />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
