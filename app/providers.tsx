"use client";

import { ThemeProvider } from "next-themes";
import { HomeFilterProvider } from "./components/layout/HomeFilterContext";

export function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="velvetbook-theme"
        >
            <HomeFilterProvider>{children}</HomeFilterProvider>
        </ThemeProvider>
    );
}
