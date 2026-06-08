"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, Tag, Wrench, CheckCircle, Phone, Calendar } from "lucide-react";
import { ServiceDTO } from "@/types/booking/service-type";
import { serviceService } from "@/services/booking/service.service";
import { use } from "react";
// ─── Mock fetch (replace with your actual API call) ────────────────────────
async function fetchService(id: string): Promise<ServiceDTO> {
  return await serviceService.getBySlug(id);
}

// ─── What's Included (static fallback UI) ─────────────────────────────────
const DEFAULT_INCLUDES = [
  "Full diagnostic scan & report",
  "Genuine or OEM-grade parts",
  "ASE-certified technician",
  "12-month / 12,000-mile warranty",
  "Post-service photo report",
  "Free 30-day follow-up check",
];

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [service, setService] = useState<ServiceDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  useEffect(() => {
    fetchService(id)
      .then(setService)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ServiceSkeleton />;
  if (!service) return <ServiceNotFound />;

  const primaryImage = service.images?.[0]?.url ?? null;
  const galleryImages = service.images?.slice(1) ?? [];

  return (
    <main className="bg-background min-h-screen">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background image or gradient */}
        {primaryImage ? (
          <>
            <div className="absolute inset-0">
              <Image src={primaryImage} alt={service.name} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-background" />
        )}

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8 animate-fade-in">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <div className="hover:text-foreground transition-colors">Services</div>
            {service.categoryName && (
              <>
                <span>/</span>
                <Link href={`/category/${service.slug}`} className="hover:text-foreground transition-colors">
                  {service.categoryName}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">{service.name}</span>
          </div>

          <div className="max-w-3xl">
            {/* Category badge */}
            {service.categoryName && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur-sm text-xs font-medium text-muted-foreground mb-6">
                <Tag className="w-3 h-3" />
                {service.categoryName}
              </div>
            )}

            <h1
              className="text-5xl md:text-7xl font-black text-foreground leading-[0.95] tracking-tighter mb-6"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {service.name}
            </h1>

            {service.description && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10">
                {service.description}
              </p>
            )}

            {/* Price + duration */}
            <div className="flex flex-wrap items-center gap-6 mb-10">
              <div className="text-center">
                <div
                  className="text-3xl font-black text-foreground"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  ${service.price.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Starting from</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{service.durationMinutes} minutes</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/appoinment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-bold text-base hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 group"
              >
                <Calendar className="w-4 h-4" />
                Book This Service
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href="tel:+84764938610"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-border text-foreground font-medium text-base hover:border-foreground/30 hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: content + gallery */}
          <div className="lg:col-span-2 space-y-16">
            {/* Rich content */}
            {service.content && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">About</p>
                <h2
                  className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-6"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  What we do,
                  <br />
                  <em className="font-normal text-muted-foreground">explained clearly.</em>
                </h2>
                <div
                  className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
              </div>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Gallery</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryImages.map((img, i) => (
                    <div
                      key={img.id ?? i}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border group"
                    >
                      <Image
                        src={img.url}
                        alt={img.description ?? `${service.name} photo ${i + 2}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: sticky info card */}
          <aside className="lg:sticky lg:top-8 lg:self-start space-y-6">
            {/* What's included */}
            <div className="border border-border rounded-2xl p-6 bg-card">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-bold text-foreground">What's included</span>
              </div>
              <ul className="space-y-3">
                {DEFAULT_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing summary */}
            <div className="border border-border rounded-2xl p-6 bg-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Pricing</p>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm   text-muted-foreground">{service.name}</span>
                <span className="text-base font-bold text-foreground">${service.price.toLocaleString()}</span>
              </div>
              <div className="h-px bg-border my-4" />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
                <Clock className="w-3 h-3" />
                Estimated time: {service.durationMinutes} min
              </div>
              <Link
                href="/appoinment"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 group"
              >
                Book Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* Back */}
            <Link
              href="/#services"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to all services
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────
function ServiceSkeleton() {
  return (
    <main className="bg-background min-h-screen animate-pulse">
      <div className="h-[420px] bg-muted" />
      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-10 w-2/3 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    </main>
  );
}

// ─── Not Found ─────────────────────────────────────────────────────────────
function ServiceNotFound() {
  return (
    <main className="bg-background min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">404</p>
        <h1
          className="text-4xl md:text-5xl font-black text-foreground mb-4"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Service not
          <br />
          <em className="font-normal text-muted-foreground">found.</em>
        </h1>
        <p className="text-muted-foreground mb-8">This service doesn't exist or may have been removed.</p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-bold hover:opacity-90 hover:scale-105 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          View All Services
        </Link>
      </div>
    </main>
  );
}
