import { LoginForm } from "@/components/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Log in — LifeGuard",
  description: "Log in to the LifeGuard operator console, family app, or reseller dashboard.",
};

export default function Login() {
  return (
    <section className="container-x py-24">
      <div className="max-w-[440px] mx-auto">
        <div className="text-center mb-10">
          <div className="eyebrow mb-3">Operator console</div>
          <h1 className="h2 text-[32px] md:text-[40px]">Log in</h1>
          <p className="mt-3 text-[15px]" style={{ color: "var(--color-body)" }}>
            Sign in to the caregiver dashboard.
          </p>
        </div>
        <div className="card-elevated p-8">
          <Suspense fallback={<div className="text-[13px]" style={{ color: "var(--color-muted)" }}>Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
        <p
          className="mt-6 text-center text-[12px]"
          style={{ color: "var(--color-muted)" }}
        >
          By logging in you agree to our terms of service. Sessions timeout
          after 12 hours of inactivity.
        </p>
      </div>
    </section>
  );
}