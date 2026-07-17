import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";

export const metadata = {
  title: "Create your account — LifeGuard",
  description: "Get a sandbox tenant in 10 minutes. Real devices ship in 48 hours.",
};

export default function Signup() {
  return (
    <section className="container-x py-20 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <div className="eyebrow mb-4">Get started</div>
          <h1 className="display-xl text-[40px] md:text-[52px]">
            One account.
            <br />
            Hardware in 48 hours.
          </h1>
          <p className="lead mt-6 max-w-[480px]">
            We&rsquo;ll provision your tenant, send you a sandbox API key, and
            put a real human in your inbox by the next business day. No
            sales-call gate on evaluation.
          </p>
          <ul
            className="mt-8 space-y-3 text-[15px]"
            style={{ color: "var(--color-body)" }}
          >
            {[
              "Stripe-style onboarding — first device in the field in 10 minutes",
              "Sandbox API key, Postman collection, sample code in 6 languages",
              "Direct line to a solutions engineer, not a sales rep",
              "Cancel any time before your first device ships",
            ].map((l) => (
              <li key={l} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 9999,
                    marginTop: 8,
                    background: "var(--color-blue)",
                  }}
                />
                <span>{l}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-[13px]" style={{ color: "var(--color-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-blue)", fontWeight: 510 }}>
              Log in
            </Link>
            .
          </div>
        </div>
        <div>
          <SignupForm />
        </div>
      </div>
    </section>
  );
}