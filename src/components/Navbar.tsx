
"use client";

import "@/styles/navbar.css";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  ArrowUpRight,
  CalendarDays,
  House,
  Images,
  Info,
  Leaf,
  Mail,
} from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/events", label: "Upcoming Events", Icon: CalendarDays },
  { href: "/#about", label: "About Us", Icon: Info },
  { href: "/#gallery", label: "Gallery", Icon: Images },
  { href: "/#contact", label: "Contact", Icon: Mail },
];

const NAV_DELAY = 500;

function getTabFromUrl(pathname: string, hash: string) {
  if (pathname.startsWith("/events")) return 1;

  if (pathname === "/") {
    if (hash === "#about") return 2;
    if (hash === "#gallery") return 3;
    if (hash === "#contact") return 4;
    return 0;
  }

  return -1;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [active, setActive] = useState(() => getTabFromUrl(pathname, ""));
  const [scrolled, setScrolled] = useState(false);
  const [instant, setInstant] = useState(true);

  const pendingRef = useRef<number | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTab = useRef(Math.max(active, 0));

  useEffect(() => {
    if (active >= 0) lastTab.current = active;
  }, [active]);

  const shown = active >= 0 ? active : lastTab.current;

  useEffect(() => {
    const t = setTimeout(() => setInstant(false), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const sync = () => {
      const idx = getTabFromUrl(
        window.location.pathname,
        window.location.hash
      );

      if (pendingRef.current !== null) {
        if (idx === pendingRef.current) pendingRef.current = null;
        return;
      }

      setActive(idx);
    };

    sync();

    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);

    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 40 : y > 80));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (navTimer.current) clearTimeout(navTimer.current);
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
    };
  }, []);

  const handleNav = (
    e: MouseEvent<HTMLAnchorElement>,
    index: number,
    href: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    e.preventDefault();

    const [rawPath, hash] = href.split("#");
    const targetPath = rawPath || "/";
    const samePage = targetPath === window.location.pathname;

    if (navTimer.current) clearTimeout(navTimer.current);

    setActive(index);

    if (samePage) {
      if (hash) {
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      const current = window.location.pathname + window.location.hash;
      const next = hash ? `${targetPath}#${hash}` : targetPath;
      if (current !== next) window.history.pushState(null, "", href);
      return;
    }

    pendingRef.current = index;
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    pendingTimer.current = setTimeout(() => {
      pendingRef.current = null;
    }, 4000);

    navTimer.current = setTimeout(() => router.push(href), NAV_DELAY);
  };

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <header className="rbd-header">
      <nav
        className="rbd-nav"
        aria-label="Main"
        data-scrolled={scrolled}
        data-instant={instant}
        data-none={active < 0}
        style={{ "--rbd-i": shown } as CSSProperties}
      >
        <div className="rbd-bg" aria-hidden="true">
          <div className="rbd-bg-left" />

          <div className="rbd-bg-tile">
            <svg viewBox="0 0 92 44" width="92" height="44">
              <path d="M0 0 C14 0 18 42 46 42 C74 42 78 0 92 0 V44 H0 Z" />
            </svg>
            <div className="rbd-bg-fill" />
          </div>

          <div className="rbd-bg-right" />
        </div>

        <Link
          href="/"
          className="rbd-brand"
          aria-label="rooted.BD home"
          onClick={(e) => handleNav(e, 0, "/")}
        >
          <span className="rbd-brand-icon">
            <Leaf size={22} />
          </span>

          <span className="rbd-brand-text">
            rooted<span className="rbd-brand-hl">.</span>
            <small>BD</small>
          </span>
        </Link>

        <div className="rbd-tabs">
          {TABS.map(({ href, label, Icon }, index) => (
            <Link
              key={href}
              href={href}
              className="rbd-tab"
              aria-current={active === index ? "page" : undefined}
              onClick={(e) => handleNav(e, index, href)}
            >
              <span className="rbd-tab-icon">
                <Icon size={22} />
              </span>
              <span className="rbd-tab-label">{label}</span>
            </Link>
          ))}
        </div>

        <div className="rbd-login-wrap">
          <Link
            href="/login"
            className="rbd-login"
            onClick={(e) => handleNav(e, -1, "/login")}
          >
            Login
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="rbd-bubble" aria-hidden="true">
          {TABS.map(({ href, Icon }, index) => (
            <Icon
              key={href}
              size={24}
              className={index === shown ? "is-on" : undefined}
            />
          ))}
        </div>
      </nav>
    </header>
  );
}