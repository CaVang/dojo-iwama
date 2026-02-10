"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as THREE from "three";

const SEGMENTATION_INTERVAL_MS = 100;
const SEGMENTATION_THRESHOLD = 0.7;
const INTERNAL_RESOLUTION = "medium" as const;

interface UseBodyPixReturn {
  maskTexture: THREE.DataTexture | null;
  isModelLoading: boolean;
  modelError: string | null;
}

export function useBodyPix(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isVideoReady: boolean,
): UseBodyPixReturn {
  const modelRef = useRef<bodyPix.BodyPix | null>(null);
  const maskTextureRef = useRef<THREE.DataTexture | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [maskTexture, setMaskTexture] = useState<THREE.DataTexture | null>(
    null,
  );

  // Load BodyPix model once
  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      try {
        await tf.ready();
        const model = await bodyPix.load({
          architecture: "MobileNetV1",
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2,
        });

        if (!cancelled) {
          modelRef.current = model;
          setIsModelLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setModelError(
            err instanceof Error ? err.message : "Failed to load BodyPix model",
          );
          setIsModelLoading(false);
        }
      }
    }

    loadModel();
    return () => {
      cancelled = true;
    };
  }, []);

  // Convert segmentation data to DataTexture
  const updateMaskTexture = useCallback(
    (segData: Uint8Array, width: number, height: number) => {
      const maskData = new Uint8Array(width * height * 4);

      for (let i = 0; i < segData.length; i++) {
        const v = segData[i] * 255;
        maskData[i * 4] = v;
        maskData[i * 4 + 1] = v;
        maskData[i * 4 + 2] = v;
        maskData[i * 4 + 3] = 255;
      }

      if (maskTextureRef.current && maskTextureRef.current.image?.data) {
        (maskTextureRef.current.image.data as Uint8Array).set(maskData);
        maskTextureRef.current.needsUpdate = true;
      } else {
        const texture = new THREE.DataTexture(
          maskData,
          width,
          height,
          THREE.RGBAFormat,
        );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        maskTextureRef.current = texture;
        setMaskTexture(texture);
      }
    },
    [],
  );

  // Throttled segmentation loop
  useEffect(() => {
    if (!isVideoReady || !modelRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    // Create offscreen canvas for segmentation input
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement("canvas");
    }

    const runSegmentation = async () => {
      if (!video || video.paused || !video.videoWidth || !modelRef.current)
        return;

      const canvas = offscreenCanvasRef.current!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const segmentation = await modelRef.current.segmentPerson(canvas, {
          internalResolution: INTERNAL_RESOLUTION,
          segmentationThreshold: SEGMENTATION_THRESHOLD,
        });

        updateMaskTexture(
          segmentation.data as unknown as Uint8Array,
          segmentation.width,
          segmentation.height,
        );
      } catch {
        // Silently skip frame if segmentation fails
      }
    };

    intervalRef.current = setInterval(runSegmentation, SEGMENTATION_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isVideoReady, isModelLoading, videoRef, updateMaskTexture]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (maskTextureRef.current) {
        maskTextureRef.current.dispose();
      }
    };
  }, []);

  return { maskTexture, isModelLoading, modelError };
}
