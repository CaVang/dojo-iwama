"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Upload, Play, Pause, Loader2, AlertCircle, Film } from "lucide-react";

const EDGE_THRESHOLD = 80;

/**
 * Apply Sobel edge detection on entire frame.
 *
 * - Body pixels (mask > 128): black lines on white (line art)
 * - Background pixels: muted, desaturated original color
 */
function applyLineArtFilter(
  src: ImageData,
  dst: ImageData,
  width: number,
  height: number,
) {
  const s = src.data;
  const d = dst.data;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      // Luminance helper (inline for perf)
      const lum = (i: number) => s[i] * 0.299 + s[i + 1] * 0.587 + s[i + 2] * 0.114;

      // Sobel kernel sample positions
      const tl = lum(((y - 1) * width + (x - 1)) * 4);
      const t = lum(((y - 1) * width + x) * 4);
      const tr = lum(((y - 1) * width + (x + 1)) * 4);
      const l = lum((y * width + (x - 1)) * 4);
      const r = lum((y * width + (x + 1)) * 4);
      const bl = lum(((y + 1) * width + (x - 1)) * 4);
      const b = lum(((y + 1) * width + x) * 4);
      const br = lum(((y + 1) * width + (x + 1)) * 4);

      const gx = -tl - 2 * l - bl + tr + 2 * r + br;
      const gy = -tl - 2 * t - tr + bl + 2 * b + br;
      const edge = Math.sqrt(gx * gx + gy * gy);

      // Line art for entire frame: white background, black edges
      const v = edge > EDGE_THRESHOLD ? 0 : 255;
      d[idx] = v;
      d[idx + 1] = v;
      d[idx + 2] = v;
      d[idx + 3] = 255;
    }
  }
}

export default function VideoFilterCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resolution, setResolution] = useState<[number, number]>([1920, 1080]);
  const [videoFileName, setVideoFileName] = useState<string>("");



  // Handle file upload
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (videoSrc) URL.revokeObjectURL(videoSrc);

      setIsVideoReady(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setVideoFileName(file.name);

      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    },
    [videoSrc],
  );

  // Setup video element when source changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    setIsVideoReady(false);

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setResolution([video.videoWidth, video.videoHeight]);
    };

    const onCanPlay = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        setIsVideoReady(true);
      }
    };

    function onTimeUpdate() {
      if (video) setCurrentTime(video.currentTime);
    }

    function onEnded() {
      setIsPlaying(false);
    }

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("canplaythrough", onCanPlay);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

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

  // Rendering loop — draw filtered frames to canvas
  useEffect(() => {
    if (!isVideoReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const renderFrame = () => {
      if (video.paused || video.ended) {
        animFrameRef.current = 0;
        return;
      }

      // Draw current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Read pixels
      const src = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const dst = ctx.createImageData(canvas.width, canvas.height);

      applyLineArtFilter(src, dst, canvas.width, canvas.height);
      ctx.putImageData(dst, 0, 0);

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    // Start loop when video plays
    const onPlay = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    const onPause = () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = 0;
      }
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    // Also render first frame when seeking while paused
    const onSeeked = () => {
      if (video.paused && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const src = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const dst = ctx.createImageData(canvas.width, canvas.height);
        applyLineArtFilter(src, dst, canvas.width, canvas.height);
        ctx.putImageData(dst, 0, 0);
      }
    };
    video.addEventListener("seeked", onSeeked);

    // Draw the initial (paused) frame
    if (video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const src = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const dst = ctx.createImageData(canvas.width, canvas.height);
      applyLineArtFilter(src, dst, canvas.width, canvas.height);
      ctx.putImageData(dst, 0, 0);
    }

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", onSeeked);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = 0;
      }
    };
  }, [isVideoReady]);

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Hidden video element — offscreen so browser still decodes frames */}
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
        {isVideoReady ? (
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
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
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

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
