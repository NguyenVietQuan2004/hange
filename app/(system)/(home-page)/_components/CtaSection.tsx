import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export default function CtaSection() {
  return (
    // <section className="bg-muted px-6 py-28">
    <section
      className="py-28 px-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/image/flo/floral5.webp')",
      }}
    >
      <div className="max-w-4xl mx-auto text-center animate-on-scroll">
        <div className="border border-border rounded-3xl bg-card px-8 py-20 relative overflow-hidden">
          {/* Decorative rings — animated float */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-border pointer-events-none animate-float-slow" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-border pointer-events-none animate-float" />

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Get Started</p>
          <h2
            className="text-4xl md:text-6xl font-black text-foreground leading-tight mb-5"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Ready to get your
            <br />
            <em className="font-normal text-muted-foreground">car fixed right?</em>
          </h2>
          <p className="text-base text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
            Book in under 2 minutes. No account needed. Cancel anytime. Full warranty on every repair.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/appoinment"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-foreground text-background font-bold text-base hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 group"
            >
              Book an Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href="tel:+84764938610"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full border border-border text-foreground font-medium text-base hover:border-foreground/30 hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
