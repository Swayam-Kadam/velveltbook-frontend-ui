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
    CalendarDays,
    Camera,
    ChevronRight,
    Mail,
    Pencil,
    Phone,
    Save,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/Button";
import { initialProfile, type ProfileFormState } from "@/data/account/profile";
import { AccountSidebar } from "../components/AccountSidebar";

function formatDisplayDate(value: string) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
}

function ProfileTopBar({
    isEditing,
    onToggleEdit,
}: {
    isEditing: boolean;
    onToggleEdit: () => void;
}) {
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

                <button
                    type="button"
                    onClick={onToggleEdit}
                    aria-pressed={isEditing}
                    className="flex h-10 min-w-10 items-center justify-end rounded-sm px-3 text-[14px] font-semibold bg-(--accent-primary) text-white transition-opacity duration-200 hover:opacity-80"
                >
                    {isEditing ? "Done" : "Edit"}
                </button>
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
    readOnly = false,
}: {
    icon: ElementType;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: HTMLInputTypeAttribute;
    inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete?: string;
    readOnly?: boolean;
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
                        readOnly={readOnly}
                        className={`
                            mt-1 w-full min-w-0 bg-transparent
                            text-[15px] font-medium text-(--text-primary)
                            outline-none placeholder:text-(--text-muted)
                            focus-visible:ring-0
                            ${readOnly ? "cursor-default text-(--text-secondary)" : ""}
                        `}
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

function ProfileDesktopInfoRow({
    icon: Icon,
    label,
    value,
    onChange,
    type = "text",
    inputMode,
    autoComplete,
    readOnly = false,
    displayValue,
    showChevron = true,
}: {
    icon: ElementType;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: HTMLInputTypeAttribute;
    inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete?: string;
    readOnly?: boolean;
    displayValue?: string;
    showChevron?: boolean;
}) {
    const inputId = useId();

    return (
        <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]">
                <Icon size={16} strokeWidth={1.8} className="text-(--accent-primary)" />
            </div>

            <div className="min-w-0 flex-1">
                <label
                    htmlFor={inputId}
                    className="block text-[11px] font-medium text-(--text-secondary)"
                >
                    {label}
                </label>
                {readOnly ? (
                    <p className="mt-0.5 text-[14px] font-medium text-(--text-primary)">
                        {displayValue ?? value}
                    </p>
                ) : (
                    <input
                        id={inputId}
                        type={type}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        className="mt-0.5 w-full bg-transparent text-[14px] font-medium text-(--text-primary) outline-none"
                    />
                )}
            </div>

            {showChevron ? (
                <ChevronRight size={16} className="shrink-0 text-(--text-muted)" />
            ) : null}
        </div>
    );
}

function NotificationCard({
    enabled,
    onToggle,
    compact = false,
}: {
    enabled: boolean;
    onToggle: () => void;
    compact?: boolean;
}) {
    if (compact) {
        return (
            <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]">
                    <Bell size={16} strokeWidth={1.8} className="text-(--accent-primary)" />
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="text-[14px] font-semibold text-(--text-primary)">
                        Notifications
                    </h2>
                    <p className="mt-0.5 text-[11px] text-(--text-secondary)">
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
        );
    }

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

function ProfileDesktopLayout({
    form,
    setForm,
    isEditing,
    onToggleEdit,
    notificationsEnabled,
    onToggleNotifications,
    isSaving,
    onSubmit,
}: {
    form: ProfileFormState;
    setForm: React.Dispatch<React.SetStateAction<ProfileFormState>>;
    isEditing: boolean;
    onToggleEdit: () => void;
    notificationsEnabled: boolean;
    onToggleNotifications: () => void;
    isSaving: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <div className="hidden min-h-screen flex-1 lg:flex">
            <AccountSidebar activeId="profile" user={form} />

            <div className="min-w-0 flex-1 overflow-y-auto bg-(--bg-primary)">
                <form
                    id="profile-form-desktop"
                    onSubmit={onSubmit}
                    className="mx-auto flex min-h-screen max-w-[920px] flex-col px-8 py-8"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="font-[family-name:var(--font-heading)] text-[34px] font-semibold text-(--text-primary)">
                                Profile
                            </h1>
                            <p className="mt-1 text-[14px] text-(--text-secondary)">
                                Manage your personal information and preferences
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onToggleEdit}
                            aria-pressed={isEditing}
                            className="primary-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white"
                        >
                            <Pencil size={15} />
                            {isEditing ? "Done Editing" : "Edit Profile"}
                        </button>
                    </div>

                    <section className="relative mt-6 overflow-hidden rounded-[24px] border border-[color-mix(in_srgb,var(--accent-primary)_18%,var(--border))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent-primary)_16%,white)_0%,color-mix(in_srgb,var(--brand-gold)_10%,white)_45%,color-mix(in_srgb,var(--accent-primary)_8%,white)_100%)] p-6 shadow-[var(--shadow-card)]">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-30"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent-primary) 22%, transparent) 0%, transparent 42%), radial-gradient(circle at 80% 0%, color-mix(in srgb, var(--brand-gold) 18%, transparent) 0%, transparent 36%)",
                            }}
                        />

                        <div className="relative flex items-center justify-between gap-6">
                            <div className="flex min-w-0 items-center gap-5">
                                <div className="relative shrink-0">
                                    <div className="relative h-[92px] w-[92px] overflow-hidden rounded-full border-4 border-white shadow-[0_8px_24px_rgba(61,28,77,0.14)]">
                                        <Image
                                            src="/profile.jpeg"
                                            alt="Profile photo"
                                            fill
                                            sizes="92px"
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                    {isEditing ? (
                                        <button
                                            type="button"
                                            aria-label="Change profile picture"
                                            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-(--accent-primary) text-white shadow-[var(--shadow-card)]"
                                        >
                                            <Camera size={14} />
                                        </button>
                                    ) : null}
                                </div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-[28px] font-semibold text-(--text-primary)">
                                        {form.fullName}
                                    </h2>
                                    <p className="mt-1 flex items-center gap-2 text-[13px] text-(--text-secondary)">
                                        <Mail size={14} className="text-(--accent-primary)" />
                                        {form.email}
                                    </p>
                                </div>
                            </div>

                            <Image
                                src="/vb-logo.png"
                                alt=""
                                width={120}
                                height={120}
                                aria-hidden
                                className="hidden h-24 w-24 shrink-0 object-contain opacity-70 xl:block"
                            />
                        </div>
                    </section>

                    <section className="mt-6 overflow-hidden rounded-[24px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
                        <div className="flex items-start gap-3 border-b border-(--border) px-5 py-5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]">
                                <UserRound size={18} className="text-(--accent-primary)" />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-semibold text-(--text-primary)">
                                    Personal Information
                                </h2>
                                <p className="mt-0.5 text-[12px] text-(--text-secondary)">
                                    Manage your personal details and preferences
                                </p>
                            </div>
                        </div>

                        <div className="divide-y divide-(--border)">
                            <ProfileDesktopInfoRow
                                icon={UserRound}
                                label="Full Name"
                                value={form.fullName}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, fullName: value }))
                                }
                                autoComplete="name"
                                readOnly={!isEditing}
                            />
                            <ProfileDesktopInfoRow
                                icon={Mail}
                                label="Email Address"
                                value={form.email}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, email: value }))
                                }
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                readOnly={!isEditing}
                            />
                            <ProfileDesktopInfoRow
                                icon={Phone}
                                label="Mobile Number"
                                value={form.mobileNumber}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, mobileNumber: value }))
                                }
                                type="tel"
                                autoComplete="tel"
                                inputMode="tel"
                                readOnly={!isEditing}
                            />
                            <ProfileDesktopInfoRow
                                icon={CalendarDays}
                                label="Date of Birth"
                                value={form.dateOfBirth}
                                displayValue={formatDisplayDate(form.dateOfBirth)}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, dateOfBirth: value }))
                                }
                                type="date"
                                readOnly={!isEditing}
                            />
                            <NotificationCard
                                compact
                                enabled={notificationsEnabled}
                                onToggle={onToggleNotifications}
                            />
                        </div>
                    </section>

                    <div className="mt-6 pb-4">
                        <Button
                            type="submit"
                            fullWidth
                            disabled={isSaving || !isEditing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-semibold shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <Save size={16} />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const [form, setForm] = useState<ProfileFormState>(initialProfile);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);

        try {
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <ProfileDesktopLayout
                form={form}
                setForm={setForm}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing((current) => !current)}
                notificationsEnabled={notificationsEnabled}
                onToggleNotifications={() =>
                    setNotificationsEnabled((current) => !current)
                }
                isSaving={isSaving}
                onSubmit={handleSubmit}
            />

            <main className="relative min-h-screen overflow-hidden bg-(--bg-primary) lg:hidden">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--brand-gold)_10%,transparent)_0%,transparent_34%),radial-gradient(circle_at_bottom_right,_color-mix(in_srgb,var(--accent-primary)_8%,transparent)_0%,transparent_28%)]"
                />

                <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-3 pb-[calc(8rem+env(safe-area-inset-bottom))] sm:px-4">
                    <ProfileTopBar
                        isEditing={isEditing}
                        onToggleEdit={() => setIsEditing((current) => !current)}
                    />

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

                                    {isEditing && (
                                        <button
                                            type="button"
                                            aria-label="Change profile picture"
                                            className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent-primary)_45%,transparent)] bg-(--accent-primary) text-white shadow-[0_10px_20px_rgba(61,28,77,0.18)] transition-transform duration-200 hover:scale-105"
                                        >
                                            <Camera size={14} strokeWidth={2} />
                                        </button>
                                    )}
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
                                    readOnly={!isEditing}
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
                                    readOnly={!isEditing}
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
                                    readOnly={!isEditing}
                                />

                                <ProfileFieldCard
                                    icon={CalendarDays}
                                    label="Date of Birth"
                                    value={form.dateOfBirth}
                                    onChange={(value) =>
                                        setForm((current) => ({ ...current, dateOfBirth: value }))
                                    }
                                    type="date"
                                    readOnly={!isEditing}
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
                        disabled={isSaving || !isEditing}
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
        </>
    );
}
