"use client";

import { useState, FormEvent } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  isLatest?: boolean;
}

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  label: string;
  price: string;
  priceUnit?: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  ctaHref: string;
  offset?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const timelineItems: TimelineItem[] = [
  {
    year: "2026",
    title: "Smart Vehicle Diagnostics",
    description:
      "AI-powered diagnostics are integrated into our booking platform, helping customers identify vehicle issues faster and reducing repair turnaround times.",
    isLatest: true,
  },
  {
    year: "2025",
    title: "Expanded Service Network",
    description:
      "Multiple repair locations are connected through a single booking system, allowing customers to schedule maintenance and repairs at their preferred service center.",
  },
  {
    year: "2024",
    title: "Online Booking Launch",
    description:
      "Our digital platform goes live, enabling customers to book appointments, track repair progress, and receive service updates directly online.",
  },
  {
    year: "2022",
    title: "Growing Customer Trust",
    description:
      "With increasing demand for transparent and reliable automotive services, we focus on improving customer experience through clear pricing and faster scheduling.",
  },
  {
    year: "2018",
    title: "The Garage Opens",
    description:
      "Founded by a team of experienced automotive technicians, our mission is simple: provide honest vehicle maintenance and repair services that drivers can rely on.",
  },
];
const pricingPlans: PricingPlan[] = [
  {
    label: "Sprint Week",
    price: "$20,000",
    priceUnit: "/ week",
    description:
      "One focused week. One specific problem. We go from discovery to a working prototype, delivered Friday.",
    features: [
      { text: "Lisa & Sarah, full week" },
      { text: "Working prototype delivered" },
      { text: "Full handover & documentation" },
    ],
    cta: "Book a sprint",
    ctaHref: "#contact",
  },
  {
    label: "Custom Engagement",
    price: "Let's talk",
    description:
      "Larger problems need more time. We scope custom engagements tailored to your organization — from two-week deep dives to quarter-long transformations.",
    features: [
      { text: "Scoped to your specific challenge" },
      { text: "Multi-week or multi-month timelines" },
      { text: "Cross-department discovery included" },
      { text: "Production-ready solutions, not reports" },
      { text: "On-site or remote — we adapt to you" },
      { text: "Full handover, documentation & training" },
    ],
    cta: "Get in touch",
    ctaHref: "#contact",
    offset: true,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      style={{ width: "1rem", height: "1rem", flexShrink: 0, color: "white" }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

// ─── Timeline Section ─────────────────────────────────────────────────────────

function TimelineSection() {
  return (
    <section className="py-[calc(48px+8vh)]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "6rem" }}>
          {/* Left: Sticky heading */}
          <div className="md:sticky md:top-32 md:self-start">
            <span className="inline-block rounded-full border border-white/30 px-4 py-1.5 text-xs font-medium tracking-wide mb-6">
              Our Story
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From a shared frustration to a new kind of firm
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Lisa and Sarah kept running into the same problem — consultants who diagnosed but never built. In 2024
              they decided to do it differently.
            </p>
          </div>

          {/* Right: Timeline */}
          <div className="relative" style={{ paddingLeft: "2rem" }}>
            {/* Vertical line */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: "5px",
                width: "1px",
                background: "linear-gradient(to bottom, var(--color-foreground), var(--color-border))",
              }}
            />

            {timelineItems.map((item, i) => (
              <div key={item.year} className={`relative ${i < timelineItems.length - 1 ? "pb-16" : ""}`}>
                {/* Dot */}
                <div className="absolute" style={{ left: "-2rem", top: "0.35rem" }}>
                  {item.isLatest ? (
                    <div
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: "white",
                        boxShadow: "0 0 8px rgba(255,255,255,0.6), 0 0 20px rgba(255,255,255,0.3)",
                        animation: "timeline-pulse 2s ease-in-out infinite",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background:
                          i === timelineItems.length - 1 ? "var(--color-border)" : "var(--color-muted-foreground)",
                      }}
                    />
                  )}
                </div>

                <p className="text-sm font-medium text-muted-foreground">{item.year}</p>
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes timeline-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(255,255,255,0.6), 0 0 20px rgba(255,255,255,0.3); }
          50% { box-shadow: 0 0 14px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.5); }
        }
      `}</style>
    </section>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────────

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div className={plan.offset ? "md:pb-12" : ""}>
      <div
        className="rounded-2xl bg-black overflow-hidden border border-border"
        style={{
          backgroundImage: "radial-gradient(80% 50% at 50% 0%, rgb(26,26,26) 0%, transparent 70%)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "2.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{plan.label}</p>
          <div className="mt-4" style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
            <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
            {plan.priceUnit && <span className="text-sm text-muted-foreground">{plan.priceUnit}</span>}
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
        </div>

        {/* Features */}
        <div style={{ padding: "2rem 2.5rem" }}>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {plan.features.map((f) => (
              <li
                key={f.text}
                className="text-sm text-muted-foreground"
                style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
              >
                <CheckIcon />
                {f.text}
              </li>
            ))}
          </ul>
          <a
            href={plan.ctaHref}
            className="mt-6 inline-flex items-center rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            style={{ marginTop: plan.features.length > 3 ? "2rem" : "1.5rem" }}
          >
            {plan.cta}
          </a>
        </div>
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <section id="pricing">
      <div className="mx-auto px-6" style={{ maxWidth: 1152 }}>
        <div className="relative rounded-2xl py-[calc(48px+8vh)] px-6 overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: "url('/image/flo/floral7.webp') center/cover no-repeat",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)",
            }}
          />

          <div className="relative mx-auto max-w-5xl">
            <div className="px-6 md:px-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Heading */}
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Simple, transparent pricing
                  </h2>
                  <p className="mt-4 text-white/70 leading-relaxed">
                    No hourly billing, no scope creep surprises. You know what you're paying before we start.
                  </p>
                </div>

                {pricingPlans.map((plan) => (
                  <PricingCard key={plan.label} plan={plan} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

function ContactSection() {
  const [form, setForm] = useState<ContactFormState>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", form);
  };

  return (
    <section id="contact" className="py-[calc(48px+8vh)]">
      <div
        className="
        relative mx-auto max-w-2xl overflow-hidden
        rounded-3xl border border-border
        bg-card text-card-foreground
        p-8 md:p-12
        shadow-sm
      "
      >
        {/* Glow effect */}
        <div
          className="
          pointer-events-none absolute inset-x-0 top-0 h-40
          bg-linear-to-b from-primary/10 to-transparent
        "
        />

        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">Let's talk</h2>

          <p className="mt-4 text-lg text-muted-foreground text-center">
            Tell us what's not working. We'll tell you if we can help — honestly and quickly.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="text-left">
                <label htmlFor="first-name" className="block text-sm font-medium">
                  First name
                </label>

                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  required
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="
                  mt-2 w-full rounded-xl
                  border border-border
                  bg-background
                  px-4 py-3 text-sm
                  placeholder:text-muted-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/30
                "
                />
              </div>

              <div className="text-left">
                <label htmlFor="last-name" className="block text-sm font-medium">
                  Last name
                </label>

                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  required
                  placeholder="Smith"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="
                  mt-2 w-full rounded-xl
                  border border-border
                  bg-background
                  px-4 py-3 text-sm
                  placeholder:text-muted-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/30
                "
                />
              </div>
            </div>

            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="
                mt-2 w-full rounded-xl
                border border-border
                bg-background
                px-4 py-3 text-sm
                placeholder:text-muted-foreground
                focus:outline-none
                focus:ring-2
                focus:ring-primary/30
              "
              />
            </div>

            <div className="text-left">
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Tell us about your project..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="
                mt-2 w-full rounded-xl
                border border-border
                bg-background
                px-4 py-3 text-sm
                placeholder:text-muted-foreground
                resize-y
                focus:outline-none
                focus:ring-2
                focus:ring-primary/30
              "
              />
            </div>

            <button
              type="submit"
              className="
              inline-flex items-center justify-center
              rounded-full
              bg-primary
              text-primary-foreground
              px-6 py-3
              text-sm font-medium
              transition-all
              w-full
              hover:opacity-90
              active:scale-[0.98]
            "
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── Default Export ───────────────────────────────────────────────────────────

export default function PageSectionTwo() {
  return (
    <>
      <TimelineSection />
      <PricingSection />
      <ContactSection />
    </>
  );
}
