import Image from "next/image"
import { Sparkle } from "lucide-react";

export default function AuthHeader() {
    return (
        <div className="mb-6">
            {/* logo will be here */}
            <Image src="/vb-logo.png" alt="logo" width={100} height={100} className="w-full h-28 object-contain" />
            <div className="flex flex-col items-center">
                <h1
                    className="text-3xl font-semibold tracking-[4px]"
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

                <div className="mt-3 flex items-center gap-1 text-[11px] tracking-[0.4em] uppercase font-semibold">
                    <span style={{ color: "var(--text-primary)" }}>Beauty</span>

                    <span style={{ color: "var(--brand-gold)" }} className="text-xl">•</span>

                    <span style={{ color: "var(--text-primary)" }}>Wellness</span>

                    <span style={{ color: "var(--brand-gold)" }} className="text-xl">•</span>

                    <span style={{ color: "var(--text-primary)" }}>Yours</span>
                </div>
            </div>
        </div>
    )
}
