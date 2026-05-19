"use client";

import type { ReactNode } from "react";

import { SvgZoomToolbar } from "@/components/charts/svg-zoom-toolbar";
import { SVG_ZOOM_MAX, SVG_ZOOM_MIN, useSvgZoom } from "@/hooks/use-svg-zoom";

type ZoomableChartFrameProps = {
  children: ReactNode;
  /** Kurzbeschriftung für Screenreader (z. B. Diagrammtitel). */
  label: string;
};

export function ZoomableChartFrame({ children, label }: ZoomableChartFrameProps) {
  const { scale, zoomIn, zoomOut, reset } = useSvgZoom(1);

  return (
    <section aria-label={label} className="space-y-2">
      <div className="flex justify-end">
        <SvgZoomToolbar
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={reset}
          disabledZoomIn={scale >= SVG_ZOOM_MAX}
          disabledZoomOut={scale <= SVG_ZOOM_MIN}
        />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card/40 p-4">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${100 / scale}%`,
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
