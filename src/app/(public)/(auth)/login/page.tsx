import { Suspense } from "react";
import LoginPageClient from "./page.client";

export const dynamic = "force-dynamic"; // evita prerender estático

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <LoginPageClient />
    </Suspense>
  );
}
