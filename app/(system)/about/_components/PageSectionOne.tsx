"use client";

import { BMWIcon, FordIcon, HondaIcon, HyundaiIcon, MazdaIcon, ToyotaIcon } from "@/public/icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Mechanic {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const mechanics: Mechanic[] = [
  {
    name: "Hange",
    role: "Lead Mechanic & Co-founder",
    bio: "ASE Master Technician with 15 years under the hood. Specializes in engine diagnostics and performance tuning.",
    image: "/image/aot/hange.jpg",
    social: "https://www.facebook.com/tai.nguyen.321312",
  },
  {
    name: "Pieck",
    role: "Service Director & Co-founder",
    bio: "Former dealership service manager. Built systems that cut average repair time by 40% without cutting corners.",
    image: "/image/aot/pieck.webp",
    social: "https://www.facebook.com/tai.nguyen.321312",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared Icons
// ─────────────────────────────────────────────────────────────────────────────

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// About Section
// ─────────────────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-[calc(32px+5vh)]">
      {/* Headline */}
      <div className="mx-auto  max-w-5xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3" data-animate>
          <div className="lg:col-span-2">
            <span className="inline-block rounded-full border border-white/30 px-4 py-1.5 text-xs font-medium tracking-wide mb-6">
              Auto Repair & Booking
            </span>
            <h1 className="text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
              Book your repair online. We fix it right. Guaranteed.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Hange is a modern auto repair service that lets you book appointments in minutes, track your repair in
              real time, and drive away with full confidence — no surprises on the invoice.
            </p>
          </div>
        </div>
      </div>

      {/* Hero SVG Illustration */}
      <div id="hero-gradient-wrap" className="mx-auto px-6 mt-12 md:mt-16" data-animate data-delay="1">
        <div
          className="rounded-2xl p-8 md:p-16 flex items-center justify-center"
          style={{ background: "linear-gradient(to top, rgba(128,134,145,0.1), transparent)" }}
        >
          <svg className="w-full max-w-3xl" viewBox="0 0 370 220" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ring-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.85" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.08" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="ring-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.85" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.08" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
              </linearGradient>
              <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
              </pattern>
              <clipPath id="clip-right">
                <circle cx="260" cy="110" r="95" />
              </clipPath>
              <filter id="knob-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="110" cy="110" r="95" fill="url(#hatch)" clipPath="url(#clip-right)" />
            <circle
              cx="110"
              cy="110"
              r="95"
              fill="currentColor"
              opacity="0"
              clipPath="url(#clip-right)"
              id="overlap-glow"
            />
            {/* Ring 1 — tire */}
            <g className="hero-ring-1">
              <circle cx="110" cy="110" r="95" stroke="url(#ring-grad-1)" strokeWidth="0.75" fill="none" />
              <g filter="url(#knob-glow)">
                <circle cx="110" cy="15" r="4" fill="white" opacity="0.15" />
                <circle cx="110" cy="15" r="1.5" fill="white" />
              </g>
            </g>
            {/* Ring 2 — steering wheel */}
            <g className="hero-ring-2">
              <circle cx="260" cy="110" r="95" stroke="url(#ring-grad-2)" strokeWidth="0.75" fill="none" />
              <g filter="url(#knob-glow)">
                <circle cx="260" cy="205" r="4" fill="white" opacity="0.15" />
                <circle cx="260" cy="205" r="1.5" fill="white" />
              </g>
            </g>
            {/* Car silhouette */}
            <g opacity="0.22" transform="translate(110, 82)">
              <path d="M8 36 L18 16 L52 10 L86 16 L96 36 L8 36Z" stroke="white" strokeWidth="1.2" fill="none" />
              <circle cx="26" cy="36" r="9" stroke="white" strokeWidth="1.2" fill="none" />
              <circle cx="78" cy="36" r="9" stroke="white" strokeWidth="1.2" fill="none" />
              <path d="M24 16 L34 4 L68 4 L78 16" stroke="white" strokeWidth="1.2" fill="none" />
              <line x1="52" y1="4" x2="52" y2="16" stroke="white" strokeWidth="0.8" />
            </g>
          </svg>
        </div>
      </div>

      {/* Team & Description */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-12" data-animate data-delay="2">
          <div>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">A new kind of auto shop</h2>
            <div className="mt-6 flex items-center">
              <Image
                src="/image/aot/pieck-aot.png"
                alt="Hange"
                width={1024}
                height={1024}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
                loading="lazy"
              />
              <Image
                src="/image/aot/hange-aot.png"
                alt="Pieck"
                width={1024}
                height={1024}
                className="h-12 w-12 rounded-full object-cover  ring-background -ml-3"
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-lg font-medium text-foreground leading-relaxed">
              Most shops tell you what&apos;s wrong. We show you it&apos;s fixed — with proof.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Hange was founded by Hange and Pieck — a master technician who speaks fluent engine and a service director
              who redesigned how shops actually run. Two very different skills, united by one mission: making car repair
              honest, fast, and completely stress-free.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We go beyond the repair. We explain what failed and why, show you the parts we replaced, and send you a
              post-service report with photos. No upselling, no mystery charges. Book online, drop your keys, and we
              handle the rest — then hand it back running better than before.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Trust Bar — Car Brand Partners
// ─────────────────────────────────────────────────────────────────────────────

function TrustBar() {
  return (
    <section aria-label="Certified for all major car brands" className="border-y border-border py-[calc(24px+4vh)]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-3 text-foreground" data-animate="fade">
          {/* Toyota */}
          <div className="flex gap-1 italic items-center justify-center border-r border-b border-border py-8">
            <ToyotaIcon />
            Toyota
          </div>
          {/* Honda */}
          <div className="flex gap-1 italic items-center justify-center border-r border-b border-border py-8">
            <HondaIcon />
            Honda
          </div>
          {/* Ford */}
          <div className="flex gap-1 italic items-center justify-center border-b border-border py-8">
            <FordIcon />
            Ford
          </div>
          {/* BMW */}
          <div className="flex gap-1 italic items-center justify-center border-r border-border py-8">
            <BMWIcon />
            BMW
          </div>
          {/* Hyundai */}
          <div className="flex gap-1 italic items-center justify-center border-r border-border py-8">
            <HyundaiIcon />
            Hyundai
          </div>
          {/* Mazda */}
          <div className="flex gap-1 italic items-center justify-center py-8">
            <MazdaIcon />
            Mazda
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// How It Works Section
// ─────────────────────────────────────────────────────────────────────────────

function HowItWorksSection() {
  return (
    <section id="features" className="py-[calc(24px+4vh)]">
      <div className="mx-auto max-w-5xl px-6 space-y-20 md:space-y-28">
        {/* Step 1: Book */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16" data-animate>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Step 1 — Book</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Schedule your repair in under 2 minutes
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Pick your service, choose a date and time that works for you, and confirm your booking instantly. No phone
              calls, no waiting on hold. Our online system shows real-time availability so you always get the slot you
              need — whether it&apos;s a quick oil change or a full engine overhaul.
            </p>
          </div>
          <div
            className="relative rounded-2xl overflow-hidden h-80 md:h-96 flex items-center justify-center p-6 bg-black"
            data-fade-bg
          >
            <div
              className="absolute inset-0 transition-opacity duration-100"
              style={{ background: "url('/image/flo/floral1.webp') center/cover no-repeat", opacity: 0.9 }}
            />
            <div className="relative w-full max-w-65">
              <div className="rounded-2xl bg-background p-5 border border-white/10">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-semibold text-gray-100">New Booking</span>
                  <span className="text-[10px] text-gray-500">Live slots</span>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      color: "emerald",
                      label: "Oil Change",
                      detail: "Thu 9:00 AM",
                      suffix: "confirmed",
                      time: "Just now",
                    },
                    {
                      color: "blue",
                      label: "Brake Inspection",
                      detail: "Fri 11:00 AM",
                      suffix: "",
                      time: "2 min ago",
                      mono: true,
                    },
                    { color: "amber", label: "Tire Rotation", detail: "pending", suffix: "", time: "5 min ago" },
                    { color: "violet", label: "Engine Diagnostic", detail: "#BK-441", suffix: "", time: "10 min ago" },
                  ].map(({ color, label, detail, suffix, time, mono }) => (
                    <div key={time} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 h-5 w-5 rounded-full bg-${color}-500/10 flex items-center justify-center shrink-0`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full bg-${color}-500`} />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-200">
                          {label}{" "}
                          <span
                            className={
                              mono ? "font-mono text-[10px] bg-white/10 rounded px-1" : "text-gray-500 font-normal"
                            }
                          >
                            {detail}
                          </span>
                          {suffix && ` ${suffix}`}
                        </p>
                        <p className="text-[9px] text-gray-500 mt-0.5">{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Track */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16" data-animate>
          <div
            className="relative rounded-2xl overflow-hidden h-80 md:h-96 flex items-center justify-center p-6 lg:order-0 order-last bg-black"
            data-fade-bg
          >
            <div
              className="absolute inset-0 transition-opacity duration-100"
              style={{ background: "url('/image/flo/floral3.webp') center/cover no-repeat", opacity: 0.9 }}
            />
            <div className="relative w-full max-w-65">
              <div className="rounded-2xl bg-background p-5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-gray-100">Repair Status</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                    In Progress
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-100 tracking-tight">
                  68<span className="text-lg text-gray-500">%</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-1">Est. ready by 3:30 PM</p>
                <div className="mt-4 flex gap-0.75">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-6 w-full rounded-sm ${i < 9 ? "bg-emerald-500" : i === 9 ? "bg-amber-400" : "bg-white/10"}`}
                    />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { value: "1.5h", label: "Time in" },
                    { value: "3", label: "Parts used" },
                    { value: "0", label: "Issues found" },
                  ].map(({ value, label }) => (
                    <div key={label} className="rounded-lg bg-white/5 p-2 text-center">
                      <p className="text-xs font-bold text-gray-100">{value}</p>
                      <p className="text-[9px] text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Step 2 — Track</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Watch your repair happen in real time
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              No more wondering what&apos;s happening to your car. Our live tracking dashboard shows every step of the
              repair — what&apos;s been done, what&apos;s next, and exactly when your vehicle will be ready. We send SMS
              updates at every milestone so you&apos;re never left guessing.
            </p>
          </div>
        </div>

        {/* Step 3: Pick Up */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16" data-animate>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Step 3 — Pick Up</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Drive away with a full report & warranty
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every repair comes with a detailed post-service report, photos of replaced parts, and a 12-month /
              12,000-mile warranty. Pay online or at pickup — no pressure, no hidden fees. And unlike most shops, we
              follow up with a free inspection check at 30 days to make sure everything&apos;s still perfect.
            </p>
          </div>
          <div
            className="relative rounded-2xl overflow-hidden h-80 md:h-96 flex items-center justify-center p-6 bg-black"
            data-fade-bg
          >
            <div
              className="absolute inset-0 transition-opacity duration-100"
              style={{ background: "url('/image/flo/floral4.webp') center/cover no-repeat", opacity: 0.9 }}
            />
            <div className="relative w-full max-w-65">
              <div className="rounded-2xl bg-background p-5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-gray-100">Service Invoice</span>
                  <span className="text-[10px] text-gray-500">Jun 2026</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-100 tracking-tight">$285</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">No hidden fees</span>
                </div>
                <div className="mt-4 h-3 w-full rounded-full bg-white/10 flex overflow-hidden">
                  <div className="h-full bg-white rounded-l-full" style={{ width: "42%" }} />
                  <div className="h-full bg-gray-400" style={{ width: "30%" }} />
                  <div className="h-full bg-gray-500" style={{ width: "18%" }} />
                  <div className="h-full bg-gray-600 rounded-r-full" style={{ width: "10%" }} />
                </div>
                <div className="mt-4 space-y-2.5">
                  {[
                    { color: "bg-white", label: "Labor", amount: "$120" },
                    { color: "bg-gray-400", label: "Parts", amount: "$85" },
                    { color: "bg-gray-500", label: "Fluids", amount: "$52" },
                    { color: "bg-gray-600", label: "Disposal", amount: "$28" },
                  ].map(({ color, label, amount }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${color}`} />
                        <span className="text-[10px] text-gray-400">{label}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-100">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mechanics Section
// ─────────────────────────────────────────────────────────────────────────────

function MechanicCard({ mechanic, offset }: { mechanic: Mechanic; offset: "up" | "down" }) {
  return (
    <div className={offset === "up" ? "md:pt-12" : "md:pb-12"}>
      <div className="rounded-2xl bg-black overflow-hidden">
        <div className="bg-white aspect-square overflow-hidden">
          <Image
            src={mechanic.image}
            alt={mechanic.name}
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <Link href={mechanic.social} target="_blank" className="p-8 block md:p-10">
          <p className="text-sm font-semibold text-white">{mechanic.name}</p>
          <p className="text-sm text-white/50">{mechanic.role}</p>
          <p className="mt-3 text-sm text-white/50 leading-relaxed">{mechanic.bio}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
            <FacebookIcon className="h-4 w-4" />
            Facebook
          </div>
        </Link>
      </div>
    </div>
  );
}

function MechanicsSection() {
  return (
    <section id="team">
      <div className="mx-auto px-6" style={{ maxWidth: 1152 }}>
        <div className="relative rounded-2xl py-[calc(48px+8vh)] px-6 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: "url('/image/flo/floral5.webp') center/cover no-repeat" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)" }}
          />
          <div className="relative mx-auto max-w-5xl">
            <div className="px-6 md:px-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Meet your mechanics</h2>
                    <p className="mt-4 text-white/70 leading-relaxed">
                      A master technician who speaks fluent engine and a service director who rebuilt how shops run.
                      Different strengths, one standard: fix it right the first time.
                    </p>
                  </div>
                </div>
                {mechanics.map((mechanic, i) => (
                  <MechanicCard key={mechanic.name} mechanic={mechanic} offset={i === 0 ? "up" : "down"} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Export
// ─────────────────────────────────────────────────────────────────────────────

export default function PageSectionOne() {
  return (
    <>
      <AboutSection />
      <TrustBar />
      <HowItWorksSection />
      <MechanicsSection />
    </>
  );
}
