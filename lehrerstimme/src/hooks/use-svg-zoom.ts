"use client";

import { useCallback, useState } from "react";

const MIN = 0.75;
const MAX = 2.25;
const STEP = 0.1;

export const SVG_ZOOM_MIN = MIN;
export const SVG_ZOOM_MAX = MAX;

export type UseSvgZoomResult = {
  scale: number;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
};

export function useSvgZoom(initial = 1): UseSvgZoomResult {
  const [scale, setScale] = useState(initial);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX, Math.round((s + STEP) * 100) / 100));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(MIN, Math.round((s - STEP) * 100) / 100));
  }, []);

  const reset = useCallback(() => {
    setScale(initial);
  }, [initial]);

  return { scale, zoomIn, zoomOut, reset };
}
