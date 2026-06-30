"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Sparkle,
} from "lucide-react";

import AuthHeader from "../components/AuthHeader";

const inputWrapStyle = {
    background: "var(--bg-secondary)",
    borderColor: "var(--brand-gold-light)",
    boxShadow: "var(--shadow-card)",
};

export default function CreateNewPasswordPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Reset-password logic / API call goes here.
    };

    return (
        <main className="relative min-h-screen overflow-hidden px-6 pt-12 pb-10">
            {/* Background Image */}
            <div className="auth-background absolute inset-0" />

            {/* Overlay */}
            <div className="auth-overlay absolute inset-0 z-1" />

            {/* Back button */}
            <button
                type="button"
                onClick={() => router.back()}
                aria-label="Go back"
                className="absolute left-5 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-70"
                style={{ color: "var(--text-primary)" }}
            >
                <ArrowLeft size={20} />
            </button>

            <div className="relative z-10 mx-auto flex w-full max-w-md flex-col">
                {/* Logo */}
                <AuthHeader />

                {/* Heading */}
                <div className="flex flex-col items-center">
                    <h2
                        className="text-2xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Create New Password
                    </h2>

                    <p
                        className="mt-1.5 max-w-xs text-center text-xs leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Your new password must be different from previous passwords.
                    </p>
                </div>

                {/* Gold Divider */}
                <div className="my-5 flex items-center justify-center gap-2">
                    <div className="h-px w-16 bg-[var(--brand-gold-light)]" />

                    <div className="relative flex items-center justify-center">
                        <div
                            className="absolute h-8 w-8 rounded-full blur-md"
                            style={{ background: "var(--brand-gold)", opacity: 0.15 }}
                        />
                        <Sparkle size={12} style={{ color: "var(--brand-gold)" }} />
                    </div>

                    <div className="h-px w-16 bg-[var(--brand-gold-light)]" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* New Password */}
                    <label
                        className="mb-2 text-xs font-medium"
                        style={{ color: "var(--text-primary)" }}
                    >
                        New Password
                    </label>

                    <div
                        className="flex items-center gap-3 rounded-sm border px-4 py-3"
                        style={inputWrapStyle}
                    >
                        <Lock size={18} style={{ color: "var(--brand-gold)" }} />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            className="w-full bg-transparent text-sm outline-none"
                            style={{ color: "var(--text-primary)" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="shrink-0 transition-opacity hover:opacity-70"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Helper text */}
                    <div className="mt-2 flex items-center gap-1.5">
                        <CheckCircle2 size={13} style={{ color: "var(--success)" }} />
                        <span
                            className="text-[11px]"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Min. 8 characters with a mix of letters, numbers &amp; symbols
                        </span>
                    </div>

                    {/* Confirm Password */}
                    <label
                        className="mb-2 mt-5 text-xs font-medium"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Confirm Password
                    </label>

                    <div
                        className="flex items-center gap-3 rounded-sm border px-4 py-3"
                        style={inputWrapStyle}
                    >
                        <Lock size={18} style={{ color: "var(--brand-gold)" }} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            className="w-full bg-transparent text-sm outline-none"
                            style={{ color: "var(--text-primary)" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((s) => !s)}
                            aria-label={
                                showConfirmPassword
                                    ? "Hide confirm password"
                                    : "Show confirm password"
                            }
                            className="shrink-0 transition-opacity hover:opacity-70"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {/* Reset Password */}
                    <button
                        type="submit"
                        className="mt-5 flex items-center justify-between rounded-sm px-6 py-3.5"
                        style={{
                            background: "var(--gradient-primary)",
                            boxShadow: "var(--shadow-glow)",
                            color: "#fff",
                        }}
                    >
                        <span className="w-4" />
                        <span className="text-base font-semibold">Reset Password</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                {/* Success note */}
                <div
                    className="mt-5 flex items-center gap-2.5 rounded-sm border px-4 py-3"
                    style={{
                        background: "color-mix(in srgb, var(--success) 10%, transparent)",
                        borderColor: "color-mix(in srgb, var(--success) 35%, transparent)",
                    }}
                >
                    <CheckCircle2
                        size={18}
                        className="shrink-0"
                        style={{ color: "var(--success)" }}
                    />
                    <p
                        className="text-[11px] leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Your password will be updated and you can login with your new
                        password.
                    </p>
                </div>
            </div>
        </main>
    );
}
