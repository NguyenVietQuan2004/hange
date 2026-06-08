"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, Wrench, Layers, Search } from "lucide-react";
import { ServiceDTO } from "@/types/booking/service-type";
import { CategoryDTO } from "@/types/booking/category-type";
import { categoryService } from "@/services/booking/category.service";
import { useMasterDataStore } from "@/app/store/master-data-store";
import { useShallow } from "zustand/react/shallow";

// ─── Mock fetch (replace with your actual API calls) ───────────────────────
async function fetchCategory(id: string): Promise<CategoryDTO> {
  return await categoryService.getBySlug(id);
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [category, setCategory] = useState<CategoryDTO | null>(null);
  const [servicesOfCate, setServicesOfCate] = useState<ServiceDTO[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { id: slug } = use(params);
  const services = useMasterDataStore(useShallow((state) => state.services));

  useEffect(() => {
    fetchCategory(slug)
      .then((cat) => {
        setCategory(cat);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!category) return;

    setServicesOfCate(services.filter((item) => Number(item.categoryId) === Number(category.id)));
  }, [services, category]);
  const filtered = servicesOfCate.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });
  if (loading) return <CategorySkeleton />;
  if (!category) return <CategoryNotFound />;

  const heroImage = category.images?.[0]?.url ?? null;

  return (
    <main className="bg-background min-h-screen">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {heroImage ? (
          <div className="absolute inset-0">
            <Image src={heroImage} alt={category.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-muted to-background" />
        )}

        {/* Decorative rings */}
        <div className="absolute -top-40 -right-40 w-125 h-125 rounded-full border border-border/30 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border border-border/20 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <div className="hover:text-foreground transition-colors">Categories</div>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur-sm text-xs font-medium text-muted-foreground mb-6">
            <Layers className="w-3 h-3" />
            Category
          </div>

          <h1
            className="text-5xl md:text-7xl font-black text-foreground leading-[0.95] tracking-tighter mb-6 max-w-3xl"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {category.name}
            <br />
            <em className="font-normal text-muted-foreground">services.</em>
          </h1>

          {category.description && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10">
              {category.description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{servicesOfCate.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5 tracking-wide uppercase">Services</div>
            </div>
            {servicesOfCate.length > 0 && (
              <>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    ${Math.min(...servicesOfCate.map((s) => s.price)).toLocaleString()}+
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 tracking-wide uppercase">Starting from</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {Math.min(...servicesOfCate.map((s) => s.durationMinutes))}min
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 tracking-wide uppercase">Fastest service</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Rich content (if any) ─────────────────────── */}
      {category.content && (
        <section className="max-w-6xl mx-auto px-6 pt-20">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Overview</p>
              <h2
                className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-6"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Everything you need to
                <br />
                <em className="font-normal text-muted-foreground">know.</em>
              </h2>
              <div
                className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: category.content }}
              />
            </div>

            {/* Gallery from category images */}
            {(category.images?.length ?? 0) > 1 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Photos</p>
                <div className="grid grid-cols-2 gap-2">
                  {category.images!.slice(1, 5).map((img, i) => (
                    <div
                      key={img.id ?? i}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border group"
                    >
                      <Image
                        src={img.url}
                        alt={img.description ?? `${category.name} photo ${i + 2}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Services grid ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Header + search */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Services</p>
            <h2
              className="text-4xl md:text-5xl font-black text-foreground leading-tight"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Available
              <br />
              <em className="font-normal text-muted-foreground">services.</em>
            </h2>
          </div>

          {/* Search */}
          <div className="relative sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-border/60 transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Wrench className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="text-sm">No services found{search ? ` for "${search}"` : ""}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i} />
            ))}
          </div>
        )}

        {/* Back */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to all services
          </Link>
        </div>
      </section>
    </main>
  );
}

// ─── Service Card ──────────────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: ServiceDTO; index: number }) {
  const thumb = service.images?.[0]?.url ?? null;

  return (
    <Link
      href={`/service/${service.id}`}
      className={`group relative border border-border rounded-2xl overflow-hidden hover:bg-accent hover:border-border/60 transition-all duration-300 card-hover `}
    >
      {/* Thumbnail */}
      {thumb ? (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={thumb}
            alt={service.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      ) : (
        <div className="h-44 bg-muted flex items-center justify-center">
          <Wrench className="w-8 h-8 text-muted-foreground/30" />
        </div>
      )}

      {/* Body */}
      <div className="p-6">
        {/* Number watermark */}
        <div className="absolute top-3 right-4 text-4xl font-black text-muted-foreground/10 select-none leading-none group-hover:text-muted-foreground/20 transition-colors duration-300">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="text-base font-bold text-foreground mb-1">{service.name}</div>
        {service.description && (
          <div className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">{service.description}</div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">${service.price.toLocaleString()}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {service.durationMinutes} mins
          </div>
        </div>
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300">
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </Link>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <main className="bg-background min-h-screen animate-pulse">
      <div className="h-[420px] bg-muted" />
      <div className="max-w-6xl mx-auto px-6 py-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted" />
        ))}
      </div>
    </main>
  );
}

// ─── Not Found ─────────────────────────────────────────────────────────────
function CategoryNotFound() {
  return (
    <main className="bg-background min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">404</p>
        <h1
          className="text-4xl md:text-5xl font-black text-foreground mb-4"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Category not
          <br />
          <em className="font-normal text-muted-foreground">found.</em>
        </h1>
        <p className="text-muted-foreground mb-8">This category doesn't exist or may have been removed.</p>
        <Link
          href="/#services"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-bold hover:opacity-90 hover:scale-105 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          View All Services
        </Link>
      </div>
    </main>
  );
}
