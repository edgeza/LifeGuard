"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * SignupForm — actual account creation that POSTs to
 * /api/care/auth/signup. Replaces the old decorative form
 * that just set a `submitted` flag and showed "You're on
 * the list." without doing anything.
 *
 * Required: name, email, password (min 8 chars), tenant name.
 * Creates a new tenant + admin user, sets session cookie,
 * redirects to /care/dashboard.
 */
export function SignupForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    tenantName: "",
    use: "reseller",
  });

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/care/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim(),
          tenantName: form.tenantName.trim() || `${form.name.split(" ")[0]}'s tenant`,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Sign-up failed (${res.status})`);
        return;
      }
      router.push("/care/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="card-elevated p-6 md:p-8"
      onSubmit={onSubmit}
      aria-label="Create your LifeGuard account"
    >
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Your name"
          id="name"
          type="text"
          value={form.name}
          onChange={setField("name")}
          placeholder="Thandi Mokoena"
          autoComplete="name"
        />
        <Field
          label="Tenant name"
          id="tenantName"
          type="text"
          value={form.tenantName}
          onChange={setField("tenantName")}
          placeholder="City Watch Cape Town"
          autoComplete="organization"
        />
      </div>
      <div className="mt-4">
        <Field
          label="Work email"
          id="email"
          type="email"
          value={form.email}
          onChange={setField("email")}
          placeholder="thandi@yourcompany.com"
          autoComplete="email"
        />
      </div>
      <div className="mt-4">
        <Field
          label="Password (min 8 chars)"
          id="password"
          type="password"
          value={form.password}
          onChange={setField("password")}
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>
      <div className="mt-4">
        <label
          className="block text-[13px] mb-1.5"
          htmlFor="use"
          style={{ color: "var(--color-ink)", fontWeight: 510 }}
        >
          I am signing up as a&hellip;
        </label>
        <select
          id="use"
          name="use"
          value={form.use}
          onChange={setField("use")}
          className="w-full h-10 rounded-md border bg-white px-3 text-[14px]"
          style={{ borderColor: "var(--color-line)", color: "var(--color-ink)" }}
        >
          <option value="family">Family or individual</option>
          <option value="reseller">Security company or reseller</option>
          <option value="enterprise">Enterprise / lone-worker program</option>
          <option value="developer">Developer evaluating the API</option>
        </select>
      </div>

      {error && (
        <div
          className="mt-4 text-[13px] px-3 py-2 rounded-md"
          style={{
            background: "rgba(225,29,46,0.08)",
            border: "1px solid rgba(225,29,46,0.30)",
            color: "var(--color-red)",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={busy || !form.email || !form.password || form.password.length < 8 || !form.name}
        className="btn btn-red btn-lg w-full mt-6 disabled:opacity-40"
        style={{ opacity: busy ? 0.5 : 1 }}
      >
        {busy ? "Creating account…" : "Create my account"}
      </button>
      <p className="mt-4 text-[12px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
        By creating an account you agree to our terms of service and data
        processing agreement. We never share your details. Cancel any time
        before your first device ships.
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[13px] mb-1.5"
        style={{ color: "var(--color-ink)", fontWeight: 510 }}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required
        minLength={type === "password" ? 8 : undefined}
        className="w-full h-10 rounded-md border bg-white px-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-red)] focus:border-transparent"
        style={{ borderColor: "var(--color-line)", color: "var(--color-ink)" }}
      />
    </div>
  );
}