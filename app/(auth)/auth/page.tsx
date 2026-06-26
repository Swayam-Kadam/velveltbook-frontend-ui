import AuthHeader from "../components/AuthHeader";
import AuthSocialButtons from "../components/AuthSocialButtons";
import Link from "next/link";
import { ArrowRight, Lock, UserPlus, Sparkle } from "lucide-react";

export default function AuthPage() {
    return (
        <main
            className="relative min-h-screen overflow-hidden px-6 pt-14 pb-10"

        >
            {/* Background Image */}
            <div className="auth-background absolute inset-0" />

            {/* Overlay */}
            <div className="auth-overlay absolute inset-0 z-1 " />

            <div className="relative z-10 mx-auto flex max-w-md flex-col">
                <AuthHeader />

                <p
                    className="text-center text-xs"
                    style={{
                        color: "var(--text-secondary)",
                    }}
                >
                    Login to continue your beauty journey
                </p>

                {/* Gold Divider */}
                <div className="my-6 flex items-center justify-center gap-2">
                    <div className="h-px w-16 bg-[var(--brand-gold-light)]" />

                    <div className="relative flex items-center justify-center">
                        <div
                            className="absolute h-8 w-8 rounded-full blur-md"
                            style={{
                                background: "var(--brand-gold)",
                                opacity: 0.15,
                            }}
                        />

                        <Sparkle
                            size={12}
                            style={{
                                color: "var(--brand-gold)",
                            }}
                        />
                    </div>

                    <div className="h-px w-16 bg-[var(--brand-gold-light)]" />
                </div>

                {/* Login */}
                <Link
                    href="/login"
                    className="mb-5 flex items-center justify-between rounded-sm px-6 py-3"
                    style={{
                        background: "var(--gradient-primary)",
                        boxShadow: "var(--shadow-glow)",
                        color: "#fff",
                    }}
                >
                    <Lock size={18} />

                    <span className="text-base font-semibold">
                        Login
                    </span>

                    <ArrowRight size={18} />
                </Link>

                {/* Register */}
                <Link
                    href="/register"
                    className="mb-8 flex items-center justify-between rounded-sm border px-6 py-3"
                    style={{
                        background: "var(--bg-secondary)",
                        borderColor: "var(--brand-gold-light)",
                        boxShadow: "var(--auth-shadow)",
                        color: "var(--text-primary)",
                    }}
                >
                    <UserPlus
                        size={18}
                        style={{
                            color: "var(--brand-gold)",
                        }}
                    />

                    <span className="text-base font-semibold">
                        Create Account
                    </span>

                    <ArrowRight
                        size={18}
                        style={{
                            color: "var(--brand-gold)",
                        }}
                    />
                </Link>

                {/* Continue With */}
                <div className="mb-8 flex items-center gap-4">
                    <div
                        className="h-px flex-1"
                        style={{
                            background: "var(--border)",
                        }}
                    />

                    <span
                        className="text-xs"
                        style={{
                            color: "var(--text-secondary)",
                        }}
                    >
                        Or continue with
                    </span>

                    <div
                        className="h-px flex-1"
                        style={{
                            background: "var(--border)",
                        }}
                    />
                </div>

                <AuthSocialButtons />

                {/* Terms */}
                <div className="mt-12 text-center mb-20">
                    <p
                        className="mb-3 text-xs"
                        style={{
                            color: "var(--text-secondary)",
                        }}
                    >
                        By continuing, you agree to our
                    </p>

                    <div className="flex justify-center gap-3 font-semibold">
                        <Link
                            href="/terms"
                            className="text-(--text-primary) text-[13px]"
                        >
                            Terms of Service
                        </Link>

                        <span className="text-[13px]">|</span>

                        <Link
                            href="/privacy"
                            className="text-(--text-primary) text-[13px]"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}