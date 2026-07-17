"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ProductChild = { label: string; href: string; hint: string };

const productsMenu: ProductChild[] = [
  { label: "LifeBand G2", href: "/products#lifeband", hint: "Wristband · LTE-M · 7 days" },
  { label: "LifePendant P2", href: "/products#lifependant", hint: "Pendant · 14 days standby" },
  { label: "LifeCard C2", href: "/products#lifecard", hint: "Wallet card · 6 mo coin cell" },
  { label: "LifeClip CG2", href: "/products#lifeclip", hint: "Discreet clip · 3 days" },
  { label: "Open API & SDK", href: "/products#api", hint: "REST · Webhooks · 6 languages" },
  { label: "Operator Console", href: "/products#console", hint: "Linear-class control room" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setProductOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setProductOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        background: "rgba(255,255,255,0.78)",
        borderColor: "var(--color-line)",
      }}
    >
      <div className="container-x flex items-center justify-between h-14">
        <div className="flex items-center gap-8" ref={wrapRef}>
          <Link href="/" aria-label="LifeGuard home" className="flex items-center gap-2">
            <Logo />
            <span
              className="text-[15px] tracking-tight"
              style={{ color: "var(--color-ink)", fontWeight: 510 }}
            >
              LifeGuard
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            <div
              className="relative"
              onMouseEnter={() => setProductOpen(true)}
              onMouseLeave={() => setProductOpen(false)}
            >
              <button
                type="button"
                aria-expanded={productOpen}
                aria-haspopup="true"
                onClick={() => setProductOpen((v) => !v)}
                className="px-3 h-9 inline-flex items-center gap-1 rounded-md text-[14px] hover:bg-[var(--color-bg-soft)]"
                style={{ color: "var(--color-ink)", fontWeight: 510 }}
              >
                Product
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
              {productOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full pt-2 w-[420px]"
                >
                  <div className="card-elevated p-2 grid grid-cols-2 gap-1">
                    {productsMenu.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        role="menuitem"
                        onClick={() => setProductOpen(false)}
                        className="rounded-md p-3 hover:bg-[var(--color-bg-soft)]"
                      >
                        <div
                          className="text-[14px]"
                          style={{ color: "var(--color-ink)", fontWeight: 510 }}
                        >
                          {p.label}
                        </div>
                        <div className="text-[12px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                          {p.hint}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <NavLink href="/for-whom">For whom</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/trust">Trust</NavLink>
            <NavLink href="/docs">Docs</NavLink>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden btn btn-ghost btn-sm"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t" style={{ borderColor: "var(--color-line)" }}>
          <div className="container-x py-4 flex flex-col gap-1">
            <MobileLink href="/products" onSelect={() => setOpen(false)}>
              Product
            </MobileLink>
            <MobileLink href="/for-whom" onSelect={() => setOpen(false)}>
              For whom
            </MobileLink>
            <MobileLink href="/pricing" onSelect={() => setOpen(false)}>
              Pricing
            </MobileLink>
            <MobileLink href="/trust" onSelect={() => setOpen(false)}>
              Trust
            </MobileLink>
            <MobileLink href="/docs" onSelect={() => setOpen(false)}>
              Docs
            </MobileLink>
            <div className="flex gap-2 pt-3 mt-2 border-t" style={{ borderColor: "var(--color-line)" }}>
              <Link href="/login" className="btn btn-ghost flex-1" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary flex-1" onClick={() => setOpen(false)}>
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 h-9 inline-flex items-center rounded-md text-[14px] hover:bg-[var(--color-bg-soft)]"
      style={{ color: "var(--color-ink)", fontWeight: 510 }}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onSelect,
  children,
}: {
  href: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className="px-3 py-3 rounded-md hover:bg-[var(--color-bg-soft)] text-[15px]"
      style={{ color: "var(--color-ink)", fontWeight: 510 }}
    >
      {children}
    </Link>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0a1628" />
      <circle cx="16" cy="16" r="6.5" fill="none" stroke="#06b6a4" strokeWidth="2" />
      <circle cx="16" cy="16" r="2" fill="#06b6a4" />
    </svg>
  );
}