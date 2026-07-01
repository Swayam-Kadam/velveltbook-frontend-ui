import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg-primary) px-4">
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-(--text-primary) lg:text-4xl">
          Store Not Found
        </h1>

        <p className="mt-3 text-sm text-(--text-secondary) lg:text-base">
          The store you are looking for does not exist or may have been removed.
        </p>

        <Link
          href="/"
          className="primary-button mt-8 inline-flex items-center rounded-xl px-6 py-3 text-sm font-medium text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
