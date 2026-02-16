"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/videoShaders";
import { useBodyPix } from "../hooks/useBodyPix";
import {
  Upload,
  Play,
  Pause,
  Loader2,
  AlertCircle,
  Film,
} from "lucide-react";

// Create a default white 1x1 mask texture (all body = no masking)
function createDefaultMask(): THREE.DataTexture {
  const data = new Uint8Array([255, 255, 255, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// Inner R3F component that renders the filtered video plane
function FilteredVideoPlane({
  videoElement,
  videoTexture,
  maskTexture,
  resolution,
}: {
  videoElement: HTMLVideoElement;
  videoTexture: THREE.VideoTexture;
  maskTexture: THREE.DataTexture | null;
  resolution: [number, number];
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const defaultMask = useMemo(() => createDefaultMask(), []);
  const { viewport } = useThree();

  const activeMask = maskTexture ?? defaultMask;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: videoTexture },
      uMask: { value: activeMask },
      uResolution: { value: new THREE.Vector2(resolution[0], resolution[1]) },
      uEdgeThreshold: { value: 0.12 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videoTexture],
  );

  // Update dynamic uniforms + force texture refresh every frame
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMask.value = activeMask;
      materialRef.current.uniforms.uResolution.value.set(
        resolution[0],
        resolution[1],
      );

      // Force VideoTexture to pull the latest frame from the <video> element
      if (
        videoElement.readyState >= videoElement.HAVE_CURRENT_DATA &&
        !videoElement.paused
      ) {
        videoTexture.needsUpdate = true;
      }
    }
  });

  // Fill the entire viewport regardless of aspect ratio
  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function VideoFilterCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resolution, setResolution] = useState<[number, number]>([1920, 1080]);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(
    null,
  );
  const [videoFileName, setVideoFileName] = useState<string>("");

  const { maskTexture, isModelLoading, modelError } = useBodyPix(
    videoRef,
    isVideoReady,
  );

  // Handle file upload
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Cleanup previous
      if (videoSrc) URL.revokeObjectURL(videoSrc);
      if (videoTexture) videoTexture.dispose();

      setIsVideoReady(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setVideoTexture(null);
      setVideoFileName(file.name);

      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    },
    [videoSrc, videoTexture],
  );

  // Setup video element when source changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    // Reset state
    setIsVideoReady(false);

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setResolution([video.videoWidth, video.videoHeight]);
    };

    const onCanPlay = () => {
      // Create texture once the video has enough data
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const tex = new THREE.VideoTexture(video);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        // Disable auto-update — we control updates via useFrame
        tex.generateMipmaps = false;
        tex.needsUpdate = true;
        setVideoTexture(tex);
        setIsVideoReady(true);
      }
    };

    function onTimeUpdate() {
      if (video) setCurrentTime(video.currentTime);
    }

    function onEnded() {
      setIsPlaying(false);
    }

    // Add listeners BEFORE setting src
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("canplaythrough", onCanPlay);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    // Set source and load
    video.src = videoSrc;
    video.load();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("canplaythrough", onCanPlay);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, [videoSrc]);

  // Play/Pause toggle
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Video play failed:", err);
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Seek handler
  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current;
      if (!video) return;

      const time = parseFloat(e.target.value);
      video.currentTime = time;
      setCurrentTime(time);
    },
    [],
  );

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc);
      if (videoTexture) videoTexture.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Hidden video element — must NOT have display:none, use offscreen positioning */}
      <video
        ref={videoRef}
        playsInline
        muted
        preload="auto"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* File Upload */}
      <div className="flex items-center gap-4">
        <label
          htmlFor="video-upload"
          className="btn-primary gap-2 cursor-pointer"
        >
          <Upload size={18} />
          <span>Upload Video</span>
        </label>
        <input
          id="video-upload"
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          onChange={handleFileChange}
          className="hidden"
        />
        {videoFileName && (
          <span className="text-sm text-text-muted flex items-center gap-1">
            <Film size={14} />
            {videoFileName}
          </span>
        )}
      </div>

      {/* Model loading indicator */}
      {isModelLoading && (
        <div className="flex items-center gap-3 p-4 bg-cta/5 border border-cta/20 rounded-lg text-sm text-cta">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading BodyPix AI model...</span>
        </div>
      )}

      {/* Model error */}
      {modelError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle size={16} />
          <span>BodyPix Error: {modelError}</span>
        </div>
      )}

      {/* Video loading state */}
      {videoSrc && !isVideoReady && (
        <div className="flex items-center gap-3 p-4 bg-surface border border-border/50 rounded-lg text-sm text-text-muted">
          <Loader2 size={16} className="animate-spin" />
          <span>Processing video...</span>
        </div>
      )}

      {/* Canvas Area */}
      <div
        className="relative bg-black rounded-xl overflow-hidden border border-border/50"
        style={{
          aspectRatio: `${resolution[0]} / ${resolution[1]}`,
          minHeight: "300px",
        }}
      >
        {isVideoReady && videoTexture && videoRef.current ? (
          <Canvas
            orthographic
            camera={{ zoom: 1, position: [0, 0, 1] }}
            gl={{ antialias: false, alpha: false }}
            style={{ width: "100%", height: "100%" }}
          >
            <FilteredVideoPlane
              videoElement={videoRef.current}
              videoTexture={videoTexture}
              maskTexture={maskTexture}
              resolution={resolution}
            />
          </Canvas>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 gap-3">
            <Film size={48} strokeWidth={1} />
            <span className="text-sm">Upload a video to start</span>
          </div>
        )}
      </div>

      {/* Video Controls */}
      {isVideoReady && (
        <div className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border/50">
          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Seek bar */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-text-muted font-mono w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs text-text-muted font-mono w-12">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
