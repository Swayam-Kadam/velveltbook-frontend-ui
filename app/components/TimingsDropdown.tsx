"use client";

import { useEffect, useRef, useState } from "react";
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
  const rootRef = useRef<HTMLDivElement>(null);

  const resolvedTimings =
    timings && timings.length > 0
      ? timings
      : DEFAULT_WEEKDAYS.map((day) => ({ day, hours: summary }));

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
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

      {isOpen && (
        type === "trending-nearby" ? (
          <div className={`absolute right-[-40px] top-full z-20 mt-2 w-[135px] rounded-xl border border-white/20 bg-black/70 p-2 text-white shadow-lg backdrop-blur-xl ${panelClassName}`}>
            <div className="space-y-1">
              {resolvedTimings.map((timing) => (
                <div key={timing.day} className="flex items-center justify-between gap-3 rounded-lg px-2  text-[10px]">
                  <span className="text-white/85">{timing.day.slice(0, 3)}</span>
                  <span className="text-right text-white/70">{timing.hours}</span>
                </div>
              ))}
            </div>
          </div>
        )  : type === "Right-most" ? (
        <div
          className={`absolute right-[-6rem] top-full z-20 mt-2 w-[190px] rounded-xl border border-white/20 bg-black/70 p-2 text-white shadow-lg backdrop-blur-xl ${panelClassName}`}
        >
          <div className="space-y-1">
            {resolvedTimings.map((timing) => (
              <div
                key={timing.day}
                className="flex items-center justify-between gap-3 rounded-lg px-2  text-[10px]"
              >
                <span className="text-white/85 text-[12px]">{timing.day}</span>
                <span className="text-right text-white/85 text-[12px]">{timing.hours}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={`absolute right-0 top-full z-20 mt-2 w-[190px] rounded-xl border border-white/20 bg-black/70 p-2 text-white shadow-lg backdrop-blur-xl ${panelClassName}`}
        >
          <div className="space-y-1">
            {resolvedTimings.map((timing) => (
              <div
                key={timing.day}
                className="flex items-center justify-between gap-3 rounded-lg px-2 text-[10px]"
              >
                <span className="text-white/85">{timing.day}</span>
                <span className="text-right text-white/70">{timing.hours}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
