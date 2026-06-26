"use client";

import Image from "next/image";
import { FaApple } from "react-icons/fa";
import { Smartphone } from "lucide-react";

interface AuthSocialButtonsProps {
    onGoogle?: () => void;
    onApple?: () => void;
    onPhone?: () => void;
}

export default function AuthSocialButtons({
    onGoogle,
    onApple,
    onPhone,
}: AuthSocialButtonsProps) {
    const buttonClass =
        "flex px-4 py-2 items-center justify-center gap-2 rounded-[8px] border transition-all duration-300 hover:-translate-y-0.5";

    const buttonStyle = {
        background: "var(--bg-secondary)",
        borderColor: "var(--brand-gold-light)",
        boxShadow: "var(--shadow-card)",
        color: "var(--text-primary)",
    };

    return (
        <div className="grid grid-cols-3 gap-2">
            {/* Google */}
            <button
                onClick={onGoogle}
                className={buttonClass}
                style={buttonStyle}
            >
                <Image
                    src="/google.png"
                    alt="Google"
                    width={16}
                    height={16}
                    priority
                />
                <span className="text-xs font-medium">Google</span>
            </button>

            {/* Apple */}
            <button
                onClick={onApple}
                className={buttonClass}
                style={buttonStyle}
            >
                <FaApple
                    size={16}
                    style={{
                        color: "var(--text-primary)",
                    }}
                />
                <span className="text-xs font-medium">Apple</span>
            </button>

            {/* Phone */}
            <button
                onClick={onPhone}
                className={buttonClass}
                style={buttonStyle}
            >
                <Smartphone
                    size={16}
                    style={{
                        color: "var(--text-primary)",
                    }}
                />
                <span className="text-xs font-medium">Phone</span>
            </button>
        </div>
    );
}