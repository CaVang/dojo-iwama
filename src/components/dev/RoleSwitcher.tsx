"use client";

import { useState, useEffect } from "react";
import { UserCog, X } from "lucide-react";

export default function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const match = document.cookie.match(new RegExp('(^| )dev_simulated_role=([^;]+)'));
      if (match) {
        setCurrentRole(match[2]);
      } else {
        setCurrentRole("guest");
      }
    }
  }, []);

  if (!mounted) return null;

  // STRICT LOCALHOST CHECK
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" && 
    window.location.hostname !== "127.0.0.1"
  ) {
    return null;
  }

  const handleRoleChange = (role: string) => {
    if (role === "guest") {
      document.cookie = "dev_simulated_role=; max-age=0; path=/;";
    } else {
      document.cookie = `dev_simulated_role=${role}; path=/; max-age=86400`;
    }
    setCurrentRole(role);
    // Reload the page to apply new role context across the app
    window.location.reload();
  };

  const roles = [
    { id: "guest", label: "Guest (Not logged in)" },
    { id: "user", label: "Normal User" },
    { id: "dojo_chief", label: "Dojo Owner" },
    { id: "admin", label: "Admin" }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start">
      {isOpen && (
        <div className="mb-2 w-64 bg-white rounded-md shadow-2xl border border-japan-blue/20 overflow-hidden text-sm animate-in slide-in-from-bottom-5">
          <div className="bg-japan-blue text-washi px-4 py-2 flex justify-between items-center font-medium">
            <span>Dev Role Switcher</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-red-300">
              <X size={16} />
            </button>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id)}
                className={`text-left px-3 py-2 rounded-md transition-colors ${
                  currentRole === r.id
                    ? "bg-japan-blue/10 text-japan-blue font-bold flex items-center justify-between"
                    : "hover:bg-gray-100 text-sumi"
                }`}
              >
                <span>{r.label}</span>
                {currentRole === r.id && <span className="w-2 h-2 rounded-full bg-japan-blue inline-block"></span>}
              </button>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-sumi-muted text-center px-2">
              Reloads the page automatically. Only visible in development mode.
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-japan-blue hover:bg-japan-blue/90 text-washi p-3 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group relative"
          title="Dev Role Switcher"
        >
          <UserCog size={24} />
          {currentRole && currentRole !== "guest" && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
          )}
        </button>
      )}
    </div>
  );
}
