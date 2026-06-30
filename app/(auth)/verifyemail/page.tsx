"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Clock3,
    MailOpen,
    SendHorizontal,
    ShieldCheck,
    SquarePen,
} from "lucide-react";

import AuthHeader from "../components/AuthHeader";

const OTP_LENGTH = 6;
const EXPIRY_SECONDS = 165; // 02:45

export default function VerifyEmailPage() {
    const router = useRouter();

    const email = "joydeo@gmail.com";

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setInterval(() => {
            setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);

    const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(
        2,
        "0",
    )}:${String(secondsLeft % 60).padStart(2, "0")}`;

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        setOtp((prev) => {
            const next = [...prev];
            next[index] = digit;
            return next;
        });
        if (digit && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((char, i) => (next[i] = char));
        setOtp(next);
        inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Email verification logic / API call goes here.
    };

    const handleResend = () => {
        setSecondsLeft(EXPIRY_SECONDS);
        setOtp(Array(OTP_LENGTH).fill(""));
        inputsRef.current[0]?.focus();
        // Resend-code API call goes here.
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
                        Verify Your Email
                    </h2>

                    <p
                        className="mt-1.5 text-center text-xs"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Enter the 6-digit code sent to
                    </p>
                    <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {email}
                    </p>
                </div>

                {/* Illustration */}
                <div className="my-6 flex justify-center">
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
                            <ShieldCheck size={15} style={{ color: "var(--brand-gold)" }} />
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label
                        className="mb-2 text-xs font-medium"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Enter 6-Digit Code
                    </label>

                    {/* OTP inputs */}
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputsRef.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                aria-label={`Digit ${index + 1}`}
                                className="h-12 w-full rounded-sm border text-center text-lg font-semibold outline-none transition-all focus:border-(--brand-gold)"
                                style={{
                                    background: "var(--bg-secondary)",
                                    borderColor: digit
                                        ? "var(--brand-gold)"
                                        : "var(--brand-gold-light)",
                                    boxShadow: "var(--shadow-card)",
                                    color: "var(--text-primary)",
                                }}
                            />
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                        <Clock3 size={13} style={{ color: "var(--text-secondary)" }} />
                        <span
                            className="text-[11px]"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Code will expire in{" "}
                            <span
                                className="font-semibold"
                                style={{ color: "var(--brand-gold)" }}
                            >
                                {formattedTime}
                            </span>
                        </span>
                    </div>

                    {/* Verify & Continue */}
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
                        <span className="text-base font-semibold">Verify &amp; Continue</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-4">
                    <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        Didn&apos;t receive the code?
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-8">
                    <button
                        type="button"
                        onClick={handleResend}
                        className="flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
                        style={{ color: "var(--brand-gold)" }}
                    >
                        <SendHorizontal size={15} />
                        Resend Code
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
                        style={{ color: "var(--text-primary)" }}
                    >
                        <SquarePen size={15} />
                        Change Email
                    </button>
                </div>
            </div>
        </main>
    );
}
