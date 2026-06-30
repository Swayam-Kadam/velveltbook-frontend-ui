"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone,
    User,
} from "lucide-react";

import AuthHeader from "../components/AuthHeader";
import AuthSocialButtons from "../components/AuthSocialButtons";

interface SignupForm {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const inputWrapStyle = {
    background: "var(--bg-secondary)",
    borderColor: "var(--brand-gold-light)",
    boxShadow: "var(--shadow-card)",
};

export default function SignupPage() {
    const router = useRouter();

    const [form, setForm] = useState<SignupForm>({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (field: keyof SignupForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

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
                <div className="mb-6 flex flex-col items-center">
                    <h2
                        className="text-2xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Create Account
                    </h2>

                    <p
                        className="mt-1 text-center text-xs"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Join us and book your favorite services
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* Full Name */}
                    <div
                        className="flex items-center gap-3 rounded-sm border px-4 py-3"
                        style={inputWrapStyle}
                    >
                        <User size={18} style={{ color: "var(--brand-gold)" }} />
                        <input
                            type="text"
                            value={form.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            placeholder="Full Name"
                            autoComplete="name"
                            className="w-full bg-transparent text-sm outline-none"
                            style={{ color: "var(--text-primary)" }}
                        />
                    </div>

                    {/* Email Address */}
                    <div
                        className="flex items-center gap-3 rounded-sm border px-4 py-3"
                        style={inputWrapStyle}
                    >
                        <Mail size={18} style={{ color: "var(--brand-gold)" }} />
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Email Address"
                            autoComplete="email"
                            className="w-full bg-transparent text-sm outline-none"
                            style={{ color: "var(--text-primary)" }}
                        />
                    </div>

                    {/* Phone Number */}
                    <div
                        className="flex items-center gap-3 rounded-sm border px-4 py-3"
                        style={inputWrapStyle}
                    >
                        <Phone size={18} style={{ color: "var(--brand-gold)" }} />
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="Phone Number"
                            autoComplete="tel"
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
                            value={form.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            placeholder="Password"
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

                    {/* Confirm Password */}
                    <div
                        className="flex items-center gap-3 rounded-sm border px-4 py-3"
                        style={inputWrapStyle}
                    >
                        <Lock size={18} style={{ color: "var(--brand-gold)" }} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={(e) =>
                                handleChange("confirmPassword", e.target.value)
                            }
                            placeholder="Confirm Password"
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

                    {/* Create Account Button */}
                    <button
                        type="submit"
                        className="mt-3 flex items-center justify-center gap-2 rounded-sm px-6 py-3.5"
                        style={{
                            background: "var(--gradient-primary)",
                            boxShadow: "var(--shadow-glow)",
                            color: "#fff",
                        }}
                    >
                        <span className="text-base font-semibold">Create Account</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                {/* Or continue with */}
                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                    <span
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Or continue with
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                </div>

                {/* Social Buttons */}
                <AuthSocialButtons />

                {/* Login Link */}
                <p
                    className="mt-8 text-center text-xs"
                    style={{ color: "var(--text-secondary)" }}
                >
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold"
                        style={{ color: "var(--brand-gold)" }}
                    >
                        Login Now
                    </Link>
                </p>
            </div>
        </main>
    );
}
