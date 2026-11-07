"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Globe2,
  HandHeart,
  Heart,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Sprout,
  TreePine,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import HeroScene from "@/components/HeroScene";
import Navbar from "@/components/Navbar";
import PageWind from "@/components/PageWind";
import { api } from "@/lib/api";

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

const categories = [
  {
    title: "Tree Plantation",
    subtitle: "Plant today. Breathe better tomorrow.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900",
    icon: TreePine,
  },
  {
    title: "River & Community Cleanup",
    subtitle: "Cleaner rivers. Healthier communities.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900",
    icon: Recycle,
  },
  {
    title: "Education for All",
    subtitle: "Share knowledge. Open possibilities.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900",
    icon: BookOpen,
  },
  {
    title: "Community Support",
    subtitle: "A little kindness goes a long way.",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900",
    icon: HandHeart,
  },
];

const features = [
  {
    number: "01",
    icon: Sprout,
    title: "Find Your Cause",
    description:
      "Discover local tree drives, river cleanups, educational initiatives and community activities that matter to you.",
  },
  {
    number: "02",
    icon: Users,
    title: "Show Up Together",
    description:
      "Meet people who share your values, volunteer together and turn good intentions into meaningful action.",
  },
  {
    number: "03",
    icon: Globe2,
    title: "Make a Difference",
    description:
      "Every hour, every helping hand and every small contribution can make a lasting difference in your neighbourhood.",
  },
];

const gallery = [
  {
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900",
    title: "Growing a Greener Bangladesh",
    category: "ENVIRONMENT",
  },
  {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900",
    title: "Small Actions, Lasting Change",
    category: "COMMUNITY",
  },
  {
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900",
    title: "A Better Tomorrow Starts Here",
    category: "NATURE",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
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
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load events right now."
          );
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
      {/* PAGE-WIDE WIND + FLYING LEAVES */}
      <PageWind />

      <Navbar />

      {/* HERO */}
      <section className="hero-section">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.h1 variants={fadeUp}>
            Show up. Plant something. Change your neighbourhood.
          </motion.h1>

          <motion.p variants={fadeUp}>
            From tree drives and river cleanups to community initiatives,
            discover ways to make a difference right where you live.
            Bangladesh gets better when we grow together.
          </motion.p>

          <motion.div className="hero-cta" variants={fadeUp}>
            <Link href="/events" className="hero-btn hero-btn-solid">
              Explore Events
            </Link>

            <Link href="/create-event" className="hero-btn hero-btn-sun">
              Host an Event
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <span className="hero-pill">
              <i />
              {loading
                ? "Loading upcoming events..."
                : `${events.length} upcoming ${
                    events.length === 1 ? "event" : "events"
                  } available`}
            </span>
          </motion.div>
        </motion.div>

        <HeroScene />
      </section>

      {/* INTRO STRIP */}
      <section className="intro-strip">
        <div className="intro-inner">
          <span>SHOW UP</span>
          <span className="intro-star">✳</span>
          <span>PLANT SOMETHING</span>
          <span className="intro-star">✳</span>
          <span>HELP SOMEONE</span>
          <span className="intro-star">✳</span>
          <span>MAKE AN IMPACT</span>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="section categories-section">
        <div className="section-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="eyebrow">
              <Leaf size={15} />
              FIND YOUR WAY TO HELP
            </span>

            <h2>
              There is more than
              <br />
              <span>one way to care.</span>
            </h2>

            <p>
              Whether you love nature, education or helping people, there is a
              place for you in our community.
            </p>
          </motion.div>

          <Link href="/events" className="text-link">
            Explore all events
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                className="category-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ delay: index * 0.12, duration: 0.6 }}
              >
                <Link
                  href="/events"
                  className="category-image"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className="category-number">0{index + 1}</div>

                  <div className="category-icon">
                    <Icon size={21} />
                  </div>

                  <div className="category-arrow">
                    <ArrowUpRight size={20} />
                  </div>
                </Link>

                <div className="category-info">
                  <div>
                    <h3>{category.title}</h3>
                    <p>{category.subtitle}</p>
                  </div>

                  <ChevronRight size={19} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ABOUT / MISSION */}
      <section id="about" className="mission-section">
        <div className="mission-container">
          <motion.div
            className="mission-image-wrapper"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mission-image" />

            <div className="mission-image-label">
              <Sprout size={22} />
              <span>Rooted in purpose</span>
            </div>

            <div className="mission-decor">
              <Leaf size={34} />
            </div>
          </motion.div>

          <motion.div
            className="mission-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.span className="eyebrow" variants={fadeUp}>
              <Globe2 size={15} />
              WHY ROOTED BD
            </motion.span>

            <motion.h2 variants={fadeUp}>
              Change starts
              <br />
              right in <span>your backyard.</span>
            </motion.h2>

            <motion.p variants={fadeUp}>
              We believe that better neighbourhoods are built by people who
              care enough to take action. A cleaner street, a planted tree or
              a helping hand can be the beginning of something bigger.
            </motion.p>

            <motion.p variants={fadeUp}>
              Rooted BD connects people with local initiatives across
              Bangladesh, making it easier to discover events, bring
              communities together and turn shared intentions into real-world
              impact.
            </motion.p>

            <motion.div className="mission-points" variants={fadeUp}>
              <div>
                <CheckCircle2 size={19} />
                Discover meaningful local activities
              </div>

              <div>
                <CheckCircle2 size={19} />
                Connect with people who care
              </div>

              <div>
                <CheckCircle2 size={19} />
                Create positive community impact
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link href="/events" className="primary-button">
                Discover Our Community
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section process-section">
        <div className="section-heading centered-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="eyebrow">
              <Sprout size={15} />
              FROM INTENTION TO ACTION
            </span>

            <h2>
              Good things happen
              <br />
              <span>when we show up.</span>
            </h2>

            <p>
              Getting involved does not have to be complicated. Find an event,
              join the effort and make an impact.
            </p>
          </motion.div>
        </div>

        <div className="process-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.number}
                className="process-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.15 }}
              >
                <div className="process-top">
                  <span>{feature.number}</span>

                  <div className="process-icon">
                    <Icon size={25} />
                  </div>
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <div className="process-bottom">
                  <span>ROOTED BD</span>
                  <ArrowUpRight size={19} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* RECENT UPCOMING EVENTS */}
      <section className="events-section">
        <div className="events-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <CalendarDays size={15} />
                GOOD THINGS ARE HAPPENING
              </span>

              <h2>
                Find an event.
                <br />
                <span>Be part of the change.</span>
              </h2>

              <p>
                Find opportunities to volunteer, meet your community and make
                something meaningful happen.
              </p>
            </div>

            <Link href="/events" className="text-link">
              View all events
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="h-56 animate-pulse bg-gray-200" />

                  <div className="space-y-4 p-6">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="events-empty">
              <h3>We could not load the events.</h3>
              <p>{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="events-empty">
              <div className="events-empty-icon">
                <CalendarDays size={29} />
              </div>

              <h3>Your next good deed starts here.</h3>

              <p>
                No upcoming events yet. Be the first to host one in your
                neighbourhood.
              </p>

              <Link href="/create-event" className="primary-button">
                Host an Event
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <motion.article
                  key={event._id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-[#17301d] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-[#e8eddf]">
                    {event.thumbnail ? (
                      <div
                        role="img"
                        aria-label={event.title}
                        className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url("${event.thumbnail}")`,
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#78945c]">
                        <Sprout size={55} />
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#315b47] shadow-sm">
                      {event.eventType || "Community"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex items-center gap-2 text-xs font-medium text-[#78945c]">
                      <CalendarDays size={15} />
                      {formatDate(event.eventDate)}
                    </div>

                    <h3 className="line-clamp-2 min-h-[3.4rem] text-xl font-semibold leading-snug">
                      {event.title}
                    </h3>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="shrink-0 text-[#78945c]" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="primary-button mt-6 w-full"
                    >
                      View Event
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="section gallery-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <Heart size={15} />
              PEOPLE. PURPOSE. PROGRESS.
            </span>

            <h2>
              A better place
              <br />
              <span>starts with us.</span>
            </h2>
          </div>

          <span className="gallery-note">Small moments. Meaningful change.</span>
        </div>

        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <motion.div
              key={item.title}
              className="gallery-card"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="gallery-overlay">
                <span>
                  {item.category} / 0{index + 1}
                </span>

                <h3>{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-decoration">
          <Leaf size={100} />
        </div>

        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="eyebrow">
            <Sprout size={15} />
            YOUR NEIGHBOURHOOD IS WAITING
          </span>

          <h2>
            Don&apos;t just wish
            <br />
            for change. <span>Show up.</span>
          </h2>

          <p>
            Join people who are doing something good for their communities.
            Start small, get involved and help grow a better Bangladesh.
          </p>

          <div className="cta-buttons">
            <Link href="/register" className="cta-light-button">
              Join the Community
              <ArrowRight size={18} />
            </Link>

            <Link href="/create-event" className="cta-outline-button">
              Host an Event
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* NEWSLETTER */}
      <section id="contact" className="newsletter-section">
        <div className="newsletter-container">
          <div>
            <span className="eyebrow">STAY IN THE LOOP</span>

            <h2>
              Good things
              <br />
              <span>grow together.</span>
            </h2>

            <p>
              Get community updates, upcoming volunteer opportunities and
              stories of positive change delivered to your inbox.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <label htmlFor="newsletter-email">Your email address</label>

            <div className="newsletter-input">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <button type="submit" aria-label="Subscribe">
                <ArrowRight size={20} />
              </button>
            </div>

            <span>
              <ShieldCheck size={15} />
              No spam. Just good things happening.
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
                  <Leaf size={23} />
                </span>

                <span>
                  rooted<span className="brand-highlight">.</span>
                  <small>BD</small>
                </span>
              </Link>

              <p>
                A community platform for people who want to make a difference
                through small actions, shared ideas and meaningful connections.
              </p>

              <div className="footer-socials">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                >
                  <XIcon size={16} />
                </a>

                <a href="#contact" aria-label="Community">
                  <Users size={18} />
                </a>

                <a href="#contact" aria-label="Email">
                  <Heart size={18} />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4>Explore</h4>

              <Link href="/">Home</Link>
              <Link href="/events">Upcoming Events</Link>
              <Link href="/create-event">Create Event</Link>
              <a href="#about">About Us</a>
            </div>

            <div className="footer-column">
              <h4>Community</h4>

              <Link href="/register">Join Community</Link>
              <Link href="/login">Sign In</Link>
              <Link href="/manage-events">Manage Events</Link>
              <Link href="/joined-events">Joined Events</Link>
            </div>

            <div className="footer-column">
              <h4>Our Causes</h4>

              <a href="#categories">Tree Plantation</a>
              <a href="#categories">River Cleanup</a>
              <a href="#categories">Education</a>
              <a href="#categories">Community Support</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              © {currentYear} Rooted BD. Growing together for a
              better Bangladesh.
            </p>

            <div>
              <span>Made with purpose</span>
              <Leaf size={16} />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}