"use client";

import { useState } from "react";

export function SignupForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        className="card-elevated p-8 md:p-10"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, background: "var(--color-red-tint)" }}
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M5 9.3l2.6 2.6L13 6.5"
                stroke="var(--color-red-hover)"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <div className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 510 }}>
              You&rsquo;re on the list.
            </div>
            <div className="text-[13px]" style={{ color: "var(--color-body)" }}>
              We&rsquo;ll provision your tenant and email a sandbox API key within the
              next business day.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="card-elevated p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      aria-label="Create your LifeGuard account"
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" id="first" type="text" placeholder="Thandi" autoComplete="given-name" />
        <Field label="Last name" id="last" type="text" placeholder="Mokoena" autoComplete="family-name" />
      </div>
      <div className="mt-4">
        <Field
          label="Work email"
          id="email"
          type="email"
          placeholder="thandi@yourcompany.com"
          autoComplete="email"
        />
      </div>
      <div className="mt-4">
        <Field
          label="Company"
          id="company"
          type="text"
          placeholder="City Watch Cape Town"
          autoComplete="organization"
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
          defaultValue="reseller"
          className="w-full h-10 rounded-md border bg-white px-3 text-[14px]"
          style={{ borderColor: "var(--color-line)", color: "var(--color-ink)" }}
        >
          <option value="family">Family or individual</option>
          <option value="reseller">Security company or reseller</option>
          <option value="enterprise">Enterprise / lone-worker program</option>
          <option value="developer">Developer evaluating the API</option>
        </select>
      </div>
      <button type="submit" className="btn btn-red btn-lg w-full mt-6">
        Create my account
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
  placeholder,
  autoComplete,
}: {
  label: string;
  id: string;
  type: string;
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
        required
        className="w-full h-10 rounded-md border bg-white px-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-red)] focus:border-transparent"
        style={{ borderColor: "var(--color-line)", color: "var(--color-ink)" }}
      />
    </div>
  );
}