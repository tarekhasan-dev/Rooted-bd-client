
"use client";

import "@/styles/profile-dropdown.css";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  Activity,
  Bookmark,
  BookOpen,
  CircleCheck,
  CirclePlus,
  Globe,
  LifeBuoy,
  LogOut,
  Palette,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  User,
  type LucideIcon,
} from "lucide-react";

import { useLang } from "@/components/LanguageProvider";
import ThemeSwitcher, { type ThemeMode } from "@/components/ThemeSwitcher";
import type { TKey } from "@/lib/i18n";

export type UserRole =
  | "user"
  | "organizer"
  | "admin"
  | "super_admin";

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  role?: string | null;
  onLogout: () => void | Promise<void>;
}

type Item = {
  href: string;
  Icon: LucideIcon;
  tone: string;
  label: TKey;
  sub?: TKey;
};

const ACCOUNT_ITEMS: Item[] = [
  {
    href: "/my-profile",
    Icon: User,
    tone: "green",
    label: "dd_profile",
    sub: "dd_profile_sub",
  },
  {
    href: "/saved-events",
    Icon: Bookmark,
    tone: "gold",
    label: "dd_saved",
    sub: "dd_saved_sub",
  },
  {
    href: "/my-activity",
    Icon: Activity,
    tone: "teal",
    label: "dd_activity",
    sub: "dd_activity_sub",
  },
  {
    href: "/settings",
    Icon: Settings,
    tone: "slate",
    label: "dd_settings",
    sub: "dd_settings_sub",
  },
];

const CREATE_ITEM: Item = {
  href: "/create-event",
  Icon: CirclePlus,
  tone: "green",
  label: "dd_create",
};

const JOINED_ITEM: Item = {
  href: "/my-events",
  Icon: CircleCheck,
  tone: "teal",
  label: "dd_joined",
};

const MANAGE_ITEM: Item = {
  href: "/manage-events",
  Icon: SlidersHorizontal,
  tone: "gold",
  label: "dd_manage",
};

const ADMIN_ITEM: Item = {
  href: "/admin",
  Icon: ShieldCheck,
  tone: "rose",
  label: "dd_admin",
};

const HELP_ITEMS: Item[] = [
  {
    href: "/documentation",
    Icon: BookOpen,
    tone: "blue",
    label: "dd_docs",
  },
  {
    href: "/support",
    Icon: LifeBuoy,
    tone: "green",
    label: "dd_support",
  },
];

/* Avatar Component */

function Avatar({
  name,
  image,
  size,
}: {
  name: string;
  image?: string | null;
  size: "md" | "lg";
}) {
  const initial = name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <span className={`rpd-avatar rpd-avatar-${size}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span>{initial}</span>
      )}
    </span>
  );
}

/* Section Title */

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="rpd-section">{children}</p>;
}

/* Menu Link */

function MenuLink({
  item,
  onClick,
}: {
  item: Item;
  onClick: () => void;
}) {
  const { t } = useLang();
  const { Icon } = item;

  return (
    <Link
      href={item.href}
      className="rpd-item"
      role="menuitem"
      onClick={onClick}
    >
      <span className={`rpd-ico tone-${item.tone}`}>
        <Icon size={17} />
      </span>

      <span className="rpd-item-text">
        <span className="rpd-item-title">
          {t(item.label)}
        </span>

        {item.sub && (
          <span className="rpd-item-sub">
            {t(item.sub)}
          </span>
        )}
      </span>
    </Link>
  );
}

/* Main Profile Dropdown */

export default function ProfileDropdown({
  user,
  role,
  onLogout,
}: ProfileDropdownProps) {
  const { t, lang, setLang } = useLang();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("system");

  const rootRef = useRef<HTMLDivElement>(null);

  // Normalize role
  const roles = String(role ?? "user")
    .split(",")
    .map((r) => r.trim().toLowerCase());

  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuperAdmin;
  const isOrganizer = roles.includes("organizer");

  const canManage = isAdmin || isOrganizer;

  // Display role
  const roleLabel = isSuperAdmin
    ? "Super Admin"
    : isAdmin
      ? "Admin"
      : isOrganizer
        ? "Organizer"
        : "Member";

  const roleKey: TKey | null = isSuperAdmin
    ? null
    : isAdmin
      ? "role_admin"
      : isOrganizer
        ? "role_organizer"
        : "role_user";

  const eventItems: Item[] = [
    ...(canManage ? [CREATE_ITEM] : []),
    JOINED_ITEM,
    ...(canManage ? [MANAGE_ITEM] : []),
  ];

  // Load saved theme
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rooted-theme");

      if (
        saved === "light" ||
        saved === "dark" ||
        saved === "system"
      ) {
        setTheme(saved);
      }
    } catch {}
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: globalThis.MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  // Theme change
  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);

    try {
      localStorage.setItem("rooted-theme", mode);
    } catch {}

    const dark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.dataset.theme = dark
      ? "dark"
      : "light";
  };

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      close();

      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="rpd" ref={rootRef}>
      {/* Navbar Profile Button */}

      <button
        type="button"
        className="rpd-trigger"
        data-open={open}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("dd_aria")}
        title={`${user.name} (${user.email})`}
      >
        <Avatar
          name={user.name}
          image={user.image}
          size="md"
        />

        <span className="rpd-trigger-text">
          <span className="rpd-trigger-name">
            {user.name}
          </span>

          <span className="rpd-trigger-email">
            {user.email}
          </span>
        </span>
      </button>

      {open && (
        <div className="rpd-menu" role="menu">
          {/* User Information */}

          <div className="rpd-head">
            <Avatar
              name={user.name}
              image={user.image}
              size="lg"
            />

            <div className="rpd-head-text">
              <h4 className="rpd-name">
                {user.name}
              </h4>

              <p className="rpd-email">
                {user.email}
              </p>

              <span
                className="rpd-role"
                data-role={isSuperAdmin ? "super-admin" : roles[0]}
              >
                {roleKey ? t(roleKey) : roleLabel}
              </span>
            </div>
          </div>

          {/* My Account */}

          <SectionTitle>
            {t("dd_my_account")}
          </SectionTitle>

          {ACCOUNT_ITEMS.map((item) => (
            <MenuLink
              key={item.href}
              item={item}
              onClick={close}
            />
          ))}

          {/* Event Management */}

          <div className="rpd-divider" />

          <SectionTitle>
            {t("dd_events")}
          </SectionTitle>

          {eventItems.map((item) => (
            <MenuLink
              key={item.href}
              item={item}
              onClick={close}
            />
          ))}

          {/* Admin Section */}

          {isAdmin && (
            <>
              <div className="rpd-divider" />

              <SectionTitle>
                {t("dd_admin_sec")}
              </SectionTitle>

              <MenuLink
                item={ADMIN_ITEM}
                onClick={close}
              />
            </>
          )}

          {/* Preferences */}

          <div className="rpd-divider" />

          <SectionTitle>
            {t("dd_prefs")}
          </SectionTitle>

          <div className="rpd-row">
            <span className="rpd-row-label">
              <span className="rpd-ico tone-green">
                <Globe size={17} />
              </span>

              {t("dd_language")}
            </span>

            <div
              className="rpd-pill"
              role="group"
              aria-label={t("dd_language")}
            >
              <button
                type="button"
                className={lang === "bn" ? "is-active" : ""}
                aria-pressed={lang === "bn"}
                onClick={() => setLang("bn")}
              >
                বাংলা
              </button>

              <button
                type="button"
                className={lang === "en" ? "is-active" : ""}
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
              >
                EN
              </button>
            </div>
          </div>

          <div className="rpd-appearance">
            <span className="rpd-row-label">
              <span className="rpd-ico tone-indigo">
                <Palette size={17} />
              </span>

              {t("dd_appearance")}
            </span>

            <ThemeSwitcher
              theme={theme}
              onThemeChange={handleThemeChange}
            />
          </div>

          {/* Help & Support */}

          <div className="rpd-divider" />

          <SectionTitle>
            {t("dd_help_sec")}
          </SectionTitle>

          {HELP_ITEMS.map((item) => (
            <MenuLink
              key={item.href}
              item={item}
              onClick={close}
            />
          ))}

          {/* Logout */}

          <div className="rpd-divider" />

          <button
            type="button"
            className="rpd-item rpd-logout"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <span className="rpd-ico tone-rose">
              <LogOut size={17} />
            </span>

            <span className="rpd-item-title">
              {loggingOut
                ? t("dd_logging_out")
                : t("dd_logout")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
