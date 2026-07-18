"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type ProductChild = {
  label: string;
  href: string;
  hint: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
};

const productsMenu: ProductChild[] = [
  { label: "LifeBand G2",     href: "/products#lifeband",    hint: "Wristband · LTE-M · 7 days", icon: IconBand },
  { label: "LifePendant P2",  href: "/products#lifependant", hint: "Pendant · 14 days standby",   icon: IconPendant },
  { label: "LifeClip CG2",    href: "/products#lifeclip",    hint: "Discreet clip · 3 days",       icon: IconClip },
  { label: "Operator Console",href: "/products#console",     hint: "Linear-class control room",    icon: IconConsole },
  { label: "Open API & SDK",  href: "/products#api",         hint: "REST · Webhooks · 6 languages", icon: IconApi },
  { label: "Integrations",    href: "/integration",          hint: "iOS · Watch · Android · SMS",   icon: IconWatch },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const productButtonRef = useRef<HTMLButtonElement>(null);
  const productPopRef = useRef<HTMLDivElement>(null);
  const mobileMenuId = useId();

  // Close product popover on outside-click + Escape.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (
        productPopRef.current?.contains(t) ||
        productButtonRef.current?.contains(t)
      ) return;
      setProductOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProductOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Lock body scroll when the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  // Close mobile drawer on route change (via window resize past mobile
  // breakpoint).
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b glass"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div className="container-x flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-10">
          <Link href="/" aria-label="LifeGuard home" className="flex items-center gap-2">
            <Logo />
            <span
              className="text-[15px] tracking-tight"
              style={{ color: "var(--color-ink)", fontWeight: 700 }}
            >
              LifeGuard
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            <DesktopProductMenu
              open={productOpen}
              onOpenChange={setProductOpen}
              buttonRef={productButtonRef}
              popRef={productPopRef}
            />
            <NavLink href="/for-whom">For whom</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/trust">Trust</NavLink>
            <NavLink href="/docs">Docs</NavLink>
          </nav>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link href="/signup" className="btn btn-red btn-sm">Get started</Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls={mobileMenuId}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden btn btn-ghost btn-sm"
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          {mobileOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 4h12M2 8h12M2 12h12"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer — slide in from right, full content */}
      <div
        id={mobileMenuId}
        hidden={!mobileOpen}
        className="md:hidden"
        style={{ borderTop: mobileOpen ? "1px solid rgba(0,0,0,0.06)" : "none" }}
      >
        {mobileOpen && (
          <div className="container-x py-5 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
            <MobileAccordion label="Product" defaultOpen>
              <div className="flex flex-col gap-1 pl-2 pb-2">
                {productsMenu.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[var(--color-bg-soft)]"
                  >
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md"
                      style={{ background: "var(--color-red-tint)", color: "var(--color-red)" }}
                    >
                      <p.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span
                        className="block text-[14px]"
                        style={{ color: "var(--color-ink)", fontWeight: 600 }}
                      >
                        {p.label}
                      </span>
                      <span
                        className="block text-[12px] mt-0.5"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {p.hint}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </MobileAccordion>
            <MobileLink href="/for-whom" onSelect={() => setMobileOpen(false)}>For whom</MobileLink>
            <MobileLink href="/pricing"  onSelect={() => setMobileOpen(false)}>Pricing</MobileLink>
            <MobileLink href="/trust"    onSelect={() => setMobileOpen(false)}>Trust</MobileLink>
            <MobileLink href="/docs"     onSelect={() => setMobileOpen(false)}>Docs</MobileLink>

            <div className="flex gap-2 pt-4 mt-3 border-t" style={{ borderColor: "var(--color-line)" }}>
              <Link href="/login"  className="btn btn-ghost flex-1" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link href="/signup" className="btn btn-red flex-1"  onClick={() => setMobileOpen(false)}>Get started</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------------- */
/* Desktop product menu — click-toggle, outside-click + Esc close, no hover  */
/* ------------------------------------------------------------------------- */

function DesktopProductMenu(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
  popRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const { open, onOpenChange, buttonRef, popRef } = props;
  const id = useId();

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => onOpenChange(!open)}
        className="px-3 h-9 inline-flex items-center gap-1 rounded-md text-[14px] hover:bg-[var(--color-bg-soft)]"
        style={{ color: "var(--color-ink)", fontWeight: 600 }}
      >
        Product
        <svg
          width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"
          style={{ transition: "transform 160ms ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={popRef}
        id={id}
        role="menu"
        aria-label="Product"
        data-state={open ? "open" : "closed"}
        className="nav-popover"
      >
        <div className="flex flex-col gap-1">
          {productsMenu.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              role="menuitem"
              onClick={() => onOpenChange(false)}
              className="group flex items-start gap-3 rounded-md p-3 hover:bg-[var(--color-bg-soft)]"
            >
              <span
                className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors"
                style={{
                  background: "var(--color-red-tint)",
                  color: "var(--color-red)",
                }}
              >
                <p.icon className="h-4 w-4" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span
                  className="text-[14px] group-hover:translate-x-0.5 transition-transform"
                  style={{ color: "var(--color-ink)", fontWeight: 600 }}
                >
                  {p.label}
                </span>
                <span
                  className="text-[12px]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {p.hint}
                </span>
              </span>
            </Link>
          ))}
        </div>
        <div
          className="mt-2 pt-3 px-3 border-t"
          style={{ borderColor: "var(--color-line-soft)" }}
        >
          <Link
            href="/products"
            onClick={() => onOpenChange(false)}
            className="text-[12px] inline-flex items-center gap-1"
            style={{ color: "var(--color-red)", fontWeight: 600 }}
          >
            See the full stack
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 5h6m0 0L5 2m3 3l-3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Smaller pieces                                                            */
/* ------------------------------------------------------------------------- */

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 h-9 inline-flex items-center rounded-md text-[14px] hover:bg-[var(--color-bg-soft)]"
      style={{ color: "var(--color-ink)", fontWeight: 600 }}
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
      style={{ color: "var(--color-ink)", fontWeight: 600 }}
    >
      {children}
    </Link>
  );
}

function MobileAccordion({
  label,
  defaultOpen,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-md">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-3 flex items-center justify-between rounded-md hover:bg-[var(--color-bg-soft)] text-[15px]"
        style={{ color: "var(--color-ink)", fontWeight: 600 }}
      >
        {label}
        <svg
          width="12" height="12" viewBox="0 0 10 10" aria-hidden="true"
          style={{ transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && children}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Brand logo — a small lifeguard tower badge, RED on white                   */
/* ------------------------------------------------------------------------- */

function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="lgShadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e11d2e" />
          <stop offset="1" stopColor="#8b0c14" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lgShadow)" />
      <path
        d="M16 7 L22 11 V16 C22 19.5 19 22 16 23 C13 22 10 19.5 10 16 V11 Z"
        fill="#ffffff"
      />
      <path d="M14 14 h4 v6 h-4 z M16 12.5 a1.2 1.2 0 1 1 0 2.4 a1.2 1.2 0 0 1 0 -2.4 z" fill="#e11d2e" />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* Inline icons used inside the menu                                          */
/* ------------------------------------------------------------------------- */

function IconBand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2.5" />
      <path d="M5 11h2M5 13h2M17 11h2M17 13h2" />
    </svg>
  );
}
function IconPendant(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v3" />
      <circle cx="12" cy="13" r="6" />
      <circle cx="12" cy="13" r="2.5" />
    </svg>
  );
}
function IconCard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
function IconClip(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8" y="6" width="8" height="13" rx="2" />
      <circle cx="12" cy="12.5" r="1.8" />
    </svg>
  );
}
function IconConsole(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10h2M7 14h6" />
    </svg>
  );
}
function IconApi(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8l-2 4 2 4M20 8l2 4-2 4M9 6l-2 12M15 6l2 12" />
    </svg>
  );
}

function IconWatch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
      <path d="M9 3h6l-1 3" />
      <path d="M9 21h6l-1-3" />
      <path d="M9 12h2l1-1 2 1 1-2" />
    </svg>
  );
}
