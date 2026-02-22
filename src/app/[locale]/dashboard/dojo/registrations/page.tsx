"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import RegistrationTable, { Registration } from "@/components/dashboard/RegistrationTable";

export default function RegistrationsPage() {
  const t = useTranslations("dashboard");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/dojo/registrations");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch registrations");
      }
      
      setRegistrations(data.registrations || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string, class_id?: string) => {
    try {
      const res = await fetch("/api/dashboard/dojo/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, class_id }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }
      
      // Update local state
      setRegistrations(prev => 
        prev.map(reg => reg.id === id ? { ...reg, status: newStatus as any } : reg)
      );
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sumi-muted">{t("loading")}</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>{error}</p>
        <button onClick={fetchRegistrations} className="mt-4 btn-outline text-sm">Thử lại</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-japan-blue mb-2">{t("registrations_title")}</h1>
        <p className="text-sumi-muted text-sm">{t("registrations_desc")}</p>
      </div>

      <RegistrationTable 
        registrations={registrations} 
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
}
