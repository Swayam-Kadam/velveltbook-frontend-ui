"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

interface TimingEntry {
  day: string;
  hours: string;
}

interface TimingsDropdownProps {
  summary: string;
  timings?: TimingEntry[];
  buttonClassName?: string;
  panelClassName?: string;
  textClassName?: string;
  type?: string;
}

const DEFAULT_WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function TimingsDropdown({
  summary,
  timings,
  buttonClassName = "",
  panelClassName = "",
  textClassName = "",
  type = "",
}: TimingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const resolvedTimings =
    timings && timings.length > 0
      ? timings
      : DEFAULT_WEEKDAYS.map((day) => ({ day, hours: summary }));

  const panelWidth = type === "trending-nearby" ? 135 : 190;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updatePanelPos = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPanelPos({
        top: rect.bottom + 8,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      updatePanelPos();
      window.addEventListener("resize", updatePanelPos);
      window.addEventListener("scroll", updatePanelPos, true);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", updatePanelPos);
      window.removeEventListener("scroll", updatePanelPos, true);
    };
  }, [isOpen]);

  const panel = (
    <div
      ref={panelRef}
      style={{ top: panelPos.top, right: panelPos.right, width: panelWidth }}
      className={`fixed z-[200] rounded-xl border border-white/20 bg-black/80 p-2 text-white shadow-lg backdrop-blur-xl ${panelClassName}`}
    >
      <div className="space-y-1">
        {resolvedTimings.map((timing) => (
          <div
            key={timing.day}
            className="flex items-center justify-between gap-3 rounded-lg px-2 py-0.5 text-[10px]"
          >
            <span
              className={`text-white/85 ${type === "Right-most" ? "text-[12px]" : ""}`}
            >
              {type === "trending-nearby" ? timing.day.slice(0, 3) : timing.day}
            </span>
            <span
              className={`text-right text-white/70 ${type === "Right-most" ? "text-[12px] text-white/85" : ""}`}
            >
              {timing.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className="relative z-30">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={buttonClassName}
      >
        <span className={textClassName}>Timings</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {mounted && isOpen && createPortal(panel, document.body)}
    </div>
  );
}
