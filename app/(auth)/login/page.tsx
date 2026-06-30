"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkle } from "lucide-react";

import AuthHeader from "../components/AuthHeader";
import AuthSocialButtons from "../components/AuthSocialButtons";

const inputWrapStyle = {
    background: "var(--bg-secondary)",
    borderColor: "var(--brand-gold-light)",
    boxShadow: "var(--shadow-card)",
};

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Authentication logic / API call goes here.
    };

    return (
        <main className="relative min-h-screen overflow-hidden px-6 pt-12 pb-10">
            {/* Background Image */}
            <div className="auth-background absolute inset-0" />

            {/* Overlay */}
            <div className="auth-overlay absolute inset-0 z-1" />

            <div className="relative z-10 mx-auto flex w-full max-w-md flex-col">
                {/* Logo */}
                <AuthHeader />

                {/* Heading */}
                <div className="flex flex-col items-center">
                    <h2
                        className="text-3xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Welcome Back
                    </h2>

                    <p
                        className="mt-1.5 text-center text-xs"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Login to continue your beauty journey
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* Email or Phone */}
                    <div
                        className="flex items-center gap-3 rounded-sm border px-4 py-3"
                        style={inputWrapStyle}
                    >
                        <Mail size={18} style={{ color: "var(--brand-gold)" }} />
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Email or Phone number"
                            autoComplete="username"
                            className="w-full bg-transparent text-sm outline-none"
                            style={{ color: "var(--text-primary)" }}
                        />
                    </div>

                    {/* Password */}
                    <div
                        className="flex items-center gap-3 rounded-sm border px-4 py-3"
                        style={inputWrapStyle}
                    >
                        <Lock size={18} style={{ color: "var(--brand-gold)" }} />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            autoComplete="current-password"
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

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <Link
                            href="/forgetpassword"
                            className="text-xs font-semibold"
                            style={{ color: "var(--brand-gold)" }}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="mt-2 flex items-center justify-between rounded-sm px-6 py-3.5"
                        style={{
                            background: "var(--gradient-primary)",
                            boxShadow: "var(--shadow-glow)",
                            color: "#fff",
                        }}
                    >
                        <span className="w-4" />
                        <span className="text-base font-semibold">Login</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                {/* Or continue with */}
                <div className="my-5 flex items-center gap-4">
                    <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        Or continue with
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                </div>

                {/* Social Buttons */}
                <AuthSocialButtons />

                {/* Register Link */}
                <p
                    className="mt-8 text-center text-xs"
                    style={{ color: "var(--text-secondary)" }}
                >
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold"
                        style={{ color: "var(--brand-gold)" }}
                    >
                        Register Now
                    </Link>
                </p>
            </div>
        </main>
    );
}
