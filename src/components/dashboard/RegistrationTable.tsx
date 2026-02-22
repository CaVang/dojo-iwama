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

interface DojoClass {
  id: string;
  name: string;
}

interface RegistrationTableProps {
  registrations: Registration[];
  onStatusChange: (id: string, newStatus: string, class_id?: string) => Promise<void>;
}

export default function RegistrationTable({ registrations, onStatusChange }: RegistrationTableProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [enrollModalReg, setEnrollModalReg] = useState<Registration | null>(null);
  const [availableClasses, setAvailableClasses] = useState<DojoClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isFetchingClasses, setIsFetchingClasses] = useState(false);

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

  const fetchClasses = async () => {
    try {
      setIsFetchingClasses(true);
      const res = await fetch("/api/dashboard/dojo/classes");
      if (res.ok) {
        const data = await res.json();
        setAvailableClasses(data.classes || []);
        if (data.classes && data.classes.length > 0) {
          setSelectedClassId(data.classes[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch classes", err);
    } finally {
      setIsFetchingClasses(false);
    }
  };

  const handleStatusSelect = async (reg: Registration, newStatus: string) => {
    if (newStatus === "enrolled") {
      setEnrollModalReg(reg);
      fetchClasses();
      return;
    }
    await executeStatusChange(reg.id, newStatus);
  };

  const executeStatusChange = async (id: string, status: string, class_id?: string) => {
    setUpdatingId(id);
    await onStatusChange(id, status, class_id);
    setUpdatingId(null);
    setEnrollModalReg(null);
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
                    onChange={(e) => handleStatusSelect(reg, e.target.value)}
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

      {/* Enroll Modal */}
      {enrollModalReg && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-sumi/50 backdrop-blur-sm" onClick={() => setEnrollModalReg(null)}></div>
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl p-6">
                <h3 className="font-serif text-xl font-bold text-sumi mb-2">Xác nhận Nhập Học</h3>
                <p className="text-sm text-sumi-muted mb-4">
                  Bạn đang chuyển trạng thái của <span className="font-bold text-japan-blue">{enrollModalReg.contact_name}</span> thành <strong>Đã nhập học</strong>.
                  <br/>Hệ thống sẽ đồng thời tạo hồ sơ học viên chính thức. Vui lòng chọn lớp học để gán học viên này vào:
                </p>

                {isFetchingClasses ? (
                  <div className="py-4 text-center text-sm text-sumi-muted">Đang tải danh sách lớp...</div>
                ) : availableClasses.length > 0 ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-sumi mb-2">Chọn lớp học:</label>
                    <select 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue"
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                      {availableClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                    Võ đường của bạn chưa tạo Lớp học nào. Học viên sẽ được đưa vào danh sách chung chưa phân lớp.
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-2">
                  <button 
                    onClick={() => setEnrollModalReg(null)}
                    disabled={updatingId === enrollModalReg.id}
                    className="px-4 py-2 text-sm text-sumi hover:bg-gray-100 rounded transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={() => executeStatusChange(enrollModalReg.id, 'enrolled', selectedClassId || undefined)}
                    disabled={updatingId === enrollModalReg.id}
                    className="px-4 py-2 text-sm bg-japan-blue text-washi rounded hover:bg-japan-blue/90 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[100px]"
                  >
                    {updatingId === enrollModalReg.id ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : "Xác nhận"}
                  </button>
                </div>
            </div>
         </div>
      )}
    </div>
  );
}
