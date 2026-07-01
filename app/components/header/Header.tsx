"use client";

import Image from "next/image";
import { Bell, ChevronDown, LogOut, UserRound, Sparkle } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { NavigationMenu } from "../navigation/desktop/NavigationMenu";
import { useHomeFilter } from "../layout/HomeFilterContext";
import { useEffect, useRef, useState } from "react";
import { isAuthRoute } from "@/lib/authRoutes";


export function Header() {
    const pathname = usePathname();
	const { toggleHomeFilter } = useHomeFilter();
    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

	const hideHeaderRoutes = [
		"/auth",
		"/login",
		"/register",
	    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setMenuOpen(false);
        router.push("/auth");
    };

    if (isAuthRoute(pathname) || hideHeaderRoutes.includes(pathname)) {
        return null;
    }

    return (
        <header className="flex flex-col gap-3 px-2 pt-4 sm:px-6 sm:pt-6 lg:mx-auto lg:h-[80px] lg:w-full lg:max-w-[1600px] lg:flex-row lg:items-center lg:gap-7 lg:px-5 lg:py-3">
            <div className="flex items-center justify-between lg:contents">
                <div className="flex min-w-0 items-center lg:shrink-0">
                    <Image
                        src="/vb-logo.png"
                        alt="Velvetbook"
                        width={100}
                        height={100}
                        priority
                        className="h-14 w-14 object-contain sm:h-12 sm:w-12 lg:h-10 lg:w-10"
                    />

                    {/* <h1 className="hidden min-[331px]:block brand-logo text-[18px] font-semibold leading-none tracking-[0.02em] text-(--brand-gold)">
                        VELVETBOOK
                    </h1> */}


                    <div className="flex flex-col items-center lg:items-start">
                        <h1
                            className="text-lg font-semibold tracking-[4px] lg:text-[24px] leading-[24px]"
                            style={{
                                color: "var(--logo-text)",
                            }}                >
                            VELVET
                            <span
                                style={{
                                    color: "var(--brand-gold)",
                                }}
                            >
                                BOOK
                            </span>
                        </h1>


                        {/* Gold Divider */}
                        <div className="flex items-center justify-center">
                            <div className="h-[0.5px] w-18 lg:w-23 bg-[var(--brand-gold-light)]" />

                            <div className="relative flex items-center justify-center">
                                <div
                                    className="absolute h-8 w-8 rounded-full blur-md"
                                    style={{
                                        background: "var(--brand-gold)",
                                        opacity: 0.15,
                                    }}
                                />

                                <Sparkle
                                    size={6}
                                    style={{
                                        color: "var(--brand-gold)",
                                    }}
                                />
                            </div>

                            <div className="h-[0.5px] w-18 lg:w-23 bg-[var(--brand-gold-light)]" />
                        </div>

                        <div className="flex items-center gap-1 text-[6.5px] lg:text-[8.5px] tracking-[0.4em] uppercase font-semibold">
                            <span style={{ color: "var(--text-primary)" }}>Beauty</span>

                            <span style={{ color: "var(--brand-gold)" }} className="text-md">•</span>

                            <span style={{ color: "var(--text-primary)" }}>Wellness</span>

                            <span style={{ color: "var(--brand-gold)" }} className="text-md">•</span>

                            <span style={{ color: "var(--text-primary)" }}>Yours</span>
                        </div>
                    </div>

                </div>

                <div className="hidden lg:block lg:w-[360px] xl:w-[420px]">
                    <SearchBar
                        onFilterClick={
                            pathname === "/home" ? toggleHomeFilter : undefined
                        }
                        className="lg:h-10 lg:rounded-[10px] lg:px-4"
                    />
                </div>

                <NavigationMenu className="lg:flex-1 lg:gap-5 xl:gap-8" />

                <div className="flex items-center gap-2 lg:shrink-0">
                    <ThemeToggle />

                    <button
                        className="
    relative flex h-[38px] w-[38px] items-center justify-center
    rounded-full border border-[color-mix(in_srgb,var(--accent-glow)_10%,var(--border))]
    bg-[radial-gradient(circle_at_top,var(--bg-card-hover)_0%,var(--bg-card)_70%)]
    backdrop-blur-2xl
    shadow-[
      inset_0_1px_0_color-mix(in_srgb,var(--accent-glow)_8%,transparent),
      inset_0_0_20px_color-mix(in_srgb,var(--accent-glow)_4%,transparent),
      0_0_0_1px_color-mix(in_srgb,var(--accent-glow)_4%,transparent)
    ]
    transition-all duration-300
    hover:border-[color-mix(in_srgb,var(--accent-glow)_18%,var(--border))]
    hover:shadow-[
      inset_0_1px_0_color-mix(in_srgb,var(--accent-glow)_10%,transparent),
      inset_0_0_24px_color-mix(in_srgb,var(--accent-glow)_6%,transparent),
      0_0_18px_color-mix(in_srgb,var(--accent-glow)_12%,transparent)
    ]
  "
                    >
                        <Bell
                            className="h-4 w-4 text-(--text-primary)"
                            strokeWidth={1.6}
                        />

                        <span
                            className="
      absolute -right-[2px] top-[2px]
      flex h-3 w-3 items-center justify-center
      rounded-full
      bg-(--accent-primary)
      text-[11px] font-semibold text-white
      shadow-[0_0_12px_color-mix(in_srgb,var(--accent-glow)_40%,transparent)]
    "
                        >
                            2
                        </span>
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            className="flex items-center gap-1"
                        >
                            <div className="relative h-9.5 w-9.5 overflow-hidden rounded-full border-2 border-(--brand-gold)">
                                <Image
                                    src="/profile.jpeg"
                                    alt="Profile"
                                    fill
                                    sizes="38px"
                                    className="object-cover"
                                />
                            </div>

                            <ChevronDown
                                className={`h-4 w-4 text-(--text-secondary) transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {menuOpen && (
                            <div
                                role="menu"
                                className="
                                    absolute right-0 top-[calc(100%+8px)] z-50 w-40 overflow-hidden
                                    rounded-xl border border-(--border) bg-(--bg-card)
                                    shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl
                                "
                            >
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        router.push("/profile");
                                    }}
                                    className="
                                        flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px]
                                        font-semibold text-(--text-primary)
                                        transition-colors hover:bg-(--bg-card-hover)
                                    "
                                >
                                    <UserRound size={15} className="text-(--accent-primary)" />
                                    Profile
                                </button>

                                <div className="h-px bg-(--border)" />

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className="
                                        flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px]
                                        font-semibold text-[#e2536b]
                                        transition-colors hover:bg-[color-mix(in_srgb,#e2536b_8%,transparent)]
                                    "
                                >
                                    <LogOut size={15} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>



        </header>
    );
}
