"use client";

import "@/styles/navbar.css";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  ArrowUpRight,
  House,
  CalendarDays,
  Info,
  Images,
  Mail,
  Leaf,
} from "lucide-react";

const links = [
  { href: "/", label: "Home", Icon: House },
  { href: "/events", label: "Upcoming Events", Icon: CalendarDays },
  { href: "/#about", label: "About Us", Icon: Info },
  { href: "/#gallery", label: "Gallery", Icon: Images },
  { href: "/#contact", label: "Contact", Icon: Mail },
];

// ব্যাজ ও notch স্লাইডের সময় (ms)
const SLIDE_DURATION = 800;

// অন্য পেজে যাওয়ার আগে অ্যানিমেশনকে এতটুকু সময় দেওয়া হয় (ms)
const NAV_DELAY = 350;

// Navbar নতুন করে তৈরি হলেও যেন আগের position মনে থাকে
const persist: { cx: number | null; index: number } = { cx: null, index: -2 };

type Geometry = {
  width: number;
  height: number;
  radius: number;
  badgeR: number;
  badgeCy: number;
};

// URL থেকে বের করা হয় কোন ট্যাব active (-1 = কোনোটাই না)
function getIndexFromLocation(pathname: string, hash: string) {
  if (pathname.startsWith("/events")) return 1;

  if (pathname === "/") {
    if (hash === "#about") return 2;
    if (hash === "#gallery") return 3;
    if (hash === "#contact") return 4;
    return 0;
  }

  return -1;
}

// হালকা overshoot সহ smooth slide
const easeOutBack = (t: number) => {
  const c1 = 0.6;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

// =========================================
// NAVBAR OUTLINE (with curved notch)
// =========================================

function buildNavPath(g: Geometry, cx: number | null) {
  const { width: W, height: H, radius: R } = g;
  const f = (n: number) => n.toFixed(1);

  const parts: string[] = [`M ${f(R)} 0`];

  if (cx !== null) {
    const r = g.badgeR;
    const w = r + 22;
    const depth = Math.min(g.badgeCy + r + 3, H - 14);
    const a = clamp(cx - w, R, W - R);
    const b = clamp(cx + w, R, W - R);

    parts.push(
      `H ${f(a)}`,
      `C ${f(a + (cx - a) * 0.5)} 0, ${f(cx - r * 1.3)} ${f(depth)}, ${f(cx)} ${f(depth)}`,
      `C ${f(cx + r * 1.3)} ${f(depth)}, ${f(b - (b - cx) * 0.5)} 0, ${f(b)} 0`
    );
  }

  parts.push(
    `H ${f(W - R)}`,
    `A ${f(R)} ${f(R)} 0 0 1 ${f(W)} ${f(R)}`,
    `V ${f(H - R)}`,
    `A ${f(R)} ${f(R)} 0 0 1 ${f(W - R)} ${f(H)}`,
    `H ${f(R)}`,
    `A ${f(R)} ${f(R)} 0 0 1 0 ${f(H - R)}`,
    `V ${f(R)}`,
    `A ${f(R)} ${f(R)} 0 0 1 ${f(R)} 0`,
    "Z"
  );

  return parts.join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(() =>
    getIndexFromLocation(pathname, "")
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [ready, setReady] = useState(persist.cx !== null);
  const [pop, setPop] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const geoRef = useRef<Geometry | null>(null);
  const cxRef = useRef<number | null>(persist.cx);
  const rafRef = useRef<number | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<number | null>(null);
  const activeRef = useRef(activeIndex);
  const prevActiveRef = useRef(persist.index);
  const userClickRef = useRef(false);

  activeRef.current = activeIndex;

  // =========================================
  // HELPERS
  // =========================================

  const stopTween = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // ট্যাবের center X (navbar-এর বাম পাশ থেকে), live position
  const getTargetX = useCallback((index: number) => {
    const nav = navRef.current;
    const link = linkRefs.current[index];
    if (!nav || !link) return null;

    const n = nav.getBoundingClientRect();
    const l = link.getBoundingClientRect();
    return l.left - n.left + l.width / 2;
  }, []);

  // সরাসরি DOM update (React re-render ছাড়া)
  const paint = useCallback(() => {
    const geo = geoRef.current;
    const cx = cxRef.current;
    if (!geo) return;

    const showNotch = activeRef.current >= 0 && cx !== null;
    const d = buildNavPath(geo, showNotch ? cx : null);

    if (bgRef.current) bgRef.current.style.clipPath = `path('${d}')`;
    if (pathRef.current) pathRef.current.setAttribute("d", d);

    if (badgeRef.current && cx !== null) {
      badgeRef.current.style.setProperty("--cx", `${cx}px`);
      persist.cx = cx;
    }
  }, []);

  const animateTo = useCallback(
    (index: number) => {
      stopTween();

      const first = getTargetX(index);
      if (first === null) return;

      const from = cxRef.current ?? first;
      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min((now - start) / SLIDE_DURATION, 1);

        // প্রতি ফ্রেমে ট্যাবের live position, তাই scroll/shrink-এর সাথেও মিলে থাকে
        const target = getTargetX(index);
        if (target === null) {
          rafRef.current = null;
          return;
        }

        cxRef.current =
          t >= 1 ? target : from + (target - from) * easeOutBack(t);

        paint();

        rafRef.current = t < 1 ? requestAnimationFrame(step) : null;
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [getTargetX, paint, stopTween]
  );

  // =========================================
  // URL থেকে active ট্যাব সিঙ্ক (অ্যানিমেশন ছাড়া)
  // =========================================

  useEffect(() => {
    const syncActiveLink = () => {
      const idx = getIndexFromLocation(pathname, window.location.hash);

      // ক্লিক করা ট্যাবে পেজ পৌঁছানোর আগে URL সিঙ্ক ট্যাব বদলাতে পারবে না
      if (pendingRef.current !== null) {
        if (idx === pendingRef.current) pendingRef.current = null;
        return;
      }

      if (idx !== activeRef.current) {
        userClickRef.current = false;
        setActiveIndex(idx);
      }
    };

    syncActiveLink();

    window.addEventListener("hashchange", syncActiveLink);
    return () => window.removeEventListener("hashchange", syncActiveLink);
  }, [pathname]);

  // =========================================
  // SCROLL (navbar হালকা শ্রিঙ্ক হয়)
  // =========================================

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // =========================================
  // MEASURE NAVBAR (resize / শ্রিঙ্ক / font load)
  // =========================================

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    const badge = badgeRef.current;
    const badgeSize = badge ? badge.offsetWidth : 54;
    const badgeTop = badge ? parseFloat(getComputedStyle(badge).top) || -17 : -17;
    const radius = Math.min(
      parseFloat(getComputedStyle(nav).borderTopLeftRadius) || 28,
      nav.offsetHeight / 2
    );

    geoRef.current = {
      width: nav.offsetWidth,
      height: nav.offsetHeight,
      radius,
      badgeR: badgeSize / 2,
      badgeCy: badgeTop + badgeSize / 2,
    };

    // স্লাইড চলছে না হলে, নতুন size অনুযায়ী position ঠিক করো (অ্যানিমেশন ছাড়া)
    if (rafRef.current === null && activeRef.current >= 0) {
      const target = getTargetX(activeRef.current);
      if (target !== null) cxRef.current = target;
    }

    paint();
    setReady(true);
  }, [getTargetX, paint]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    if (badgeRef.current) ro.observe(badgeRef.current);

    measure();
    document.fonts?.ready.then(measure);

    return () => {
      ro.disconnect();
      stopTween();
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    };
  }, [measure, stopTween]);

  // =========================================
  // NOTCH + BADGE SLIDE
  // শুধু ইউজার ক্লিক করলে অ্যানিমেশন, বাকি সব ক্ষেত্রে সরাসরি বসে
  // =========================================

  useEffect(() => {
    const prev = prevActiveRef.current;
    const byClick = userClickRef.current;

    prevActiveRef.current = activeIndex;
    userClickRef.current = false;
    persist.index = activeIndex;

    if (activeIndex < 0) {
      stopTween();
      paint();
      return;
    }

    // একই ট্যাব, ক্লিক নয়: চলমান অ্যানিমেশন থামাবে না
    if (prev === activeIndex && !byClick && rafRef.current !== null) return;

    const target = getTargetX(activeIndex);
    if (target === null) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const shouldAnimate =
      byClick &&
      !reduce &&
      cxRef.current !== null &&
      prev >= 0 &&
      prev !== activeIndex;

    if (!shouldAnimate) {
      stopTween();
      cxRef.current = target;
      paint();
      return;
    }

    animateTo(activeIndex);
  }, [activeIndex, animateTo, getTargetX, paint, stopTween]);

  // =========================================
  // NAVIGATION CLICK
  // =========================================

  const handleClick = (
    e: MouseEvent<HTMLAnchorElement>,
    index: number,
    href: string
  ) => {
    // new tab / modifier key হলে browser-এর default কাজ করতে দাও
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    e.preventDefault();

    const [rawPath, hash] = href.split("#");
    const targetPath = rawPath || "/";
    const alreadyActive = index === activeRef.current;

    // একই ট্যাবে আবার ক্লিক: অ্যানিমেশন নেই, শুধু scroll
    if (alreadyActive && targetPath !== pathname) return;

    if (navTimerRef.current) clearTimeout(navTimerRef.current);

    if (!alreadyActive) {
      userClickRef.current = true;
      setPop(true);
      setActiveIndex(index);
    }

    // একই পেজ: smooth scroll (পেজ বদলায় না, তাই delay লাগে না)
    if (targetPath === pathname) {
      if (hash) {
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      window.history.pushState(null, "", href);
      return;
    }

    // অন্য পেজ: ক্লিক করা ট্যাব "pending" রাখো, যেন URL সিঙ্ক এটা বদলাতে না পারে
    pendingRef.current = index;
    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    pendingTimerRef.current = setTimeout(() => {
      pendingRef.current = null;
    }, 3000);

    // আগে অ্যানিমেশন চলতে দাও, তারপর পেজ বদলাও
    navTimerRef.current = setTimeout(() => router.push(href), NAV_DELAY);
  };

  const ActiveIcon = links[Math.max(activeIndex, 0)].Icon;
  const badgeHidden = !ready || activeIndex < 0;

  // =========================================
  // RENDER NAVBAR
  // =========================================

  return (
    <header className={`rbd-header ${isScrolled ? "rbd-scrolled" : ""}`}>
      <nav className="curved-navbar" ref={navRef}>

        {/* BACKGROUND (notch সহ কাটা, JS থেকে update হয়) */}

        <div className="nav-bg" ref={bgRef} aria-hidden="true" />

        {/* BORDER OUTLINE */}

        <svg className="notch-svg" aria-hidden="true">
          <path ref={pathRef} />
        </svg>

        {/* BRAND */}

        <Link
          href="/"
          className="brand"
          onClick={(e) => handleClick(e, 0, "/")}
        >
          <span className="brand-icon">
            <Leaf size={22} />
          </span>

          <span>
            rooted<span className="brand-highlight">.</span>
            <small>BD</small>
          </span>
        </Link>

        {/* FLOATING ACTIVE BADGE */}

        <div
          ref={badgeRef}
          className={`active-badge ${badgeHidden ? "is-hidden" : ""} ${
            pop ? "pop" : ""
          }`}
        >
          <ActiveIcon key={activeIndex} size={24} />
        </div>

        {/* NAVIGATION LINKS */}

        <div className="nav-links">
          {links.map(({ href, label, Icon }, index) => (
            <Link
              key={href}
              href={href}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              className={`nav-item ${activeIndex === index ? "active" : ""}`}
              onClick={(e) => handleClick(e, index, href)}
              aria-current={activeIndex === index ? "page" : undefined}
            >
              <Icon className="nav-icon" size={22} />

              <span className="nav-label">{label}</span>
            </Link>
          ))}
        </div>

        {/* LOGIN BUTTON */}

        <Link
          href="/login"
          className="nav-cta"
          onClick={(e) => handleClick(e, -1, "/login")}
        >
          Login
          <ArrowUpRight size={16} />
        </Link>

      </nav>
    </header>
  );
}