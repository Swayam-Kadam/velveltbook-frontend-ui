"use client";

import Image from "next/image";
import {
    type ElementType,
    type FormEvent,
    type HTMLAttributes,
    type HTMLInputTypeAttribute,
    useId,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Bell,
    Camera,
    CalendarDays,
    ChevronRight,
    Mail,
    Phone,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/Button";
import { initialProfile, type ProfileFormState } from "@/data/account/profile";

function ProfileTopBar() {
    const router = useRouter();

    return (
        <div className="sticky top-0 z-30 -mx-3 border-b border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--bg-primary)_88%,transparent)] px-3 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur-2xl sm:-mx-4 sm:px-4">
            <div className="flex items-center justify-between ">
                <button
                    type="button"
                    onClick={() => router.back()}
                    aria-label="Go back"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--border)_90%,transparent)] bg-[var(--bg-card)] text-(--text-primary) shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-x-0.5 hover:opacity-90"
                >
                    <ArrowLeft size={18} strokeWidth={1.8} />
                </button>

                <h1 className="text-center text-[18px] font-medium tracking-[0.01em] text-(--text-primary)">
                    Profile
                </h1>

                <span aria-hidden="true" className="h-10 w-10" />
            </div>
        </div>
    );
}

function SectionHeading({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: ElementType;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex items-start gap-3 px-1">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]">
                <Icon size={18} strokeWidth={1.8} className="text-(--accent-primary)" />
            </div>

            <div className="min-w-0">
                <h2 className="text-[15px] font-semibold text-(--text-primary)">{title}</h2>
                <p className="mt-0.5 text-[11px] leading-tight text-(--text-secondary)">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

function ProfileFieldCard({
    icon: Icon,
    label,
    value,
    onChange,
    type = "text",
    inputMode,
    autoComplete,
}: {
    icon: ElementType;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: HTMLInputTypeAttribute;
    inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete?: string;
}) {
    const inputId = useId();

    return (
        <article className="feature-card rounded-2xl border border-[color-mix(in_srgb,var(--border)_92%,transparent)] p-4 shadow-[var(--shadow-card)] transition-transform duration-200">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]">
                    <Icon size={16} strokeWidth={1.8} className="text-(--accent-primary)" />
                </div>

                <div className="min-w-0 flex-1">
                    <label
                        htmlFor={inputId}
                        className="block text-[11px] font-medium text-(--text-secondary)"
                    >
                        {label}
                    </label>

                    <input
                        id={inputId}
                        type={type}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        className="
                            mt-1 w-full min-w-0 bg-transparent
                            text-[15px] font-medium text-(--text-primary)
                            outline-none placeholder:text-(--text-muted)
                            focus-visible:ring-0
                        "
                    />
                </div>

                <ChevronRight
                    size={16}
                    strokeWidth={1.8}
                    className="mt-1 shrink-0 text-(--text-muted)"
                />
            </div>
        </article>
    );
}

function NotificationCard({
    enabled,
    onToggle,
}: {
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <article className="feature-card rounded-2xl border border-[color-mix(in_srgb,var(--border)_92%,transparent)] p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]">
                    <Bell size={16} strokeWidth={1.8} className="text-(--accent-primary)" />
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="text-[14px] font-semibold text-(--text-primary)">
                        Notifications
                    </h2>
                    <p className="mt-0.5 text-[11px] leading-tight text-(--text-secondary)">
                        Send me emails with fresh news and promos
                    </p>
                </div>

                <button
                    type="button"
                    aria-pressed={enabled}
                    aria-label={enabled ? "Disable notifications" : "Enable notifications"}
                    onClick={onToggle}
                    className={`
                        relative flex h-8 w-14 shrink-0 items-center rounded-full border p-1 transition-all duration-200
                        ${enabled
                            ? "border-[color-mix(in_srgb,var(--accent-primary)_45%,var(--border))] bg-(--accent-primary)"
                            : "border-[color-mix(in_srgb,var(--border)_95%,transparent)] bg-[var(--bg-card-hover)]"
                        }
                    `}
                >
                    <span
                        className={`
                            h-6 w-6 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.18)]
                            transition-transform duration-200
                            ${enabled ? "translate-x-6" : "translate-x-0"}
                        `}
                    />
                </button>
            </div>
        </article>
    );
}

export default function ProfilePage() {
    const [form, setForm] = useState<ProfileFormState>(initialProfile);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);

        try {
            // Preserve the existing save flow placeholder; hook the current update logic here.
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-(--bg-primary)">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--brand-gold)_10%,transparent)_0%,transparent_34%),radial-gradient(circle_at_bottom_right,_color-mix(in_srgb,var(--accent-primary)_8%,transparent)_0%,transparent_28%)]"
            />

            <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-3 pb-[calc(8rem+env(safe-area-inset-bottom))] sm:px-4">
                <ProfileTopBar />

                <form id="profile-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 pt-3">
                    <section className="feature-card rounded-[28px] border border-[color-mix(in_srgb,var(--border)_88%,transparent)] p-5 shadow-[var(--shadow-card)]">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative">
                                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[var(--bg-card)] shadow-[0_8px_24px_rgba(61,28,77,0.14)]">
                                    <Image
                                        src="/profile.jpeg"
                                        alt="Profile photo"
                                        fill
                                        priority
                                        sizes="96px"
                                        className="object-cover"
                                    />
                                </div>

                                <button
                                    type="button"
                                    aria-label="Change profile picture"
                                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent-primary)_45%,transparent)] bg-(--accent-primary) text-white shadow-[0_10px_20px_rgba(61,28,77,0.18)] transition-transform duration-200 hover:scale-105"
                                >
                                    <Camera size={14} strokeWidth={2} />
                                </button>
                            </div>

                            <h2 className="mt-4 text-[22px] font-semibold tracking-[0.01em] text-(--text-primary)">
                                {form.fullName}
                            </h2>
                            <p className="mt-1 text-[12px] text-(--text-secondary)">
                                {form.email}
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <SectionHeading
                            icon={UserRound}
                            title="Personal Information"
                            subtitle="Manage your personal details"
                        />

                        <div className="space-y-3">
                            <ProfileFieldCard
                                icon={UserRound}
                                label="Full Name"
                                value={form.fullName}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, fullName: value }))
                                }
                                autoComplete="name"
                            />

                            <ProfileFieldCard
                                icon={Mail}
                                label="Email Address"
                                value={form.email}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, email: value }))
                                }
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                            />

                            <ProfileFieldCard
                                icon={Phone}
                                label="Mobile Number"
                                value={form.mobileNumber}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, mobileNumber: value }))
                                }
                                type="tel"
                                autoComplete="tel"
                                inputMode="tel"
                            />

                            <ProfileFieldCard
                                icon={CalendarDays}
                                label="Date of Birth"
                                value={form.dateOfBirth}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, dateOfBirth: value }))
                                }
                                type="date"
                            />
                        </div>
                    </section>

                    <NotificationCard
                        enabled={notificationsEnabled}
                        onToggle={() => setNotificationsEnabled((current) => !current)}
                    />
                </form>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-3 pb-[calc(12px+env(safe-area-inset-bottom))] sm:px-4">
                <Button
                    type="submit"
                    form="profile-form"
                    fullWidth
                    disabled={isSaving}
                    className="
                        rounded-2xl px-4 py-3.5 text-[15px] font-semibold tracking-[0.02em]
                        shadow-[var(--shadow-glow)]
                        disabled:cursor-not-allowed disabled:opacity-70
                    "
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </main>
    );
}
