import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    leftIcon?: ReactNode;
    fullWidth?: boolean;
}

export function Button({
    variant = "primary",
    leftIcon,
    fullWidth = false,
    className = "",
    children,
    ...props
}: ButtonProps) {
    const variants = {
        primary: `
      primary-button
      text-white
    `,

        secondary: `
      secondary-button
      text-[var(--text-primary)]
    `,

        icon: `
      border border-[var(--border)]
      bg-[var(--search-bg)]
      text-[var(--text-primary)]
      aspect-square
      justify-center
    `,
    };

    return (
        <button
            className={`
        inline-flex items-center justify-center
        transition-all duration-300
        backdrop-blur-2xl

        ${fullWidth ? "w-full" : ""}
        ${variants[variant]}
        ${className}
      `}
            {...props}
        >
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}

            {children}
        </button>
    );
}