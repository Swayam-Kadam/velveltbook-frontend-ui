// Routes that belong to the (auth) flow. Route groups like (auth) don't
// appear in the URL, so we match the actual pathnames here.
const authRoutePrefixes = [
    "/auth",
    "/login",
    "/register",
    "/signup",
    "/forgetpassword",
    "/createnewpassword",
    "/verifyemail",
];

export function isAuthRoute(pathname: string | null): boolean {
    if (!pathname) return false;
    return authRoutePrefixes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
}
