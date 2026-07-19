"use client";

/**
 * CountrySelect — interactive country selector used in the footer.
 * Extracted into its own client component so Footer can remain a server
 * component. Routing: ZA → /care/dashboard; others → /care/dashboard?locale=xx
 */

export function CountrySelect() {
  const countries = [
    { code: "ZA", name: "South Africa" },
    { code: "GB", name: "United Kingdom" },
    { code: "NL", name: "Netherlands" },
    { code: "AU", name: "Australia" },
  ];

  return (
    <label
      className="inline-flex items-center gap-2 text-[13px]"
      style={{ color: "rgba(255,255,255,0.8)" }}
    >
      <span className="sr-only">Country</span>
      <select
        aria-label="Country selector"
        defaultValue="ZA"
        onChange={(e) => {
          const v = e.target.value;
          if (v === "ZA") window.location.href = "/care/dashboard";
          else if (v === "GB") window.location.href = "/care/dashboard?locale=uk";
          else if (v === "NL") window.location.href = "/care/dashboard?locale=nl";
          else if (v === "AU") window.location.href = "/care/dashboard?locale=au";
        }}
        className="rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-red)] cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code} style={{ color: "#0a0a0a" }}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}