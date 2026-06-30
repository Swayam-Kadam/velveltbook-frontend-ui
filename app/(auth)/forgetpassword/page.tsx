"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Mail, MailOpen, Phone, Sparkle } from "lucide-react";

import AuthHeader from "../components/AuthHeader";

export default function ForgetPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");

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
                        Forgot Password?
                    </h2>

                    <p
                        className="mt-1.5 max-w-xs text-center text-xs leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        No worries! Enter your email address and we&apos;ll send you a
                        link to reset your password.
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

                {/* Illustration */}
                <div className="mb-6 flex justify-center">
                    <div
                        className="relative flex h-28 w-28 items-center justify-center rounded-full"
                        style={{
                            background:
                                "color-mix(in srgb, var(--brand-gold) 12%, transparent)",
                        }}
                    >
                        <div
                            className="flex h-20 w-20 items-center justify-center rounded-full"
                            style={{
                                background: "var(--gradient-primary)",
                                boxShadow: "var(--shadow-glow)",
                            }}
                        >
                            <MailOpen size={34} style={{ color: "#fff" }} strokeWidth={1.6} />
                        </div>

                        <span
                            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border-2"
                            style={{
                                background: "var(--bg-secondary)",
                                borderColor: "var(--brand-gold-light)",
                            }}
                        >
                            <Lock size={15} style={{ color: "var(--brand-gold)" }} />
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label
                        className="mb-2 text-xs font-medium"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Email Address
                    </label>

                    <div
                        className="flex items-center gap-3 rounded-sm border px-4 py-3"
                        style={{
                            background: "var(--bg-secondary)",
                            borderColor: "var(--brand-gold-light)",
                            boxShadow: "var(--shadow-card)",
                        }}
                    >
                        <Mail size={18} style={{ color: "var(--brand-gold)" }} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            autoComplete="email"
                            className="w-full bg-transparent text-sm outline-none"
                            style={{ color: "var(--text-primary)" }}
                        />
                    </div>

                    {/* Send Reset Link */}
                    <button
                        type="submit"
                        className="mt-4 flex items-center justify-between rounded-sm px-6 py-3.5"
                        style={{
                            background: "var(--gradient-primary)",
                            boxShadow: "var(--shadow-glow)",
                            color: "#fff",
                        }}
                    >
                        <span className="w-4" />
                        <span className="text-base font-semibold">Send Reset Link</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                {/* Or divider */}
                <div className="my-5 flex items-center gap-4">
                    <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        Or
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                </div>

                {/* Reset via Phone */}
                <Link
                    href="/forgetpassword/phone"
                    className="flex items-center justify-center gap-2 rounded-sm border px-6 py-3"
                    style={{
                        background: "var(--bg-secondary)",
                        borderColor: "var(--brand-gold-light)",
                        boxShadow: "var(--shadow-card)",
                        color: "var(--text-primary)",
                    }}
                >
                    <Phone size={16} style={{ color: "var(--brand-gold)" }} />
                    <span className="text-sm font-semibold">Reset via Phone Number</span>
                </Link>

                {/* Back to Login */}
                <p
                    className="mt-8 text-center text-xs"
                    style={{ color: "var(--text-secondary)" }}
                >
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-semibold"
                        style={{ color: "var(--brand-gold)" }}
                    >
                        Back to Login
                    </Link>
                </p>
            </div>
        </main>
    );
}
