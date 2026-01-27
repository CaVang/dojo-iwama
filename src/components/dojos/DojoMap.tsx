"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import dojos from "@/data/dojos.json";

// Dynamically import map to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

type Dojo = {
  id: string;
  name: string;
  chief_instructor: string;
  address: string;
  lat: number;
  lng: number;
  map_link: string;
  phone?: string;
  email?: string;
  image_url: string;
  description?: string;
};

type UserLocation = {
  lat: number;
  lng: number;
};

interface DojoMapProps {
  onDojoSelect?: (dojoId: string) => void;
}

export default function DojoMap({ onDojoSelect }: DojoMapProps) {
  const t = useTranslations("dojos");
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [icon, setIcon] = useState<L.Icon | null>(null);

  // Calculate nearest dojo
  const nearestDojo = useMemo(() => {
    if (!userLocation) return null;

    let nearest: Dojo | null = null;
    let minDistance = Infinity;

    (dojos as Dojo[]).forEach((dojo: Dojo) => {
      const distance = Math.sqrt(
        Math.pow(dojo.lat - userLocation.lat, 2) +
          Math.pow(dojo.lng - userLocation.lng, 2),
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = dojo;
      }
    });

    return nearest;
  }, [userLocation]);

  // Map center and zoom
  const mapConfig = useMemo(() => {
    if (nearestDojo !== null) {
      const dojo = nearestDojo as Dojo;
      return {
        center: [dojo.lat, dojo.lng] as [number, number],
        zoom: 10,
      };
    }
    // Default: show world view centered on Europe
    return {
      center: [35, 20] as [number, number],
      zoom: 2,
    };
  }, [nearestDojo]);

  useEffect(() => {
    setIsClient(true);
    // Create custom marker icon
    import("leaflet").then((L) => {
      const customIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setIcon(customIcon);
    });
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t("geolocationNotSupported"));
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationError(t("locationError"));
        setIsLocating(false);
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  if (!isClient || !icon) {
    return (
      <div className="bg-washi-cream border border-japan-blue/10 h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-japan-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Location Button */}
      <div className="absolute top-4 right-4 z-1000">
        <button
          onClick={requestLocation}
          disabled={isLocating}
          className="flex items-center gap-2 bg-washi px-4 py-2 shadow-md border border-japan-blue/20 hover:bg-japan-blue hover:text-washi transition-colors disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span className="text-sm font-serif">
            {isLocating ? t("locating") : t("findNearestDojo")}
          </span>
        </button>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="absolute top-16 right-4 z-1000 bg-cinnabar/10 text-cinnabar px-4 py-2 text-sm">
          {locationError}
        </div>
      )}

      {/* Nearest Dojo Info */}
      {nearestDojo !== null && (
        <div className="absolute top-4 left-14 z-1000 bg-white px-4 py-3 shadow-md border border-japan-blue/20 max-w-xs">
          <p className="text-xs text-sumi-muted uppercase tracking-wider mb-1">
            {t("nearestDojo")}
          </p>
          <p className="font-serif text-sumi">{(nearestDojo as Dojo).name}</p>
        </div>
      )}

      {/* Map */}
      <MapContainer
        key={`${mapConfig.center[0]}-${mapConfig.center[1]}-${mapConfig.zoom}`}
        center={mapConfig.center}
        zoom={mapConfig.zoom}
        scrollWheelZoom={true}
        attributionControl={false}
        className="h-[400px] w-full z-0"
        style={{ background: "#f5f5dc" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {(dojos as Dojo[]).map((dojo) => (
          <Marker
            key={dojo.id}
            position={[dojo.lat, dojo.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onDojoSelect?.(dojo.id),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-serif text-lg text-sumi mb-1">
                  {dojo.name}
                </h3>
                <p className="text-sm text-sumi-muted mb-2">
                  {dojo.chief_instructor}
                </p>
                <div className="flex items-start gap-2 text-xs text-sumi-light">
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  <span>{dojo.address}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
