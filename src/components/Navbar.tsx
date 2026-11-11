"use client";

import "@/styles/navbar.css";

import { useCallback, useEffect, useRef, useState } from "react";
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
  type LucideIcon,
} from "lucide-react";

import LanguageToggle from "@/components/LanguageToggle";
import { useLang } from "@/components/LanguageProvider";
import ProfileDropdown from "@/components/ProfileDropdown";
import { authClient } from "@/lib/auth-client";
import { getMyProfile } from "@/services/profileApi";
import type { TKey } from "@/lib/i18n";

const TABS: { href: string; key: TKey; Icon: LucideIcon }[] = [
  { href: "/", key: "nav_home", Icon: House },
  { href: "/events", key: "nav_events", Icon: CalendarDays },
  { href: "/#about", key: "nav_about", Icon: Info },
  { href: "/#gallery", key: "nav_gallery", Icon: Images },
  { href: "/#contact", key: "nav_contact", Icon: Mail },
];

const NAV_DELAY = 500;

// Smooth scroll settings
const SCROLL_OFFSET = 90;
const SCROLL_DURATION = 600;

// Scroll-spy settings
// পেজে section-গুলো যে ক্রমে আছে, এখানেও সেই ক্রমে লিখতে হবে।
// Hero → categories → about → (process) → events → gallery → (cta) → contact
const SPY_SECTIONS: { id: string; index: number }[] = [
  { id: "categories", index: 1 },
  { id: "about", index: 2 },
  { id: "events", index: 1 },
  { id: "gallery", index: 3 },
  { id: "contact", index: 4 },
];
// স্ক্রিনের উপর থেকে কত অংশে (০ থেকে ১) "active লাইন" থাকবে
const SPY_LINE = 0.35;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// onEnd সবসময় ডাক পড়বে: scroll শেষ হলে, interrupt হলে, বা দরকার না হলে
function smoothScrollTo(
  targetY: number,
  rafRef: { current: number | null },
  onEnd?: () => void
) {
  if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

  const root = document.documentElement;

  const maxY = root.scrollHeight - window.innerHeight;
  const endY = Math.max(0, Math.min(targetY, maxY));
  const startY = window.scrollY;
  const distance = endY - startY;

  if (Math.abs(distance) < 2) {
    onEnd?.();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, endY);
    onEnd?.();
    return;
  }

  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  const startTime = performance.now();

  const finish = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    root.style.scrollBehavior = previousBehavior;
    window.removeEventListener("wheel", finish);
    window.removeEventListener("touchstart", finish);
    onEnd?.();
  };

  window.addEventListener("wheel", finish, { passive: true });
  window.addEventListener("touchstart", finish, { passive: true });

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);

    window.scrollTo(0, startY + distance * easeOutCubic(progress));

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      finish();
    }
  };

  rafRef.current = requestAnimationFrame(step);
}

type SessionUser = {
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
};

function getTabFromUrl(pathname: string, hash: string) {
  if (pathname.startsWith("/events")) return 1;

  if (pathname === "/") {
    if (hash === "#categories") return 1;
    if (hash === "#events") return 1;
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
  const { t } = useLang();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;
  const userEmail = user?.email;

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [active, setActive] = useState(() => getTabFromUrl(pathname, ""));
  const [scrolled, setScrolled] = useState(false);
  const [instant, setInstant] = useState(true);

  const pendingRef = useRef<number | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // smooth scroll চলার সময় true: তখন scroll-spy active tab বদলায় না
  const spyLocked = useRef(false);
  // অন্য পেজ থেকে /#section-এ আসার সময় কোন section-এ যেতে হবে
  const arrivalHash = useRef<string | null>(null);
  const lastTab = useRef(Math.max(active, 0));
  const scrollRaf = useRef<number | null>(null);

  useEffect(() => {
    if (active >= 0) lastTab.current = active;
  }, [active]);

  const shown = active >= 0 ? active : lastTab.current;

  // id দিলে সেই section-এ, null দিলে একদম উপরে smooth scroll
  const scrollToId = useCallback((id: string | null) => {
    spyLocked.current = true;

    const el = id ? document.getElementById(id) : null;
    const top = el
      ? el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
      : 0;

    smoothScrollTo(top, scrollRaf, () => {
      spyLocked.current = false;
      // scroll শেষ: spy একবার ঠিক করে নেবে
      window.dispatchEvent(new Event("scroll"));
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setInstant(false), 80);
    return () => clearTimeout(timer);
  }, []);

  // প্রোফাইল ছবি আনা (MongoDB থেকে) + "profile-updated" ইভেন্টে আবার আনা
  useEffect(() => {
    if (!userEmail) {
      setProfileImage(null);
      return;
    }

    let cancelled = false;

    const loadProfileImage = async () => {
      try {
        const profile = await getMyProfile();
        if (!cancelled) setProfileImage(profile.image ?? null);
      } catch {
        // ছবি না এলে সেশনের ছবি/নামের প্রথম অক্ষরই দেখাবে
      }
    };

    loadProfileImage();
    window.addEventListener("profile-updated", loadProfileImage);

    return () => {
      cancelled = true;
      window.removeEventListener("profile-updated", loadProfileImage);
    };
  }, [userEmail]);

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

  // ---------- Scroll-spy: স্ক্রল করলে active tab নিজে থেকে বদলাবে ----------
  useEffect(() => {
    if (pathname !== "/") return;

    let raf: number | null = null;
    let arrivalTimer: ReturnType<typeof setTimeout> | null = null;

    const compute = () => {
      raf = null;

      // Navbar button চাপার পর smooth scroll চলার সময় spy বন্ধ
      if (spyLocked.current) return;
      // অন্য পেজে যাওয়ার সময়ও বন্ধ
      if (pendingRef.current !== null) return;

      const line = window.innerHeight * SPY_LINE;

      let next = 0; // ডিফল্ট: Home
      let lastExisting = 0;

      for (const { id, index } of SPY_SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;

        lastExisting = index;
        if (el.getBoundingClientRect().top <= line) next = index;
      }

      // পেজের একদম নিচে পৌঁছালে শেষ section active
      const atBottom =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 4;

      if (atBottom && lastExisting > 0) next = lastExisting;

      setActive((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(compute);
    };

    const arrivalId = arrivalHash.current;

    if (arrivalId) {
      // অন্য পেজ থেকে এসেছি: spy বন্ধ রেখে পেজ বসার পর smooth scroll
      spyLocked.current = true;
      arrivalTimer = setTimeout(() => {
        arrivalHash.current = null;
        scrollToId(arrivalId);
      }, 80);
    } else {
      spyLocked.current = false;
      compute();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf !== null) cancelAnimationFrame(raf);
      if (arrivalTimer) clearTimeout(arrivalTimer);
    };
  }, [pathname, scrollToId]);

  useEffect(() => {
    return () => {
      if (navTimer.current) clearTimeout(navTimer.current);
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
      if (scrollRaf.current !== null) cancelAnimationFrame(scrollRaf.current);
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

    // bubble সাথে সাথে ক্লিক করা tab-এ slide শুরু করবে
    setActive(index);

    if (samePage) {
      // URL আগে বদলাও, তারপর স্ক্রল (যাতে স্ক্রল মাঝপথে না কাটে)
      const current = window.location.pathname + window.location.hash;
      const next = hash ? `${targetPath}#${hash}` : targetPath;
      if (current !== next) window.history.pushState(null, "", href);

      scrollToId(hash ?? null);
      return;
    }

    pendingRef.current = index;
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    pendingTimer.current = setTimeout(() => {
      pendingRef.current = null;
    }, 4000);

    // hash থাকলে Next-এর লাফ বন্ধ করো, পেজ লোড হলে আমরা নিজেরা smooth scroll করব
    if (hash) arrivalHash.current = hash;

    navTimer.current = setTimeout(
      () => router.push(href, hash ? { scroll: false } : undefined),
      NAV_DELAY
    );
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
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
          {TABS.map(({ href, key, Icon }, index) => (
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
              <span className="rbd-tab-label">{t(key)}</span>
            </Link>
          ))}
        </div>

        <div className="rbd-login-wrap">
          {isPending ? (
            <span className="rpd-skeleton" aria-hidden="true" />
          ) : user ? (
            <ProfileDropdown
              user={{
                name: user.name,
                email: user.email,
                image: profileImage ?? user.image,
              }}
              role={user.role}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <LanguageToggle inline />
              <Link
                href="/login"
                className="rbd-login"
                onClick={(e) => handleNav(e, -1, "/login")}
              >
                {t("nav_login")}
                <ArrowUpRight size={16} />
              </Link>
            </>
          )}
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