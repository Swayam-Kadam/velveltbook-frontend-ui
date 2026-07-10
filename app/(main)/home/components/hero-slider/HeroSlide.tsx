"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Share2 } from "lucide-react";

interface SlideTiming {
  day: string;
  hours: string;
}

interface HeroSlideProps {
  image: string;
  title: string;
  description: string;
  time: string;
  timings: SlideTiming[];
}

export function HeroSlide({
  image,
  title,
  description,
  time,
  timings,
}: HeroSlideProps) {
  const titleLines = title.split("\n");
  const [isTimingsOpen, setIsTimingsOpen] = useState(false);
  const timingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timingsRef.current &&
        !timingsRef.current.contains(event.target as Node)
      ) {
        setIsTimingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-(--border) dark:border-white/10 lg:rounded-[8px]">
      <div className="relative min-h-[200px] w-full lg:min-h-[330px] xl:min-h-[330px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 80vw"
          priority
          className="object-cover"
        />

        {/* Light theme white gradient */}
        <div
          className="
    absolute inset-y-0 left-0 w-[72%]
    bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.82)_48%,rgba(255,255,255,0.35)_72%,transparent_100%)]
    [.dark_&]:hidden
  "
        />

        {/* Dark theme overlays */}
        <div className="absolute inset-0 hidden bg-black/20 [.dark_&]:block" />

        <div
          className="
    absolute inset-0 hidden
    bg-[rgba(4,1,10,0.18)]
    [.dark_&]:block
  "
        />

        <div
          className="
    absolute inset-y-0 left-0 hidden w-[68%]
    bg-[linear-gradient(90deg,rgba(10,4,25,0.96)_0%,rgba(35,12,65,0.92)_42%,rgba(7,1,15,0.72)_68%,transparent_100%)]
    [.dark_&]:block
  "
        />

        <div
          className="
    absolute -left-[12%] top-1/2 hidden
    h-[140%] w-[85%]
    -translate-y-1/2
    rounded-full
    bg-[radial-gradient(circle,#8B5CF6_0%,transparent_68%)]
    opacity-30 blur-[56px]
    [.dark_&]:block
  "
        />

        <div
          className="
                        absolute inset-y-0 left-[42%] hidden w-[28%]
                        bg-[radial-gradient(ellipse_at_left,rgba(0,0,0,0.18)_0%,transparent_72%)]
                        blur-xl
                        [.dark_&]:block
                    "
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center p-5 lg:p-20">
          <div className="absolute right-2 top-2 flex items-start justify-between gap-1 lg:hidden">
            <div ref={timingsRef} className="relative">
              <button
                type="button"
                onClick={() => setIsTimingsOpen((prev) => !prev)}
                className="primary-button flex items-center gap-0.5 rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md"
              >
                Timings
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isTimingsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isTimingsOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-[190px] rounded-xl border border-white/20 bg-black/70 p-2 text-white shadow-lg backdrop-blur-xl">
                  {/* <div className="mb-1 border-b border-white/10 px-2 pb-1 text-[10px] font-semibold">
                    {time}
                  </div> */}
                  <div className="space-y-1">
                    {timings.map((timing) => (
                      <div
                        key={timing.day}
                        className="flex items-center justify-between gap-3 rounded-lg px-2 text-[10px]"
                      >
                        <span className="text-white/85">{timing.day}</span>
                        <span className="text-right text-white/70">
                          {timing.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
              <Share2 size={12} />
            </button>
          </div>

          <div className="min-h-[50px] max-w-[55%] lg:max-w-[440px]">
            <h2
              className="
                                mb-3 whitespace-pre-line
                                text-[24px] font-semibold leading-[24px]
                                text-(--accent-primary)  [.dark_&]:text-[#E6BE78]
                                lg:mb-5 lg:text-[64px] lg:leading-[58px]
                            "
            >
              {titleLines.map((line, index) => (
                <span
                  key={line}
                  className={index > 0 ? "lg:text-(--brand-gold)" : ""}
                >
                  {line}
                  {index < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h2>

            <p className="max-w-[220px] text-[12px] text-var(--accent-primary)] [.dark_&]:text-white lg:max-w-[360px] lg:text-[16px] lg:leading-7 lg:text-(--text-primary)">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
