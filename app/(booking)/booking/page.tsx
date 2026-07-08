import { Suspense } from "react";

import { BookingFlow } from "./components/BookingFlow";

export default function BookingPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <BookingFlow />
      </Suspense>
    </main>
  );
}
