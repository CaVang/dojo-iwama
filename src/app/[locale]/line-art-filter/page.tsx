"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2, Shield } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import PageTransition from "@/components/animations/PageTransition";

// Dynamic import: R3F + TensorFlow must be client-only
const VideoFilterCanvas = dynamic(
  () => import("./components/VideoFilterCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    ),
  },
);

export default function LineArtFilterPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
console.log({isAdmin, isLoading});
  // Admin guard
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <h1 className="text-2xl font-serif text-primary mb-2">
              Access Denied
            </h1>
            <p className="text-text-muted">
              You need administrator privileges to access this page.
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 section-padding">
        <div className="container-custom max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-cta mb-2">
              <Shield size={14} />
              <span>Admin Only</span>
            </div>
            <h1 className="text-3xl font-serif text-primary mb-2">
              Line Art Filter
            </h1>
            <p className="text-text-muted max-w-2xl">
              Upload a video of Aikido techniques and apply a real-time Line Art
              filter using AI body segmentation. The filter emphasizes human
              figures with edge detection while muting the background.
            </p>
          </div>

          {/* Main Content */}
          <VideoFilterCanvas />
        </div>
      </div>
    </PageTransition>
  );
}
