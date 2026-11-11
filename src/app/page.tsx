"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Globe2,
  Heart,
  Leaf,
  MapPin,
  ShieldCheck,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

import CategoriesSection from "@/components/CategoriesSection";
import HeroScene from "@/components/HeroScene";
import PageWind from "@/components/PageWind";
import { useLang } from "@/components/LanguageProvider";
import { api } from "@/lib/api";
import type { TKey } from "@/lib/i18n";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName?: string;
}

const features: {
  number: string;
  icon: LucideIcon;
  titleKey: TKey;
  descKey: TKey;
}[] = [
  { number: "01", icon: Sprout, titleKey: "f1_title", descKey: "f1_desc" },
  { number: "02", icon: Users, titleKey: "f2_title", descKey: "f2_desc" },
  { number: "03", icon: Globe2, titleKey: "f3_title", descKey: "f3_desc" },
];

const gallery: { image: string; titleKey: TKey; catKey: TKey }[] = [
  {
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900",
    titleKey: "g1_title",
    catKey: "g1_cat",
  },
  {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900",
    titleKey: "g2_title",
    catKey: "g2_cat",
  },
  {
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900",
    titleKey: "g3_title",
    catKey: "g3_cat",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

const formatDate = (value: string, locale: string, fallback: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// New X (Twitter) logo
function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Home() {
  const { t, lang } = useLang();
  const locale = lang === "bn" ? "bn-BD" : "en-US";

  const [email, setEmail] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    let active = true;

    setCurrentYear(new Date().getFullYear());

    async function loadEvents() {
      try {
        const response = await api("/events?limit=6");

        const list: EventItem[] = Array.isArray(response?.events)
          ? response.events
          : [];

        if (active) {
          setEvents(list.slice(0, 6));
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmail("");
  };

  return (
    <main className="rooted-home min-h-screen overflow-x-clip">
      {/* HERO */}
      <section className="hero-section">
        {/* leaves + wind: hero only */}
        <PageWind />

        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.h1 variants={fadeUp}>{t("h_title")}</motion.h1>

          <motion.p variants={fadeUp}>{t("h_text")}</motion.p>

          <motion.div className="hero-cta" variants={fadeUp}>
            <Link href="/events" className="hero-btn hero-btn-solid">
              {t("h_explore")}
              <ArrowRight size={16} style={{ marginLeft: 8 }} />
            </Link>

            <Link href="/create-event" className="hero-btn hero-btn-sun">
              {t("host_event")}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            {loading ? (
              <span className="hero-pill">
                <i />
                {t("h_loading")}
              </span>
            ) : events.length === 0 ? (
              <Link href="/create-event" className="hero-pill hero-pill-cta">
                <i />
                {t("h_first")}
                <ArrowRight size={14} />
              </Link>
            ) : (
              <span className="hero-pill">
                <i />
                {t(events.length === 1 ? "h_count_one" : "h_count_many").replace(
                  "{n}",
                  events.length.toLocaleString(locale)
                )}
              </span>
            )}
          </motion.div>
        </motion.div>

        <HeroScene />
      </section>

      {/* CATEGORIES (new design) */}
      <CategoriesSection />

      {/* MISSION */}
      <section id="about" className="mission-section">
        <div className="mission-container">
          <motion.div
            className="mission-image-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="mission-image" />
            <div className="mission-decor">
              <Heart size={26} />
            </div>
            <div className="mission-image-label">
              <Leaf size={18} />
              {t("m_label")}
            </div>
          </motion.div>

          <motion.div
            className="mission-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="eyebrow">
              <Leaf size={15} />
              {t("m_eyebrow")}
            </span>

            <h2>
              {t("m_h2_a")}
              <br />
              {t("m_h2_b")} <span>{t("m_h2_c")}</span>
            </h2>

            <p>{t("m_p1")}</p>
            <p>{t("m_p2")}</p>

            <div className="mission-points">
              {(["m_pt1", "m_pt2", "m_pt3"] as TKey[]).map((key) => (
                <div key={key}>
                  <CheckCircle2 size={18} />
                  {t(key)}
                </div>
              ))}
            </div>

            <Link href="/signup" className="primary-button">
              {t("m_btn")}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="section-heading centered-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="eyebrow">
              <Leaf size={15} />
              {t("p_eyebrow")}
            </span>

            <h2>
              {t("p_h2_a")}
              <br />
              <span>{t("p_h2_b")}</span>
            </h2>

            <p>{t("p_text")}</p>
          </motion.div>
        </div>

        <div className="process-grid">
          {features.map(({ number, icon: Icon, titleKey, descKey }, i) => (
            <motion.article
              key={number}
              className="process-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              variants={fadeUp}
            >
              <div className="process-top">
                <span>{number}</span>
                <div className="process-icon">
                  <Icon size={24} />
                </div>
              </div>

              <h3>{t(titleKey)}</h3>
              <p>{t(descKey)}</p>

              <div className="process-bottom">
                <span>{number} / 03</span>
                <ArrowRight size={15} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

     

      {/* GALLERY */}
      <section id="gallery" className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <Leaf size={15} />
              {t("g_eyebrow")}
            </span>

            <h2>
              {t("g_h2_a")}
              <br />
              <span>{t("g_h2_b")}</span>
            </h2>
          </div>

          <span className="gallery-note">{t("g_note")}</span>
        </div>

        <div className="gallery-grid">
          {gallery.map(({ image, titleKey, catKey }) => (
            <div
              key={titleKey}
              className="gallery-card"
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="gallery-overlay">
                <span>{t(catKey)}</span>
                <h3>{t(titleKey)}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <Sprout className="cta-decoration" size={260} />

        <div className="cta-content">
          <span className="eyebrow">
            <Leaf size={15} />
            {t("cta_eyebrow")}
          </span>

          <h2>
            {t("cta_h2_a")}
            <br />
            {t("cta_h2_b")}
            <br />
            <span>{t("cta_h2_c")}</span>
          </h2>

          <p>{t("cta_text")}</p>

          <div className="cta-buttons">
            <Link href="/signup" className="cta-light-button">
              {t("join_community")}
              <ArrowRight size={16} />
            </Link>
            <Link href="/events" className="cta-outline-button">
              {t("explore_all")}
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="contact" className="newsletter-section">
        <div className="newsletter-container">
          <div>
            <span className="eyebrow">
              <Leaf size={15} />
              {t("nl_eyebrow")}
            </span>

            <h2>
              {t("nl_h2_a")}
              <br />
              <span>{t("nl_h2_b")}</span>
            </h2>

            <p>{t("nl_text")}</p>
          </div>

          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <label htmlFor="newsletter-email">{t("nl_label")}</label>

            <div className="newsletter-input">
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("nl_ph")}
              />
              <button type="submit" aria-label={t("nl_sub")}>
                <ArrowRight size={18} />
              </button>
            </div>

            <span>
              <ShieldCheck size={14} />
              {t("nl_note")}
            </span>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <Link href="/" className="brand footer-logo">
                <span className="brand-icon">
                  <Leaf size={22} />
                </span>
                <span>
                  rooted<span className="brand-highlight">.</span>
                  <small>BD</small>
                </span>
              </Link>

              <p>{t("ft_desc")}</p>

              <div className="footer-socials">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <XIcon size={16} />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4>{t("ft_explore")}</h4>
              <Link href="/events">{t("view_all")}</Link>
              <Link href="/create-event">{t("ft_create")}</Link>
              <Link href="/signup">{t("ft_join")}</Link>
            </div>

            <div className="footer-column">
              <h4>{t("ft_community")}</h4>
              <Link href="/login">{t("ft_signin")}</Link>
              <Link href="/my-events">{t("ft_manage")}</Link>
              <Link href="/joined-events">{t("ft_joined")}</Link>
            </div>

            <div className="footer-column">
              <h4>{t("ft_causes")}</h4>
              <Link href="/events">{t("cat_tree")}</Link>
              <Link href="/events">{t("ft_river")}</Link>
              <Link href="/events">{t("ft_edu")}</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              © {currentYear} {t("ft_copy")}
            </p>
            <div>
              <Heart size={14} />
              <span>{t("ft_made")}</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}