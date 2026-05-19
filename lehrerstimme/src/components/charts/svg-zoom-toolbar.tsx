"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type SvgZoomToolbarProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  disabledZoomIn?: boolean;
  disabledZoomOut?: boolean;
};

export function SvgZoomToolbar({
  onZoomIn,
  onZoomOut,
  onReset,
  disabledZoomIn,
  disabledZoomOut,
}: SvgZoomToolbarProps) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm"
      role="group"
      aria-label="Diagramm-Zoom"
    >
      <Button
        type="button"
        size="icon-xs"
        variant="outline"
        onClick={onZoomOut}
        disabled={disabledZoomOut}
        aria-label="Diagramm verkleinern"
      >
        <Minus />
      </Button>
      <Button
        type="button"
        size="icon-xs"
        variant="outline"
        onClick={onZoomIn}
        disabled={disabledZoomIn}
        aria-label="Diagramm vergrößern"
      >
        <Plus />
      </Button>
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        onClick={onReset}
        aria-label="Zoom zurücksetzen"
      >
        <RotateCcw />
      </Button>
    </div>
  );
}
