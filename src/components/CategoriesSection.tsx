"use client";

import "@/styles/categories.css";

import type { ReactElement, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Droplets,
  GraduationCap,
  Leaf,
  Megaphone,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { useLang } from "@/components/LanguageProvider";

const EVENTS_HREF = "/events";

/* ---------- illustrations (hero-style flat scenes) ---------- */

function Scene({
  sky = "#e3f2c8",
  children,
}: {
  sky?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 320 240"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="320" height="240" fill={sky} />
      <circle cx="262" cy="54" r="40" fill="#fbe08a" opacity=".45" />
      <circle cx="262" cy="54" r="20" fill="#fbd56b" />
      <path d="M0 150 Q80 118 160 142 T320 134 V240 H0Z" fill="#c3e1a6" />
      <path d="M0 182 Q110 156 220 178 T320 170 V240 H0Z" fill="#a8d492" />
      <path d="M0 206 Q160 192 320 208 V240 H0Z" fill="#8a4b2b" />
      {children}
    </svg>
  );
}

function Sapling({
  x,
  h = 36,
  r = 16,
}: {
  x: number;
  h?: number;
  r?: number;
}) {
  const base = 206;
  return (
    <g>
      <rect x={x - 2} y={base - h} width="4" height={h} fill="#7a4a2a" />
      <circle cx={x} cy={base - h - r + 4} r={r} fill="#4f9d5d" />
      <circle
        cx={x + r * 0.6}
        cy={base - h - r * 0.2}
        r={r * 0.6}
        fill="#63ad6f"
      />
    </g>
  );
}

function PlantingArt() {
  return (
    <Scene>
      <Sapling x={80} h={30} r={14} />
      <Sapling x={160} h={52} r={22} />
      <Sapling x={240} h={38} r={16} />
    </Scene>
  );
}

function CareArt() {
  return (
    <Scene sky="#e6f4d5">
      <Sapling x={130} h={40} r={18} />
      <rect x="196" y="112" width="46" height="34" rx="7" fill="#4a7fb5" />
      <path
        d="M196 124 L170 106"
        stroke="#4a7fb5"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M242 122 Q262 122 262 138 Q262 148 246 148"
        stroke="#3a6a9a"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="160" cy="124" rx="3" ry="5" fill="#7cc4ee" />
      <ellipse cx="152" cy="138" rx="3" ry="5" fill="#7cc4ee" />
      <ellipse cx="146" cy="152" rx="3" ry="5" fill="#7cc4ee" />
    </Scene>
  );
}

function SchoolArt() {
  return (
    <Scene>
      <Sapling x={48} h={50} r={24} />
      <Sapling x={280} h={30} r={14} />
      <rect x="100" y="118" width="120" height="68" fill="#f4e4bf" />
      <polygon points="90,118 160,78 230,118" fill="#d85a40" />
      <rect x="148" y="142" width="24" height="44" rx="3" fill="#7a4a2a" />
      <rect x="110" y="132" width="26" height="22" rx="3" fill="#cfe6f4" />
      <rect x="184" y="132" width="26" height="22" rx="3" fill="#cfe6f4" />
      <rect x="159" y="52" width="2" height="28" fill="#1b4332" />
      <polygon points="161,52 183,59 161,66" fill="#f2b429" />
    </Scene>
  );
}

function AwarenessArt() {
  return (
    <Scene>
      <Sapling x={60} h={30} r={14} />
      <Sapling x={262} h={34} r={15} />
      <rect x="156" y="132" width="8" height="74" fill="#7a4a2a" />
      <rect x="106" y="70" width="108" height="72" rx="10" fill="#ffffff" />
      <circle cx="160" cy="100" r="20" fill="#4f9d5d" />
      <circle cx="170" cy="108" r="11" fill="#63ad6f" />
      <rect x="157" y="112" width="6" height="18" fill="#7a4a2a" />
      <path
        d="M88 96 Q76 106 88 118"
        stroke="#1b4332"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity=".5"
      />
      <path
        d="M232 96 Q244 106 232 118"
        stroke="#1b4332"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity=".5"
      />
    </Scene>
  );
}

/* ---------- data ---------- */

type Category = {
  id: string;
  Icon: LucideIcon;
  Art: () => ReactElement;
  /** Optional real photo, e.g. "/categories/plantation.jpg" (put it in /public) */
  image?: string;
  en: { title: string; text: string };
  bn: { title: string; text: string };
};

const CATEGORIES: Category[] = [
  {
    id: "plantation",
    Icon: Sprout,
    Art: PlantingArt,
    en: {
      title: "Community Tree Plantation",
      text: "Plantation drives where the whole community plants together.",
    },
    bn: {
      title: "কমিউনিটি বৃক্ষরোপণ",
      text: "কমিউনিটির সবাই মিলে বৃক্ষরোপণ কর্মসূচি।",
    },
  },
  {
    id: "care",
    Icon: Droplets,
    Art: CareArt,
    en: {
      title: "Tree Care & Maintenance",
      text: "Caring for and protecting the trees we have planted.",
    },
    bn: {
      title: "গাছের পরিচর্যা ও সংরক্ষণ",
      text: "রোপণ করা গাছের পরিচর্যা ও সংরক্ষণ।",
    },
  },
  {
    id: "school",
    Icon: GraduationCap,
    Art: SchoolArt,
    en: {
      title: "School & Campus Plantation",
      text: "Planting trees in schools, colleges and campuses.",
    },
    bn: {
      title: "স্কুল ও ক্যাম্পাস বৃক্ষরোপণ",
      text: "স্কুল, কলেজ ও শিক্ষাপ্রতিষ্ঠানে বৃক্ষরোপণ।",
    },
  },
  {
    id: "awareness",
    Icon: Megaphone,
    Art: AwarenessArt,
    en: {
      title: "Tree Plantation Awareness",
      text: "Awareness and social campaigns about planting trees.",
    },
    bn: {
      title: "বৃক্ষরোপণ সচেতনতা",
      text: "বৃক্ষরোপণ বিষয়ে সচেতনতা ও সামাজিক প্রচারণা।",
    },
  },
];

/* ---------- section ---------- */

export default function CategoriesSection() {
  const { lang } = useLang();
  const bn = lang === "bn";

  return (
    <section
      className="cat-section"
      id="categories"
      aria-labelledby="cat-heading"
    >
      <div className="cat-head">
        <div>
          <span className="cat-eyebrow">
            <Leaf size={14} />
            {bn ? "আপনার পথ খুঁজুন" : "Find your way to help"}
          </span>

          <h2 id="cat-heading" className="cat-title">
            {bn ? (
              <>
                যত্ন নেওয়ার পথ
                <br />
                <span>একটিই নয়।</span>
              </>
            ) : (
              <>
                There is more than
                <br />
                <span>one way to care.</span>
              </>
            )}
          </h2>

          <p className="cat-lead">
            {bn
              ? "গাছ লাগান, যত্ন নিন, শেখান আর সবাইকে জানান। আপনার পছন্দের পথেই অংশ নিন।"
              : "Plant, nurture, teach and spread the word. Join in the way that suits you."}
          </p>
        </div>

        <Link href={EVENTS_HREF} className="cat-all">
          {bn ? "সব ইভেন্ট দেখুন" : "Explore all events"}
          <ArrowRight size={16} />
        </Link>
      </div>

      <ul className="cat-grid">
        {CATEGORIES.map((c, i) => {
          const text = bn ? c.bn : c.en;

          return (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={EVENTS_HREF} className="cat-card">
                <div className="cat-media">
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt="" className="cat-photo" />
                  ) : (
                    <c.Art />
                  )}

                  <span className="cat-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="cat-icon">
                    <c.Icon size={20} />
                  </span>

                  <span className="cat-arrow" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                <div className="cat-body">
                  <h3>{text.title}</h3>
                  <p>{text.text}</p>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}