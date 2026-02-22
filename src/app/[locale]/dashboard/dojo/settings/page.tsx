"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Save, MapPin, Phone, Mail, User, Building2, ImageIcon, Search, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function DojoSettingsPage() {
  const t = useTranslations("dojoSettings");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [dojoId, setDojoId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    chief_instructor: "",
    address: "",
    lat: 0,
    lng: 0,
    phone: "",
    email: "",
    avatar_url: "",
    background_url: "",
    description: "",
  });

  // Address autocomplete state
  const [addressQuery, setAddressQuery] = useState("");
  const [addressResults, setAddressResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch existing dojo data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/dashboard/dojo/settings");
        if (res.ok) {
          const data = await res.json();
          setDojoId(data.dojo_id);
          if (data.dojo) {
            setFormData({
              name: data.dojo.name || "",
              chief_instructor: data.dojo.chief_instructor || "",
              address: data.dojo.address || "",
              lat: data.dojo.lat || 0,
              lng: data.dojo.lng || 0,
              phone: data.dojo.phone || "",
              email: data.dojo.email || "",
              avatar_url: data.dojo.avatar_url || "",
              background_url: data.dojo.background_url || "",
              description: data.dojo.description || "",
            });
            setAddressQuery(data.dojo.address || "");
          }
        }
      } catch (e) {
        console.error("Failed to fetch settings:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Address search with Nominatim
  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setAddressResults([]);
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data: NominatimResult[] = await res.json();
        setAddressResults(data);
        setShowDropdown(data.length > 0);
      }
    } catch (e) {
      console.error("Nominatim search failed:", e);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleAddressInput = (value: string) => {
    setAddressQuery(value);
    setFormData({ ...formData, address: value });

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value);
    }, 400);
  };

  const selectAddress = (result: NominatimResult) => {
    setFormData({
      ...formData,
      address: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    });
    setAddressQuery(result.display_name);
    setShowDropdown(false);
    setAddressResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/dashboard/dojo/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dojo_id: dojoId, ...formData }),
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-japan-blue/5 animate-pulse rounded w-1/3"></div>
        <div className="h-48 bg-japan-blue/5 animate-pulse rounded"></div>
        <div className="h-48 bg-japan-blue/5 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center pb-4 border-b border-japan-blue/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-sumi">{t("title")}</h1>
          <p className="text-sumi-muted text-sm mt-1">{t("subtitle")}</p>
        </div>
        <button
          type="submit"
          disabled={isSaving || !formData.name.trim()}
          className="bg-japan-blue text-washi px-6 py-2.5 rounded shadow-md hover:bg-japan-blue/90 flex items-center gap-2 transition-colors font-bold text-sm disabled:opacity-50"
        >
          {isSaving ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : saveStatus === "success" ? (
            <><CheckCircle size={16} /> {t("saved")}</>
          ) : saveStatus === "error" ? (
            <><AlertCircle size={16} /> {t("save_error")}</>
          ) : (
            <><Save size={16} /> {t("save")}</>
          )}
        </button>
      </div>

      {/* Background & Avatar Section */}
      <div className="bg-white border border-japan-blue/10 rounded-lg overflow-hidden">
        {/* Background Preview */}
        <div className="relative h-48 bg-gradient-to-br from-japan-blue/20 to-bamboo/10">
          {formData.background_url && (
            <Image
              src={formData.background_url}
              alt="Background"
              fill
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          {/* Avatar overlay */}
          <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white bg-washi-cream overflow-hidden shadow-lg">
            {formData.avatar_url ? (
              <Image
                src={formData.avatar_url}
                alt="Avatar"
                fill
                className="object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sumi-muted">
                <Building2 size={32} />
              </div>
            )}
          </div>
        </div>

        <div className="pt-16 px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("avatar_url")}</label>
              <div className="relative">
                <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sumi-muted" />
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-japan-blue/15 rounded bg-white text-sumi text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue/20 transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("background_url")}</label>
              <div className="relative">
                <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sumi-muted" />
                <input
                  type="url"
                  value={formData.background_url}
                  onChange={(e) => setFormData({ ...formData, background_url: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-japan-blue/15 rounded bg-white text-sumi text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue/20 transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white border border-japan-blue/10 rounded-lg p-6 space-y-5">
        <h2 className="text-lg font-serif font-bold text-sumi flex items-center gap-2">
          <Building2 size={18} className="text-japan-blue" /> {t("basic_info")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("dojo_name")} *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-japan-blue/15 rounded bg-white text-sumi focus:border-japan-blue focus:ring-1 focus:ring-japan-blue/20 transition-all"
              placeholder={t("dojo_name_placeholder")}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("chief_instructor")}</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sumi-muted" />
              <input
                type="text"
                value={formData.chief_instructor}
                onChange={(e) => setFormData({ ...formData, chief_instructor: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-japan-blue/15 rounded bg-white text-sumi text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue/20 transition-all"
                placeholder={t("chief_instructor_placeholder")}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("description_label")}</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2.5 border border-japan-blue/15 rounded bg-white text-sumi text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue/20 transition-all resize-none"
            placeholder={t("description_placeholder")}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white border border-japan-blue/10 rounded-lg p-6 space-y-5">
        <h2 className="text-lg font-serif font-bold text-sumi flex items-center gap-2">
          <MapPin size={18} className="text-japan-blue" /> {t("address_section")}
        </h2>

        <div ref={dropdownRef} className="relative">
          <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("address")}</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sumi-muted" />
            <input
              type="text"
              value={addressQuery}
              onChange={(e) => handleAddressInput(e.target.value)}
              onFocus={() => addressResults.length > 0 && setShowDropdown(true)}
              className="w-full pl-9 pr-3 py-2.5 border border-japan-blue/15 rounded bg-white text-sumi text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue/20 transition-all"
              placeholder={t("address_placeholder")}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="w-4 h-4 rounded-full border-2 border-japan-blue/30 border-t-japan-blue animate-spin block" />
              </div>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-japan-blue/15 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {addressResults.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  onClick={() => selectAddress(result)}
                  className="w-full text-left px-4 py-3 hover:bg-japan-blue/5 transition-colors border-b border-japan-blue/5 last:border-0 flex items-start gap-3"
                >
                  <MapPin size={14} className="text-japan-blue shrink-0 mt-0.5" />
                  <span className="text-sm text-sumi leading-snug">{result.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("latitude")}</label>
            <input
              type="number"
              step="any"
              value={formData.lat || ""}
              onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 border border-japan-blue/15 rounded bg-gray-50 text-sumi text-sm"
              placeholder="0.000"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("longitude")}</label>
            <input
              type="number"
              step="any"
              value={formData.lng || ""}
              onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 border border-japan-blue/15 rounded bg-gray-50 text-sumi text-sm"
              placeholder="0.000"
            />
          </div>
        </div>
        <p className="text-xs text-sumi-muted italic">{t("address_hint")}</p>
      </div>

      {/* Contact Section */}
      <div className="bg-white border border-japan-blue/10 rounded-lg p-6 space-y-5">
        <h2 className="text-lg font-serif font-bold text-sumi flex items-center gap-2">
          <Phone size={18} className="text-japan-blue" /> {t("contact_section")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("phone")}</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sumi-muted" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-japan-blue/15 rounded bg-white text-sumi text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue/20 transition-all"
                placeholder="+84-xxx-xxx-xxxx"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-sumi mb-1.5 uppercase tracking-wider">{t("email_label")}</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sumi-muted" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-japan-blue/15 rounded bg-white text-sumi text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue/20 transition-all"
                placeholder="contact@dojo.com"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
