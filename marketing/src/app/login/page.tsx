import Link from "next/link";

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
            Single sign-on across the operator console, family app, and
            reseller dashboard.
          </p>
        </div>
        <div className="card-elevated p-8">
          <div className="space-y-3">
            <Link
              href="https://console.lifeguard.example.com"
              className="btn btn-primary btn-lg w-full"
            >
              Continue with SSO
            </Link>
            <Link
              href="https://console.lifeguard.example.com?email="
              className="btn btn-ghost btn-lg w-full"
            >
              Email me a magic link
            </Link>
          </div>
          <div
            className="mt-6 pt-6 border-t text-center text-[13px]"
            style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
          >
            Don&rsquo;t have an account?{" "}
            <Link href="/signup" style={{ color: "var(--color-blue)", fontWeight: 510 }}>
              Create one
            </Link>
            .
          </div>
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