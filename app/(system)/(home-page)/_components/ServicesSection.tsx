"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Wrench, Zap, Droplets, RotateCcw, Wind, Battery } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useMasterDataStore } from "@/app/store/master-data-store";

const icons = [Droplets, Wrench, Zap, RotateCcw, Wind, Battery];

export default function ServicesSection() {
  const { services } = useMasterDataStore(
    useShallow((state) => ({
      services: state.services,
    })),
  );

  return (
    <section id="services" className="bg-background py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-xl mb-16 animate-on-scroll">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Services</p>
          <h2
            className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Everything your
            <br />
            <em className="font-normal text-muted-foreground">car needs.</em>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            ASE-certified technicians. Transparent pricing. Same-day availability on most services.
          </p>
        </div>

        {/* Grid */}
        <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => {
            if (i > 5) return null;
            const IconComponent = icons[i];
            console.log(svc, i);
            return (
              <Link
                key={svc.id}
                href="/appoinment"
                className={`group relative border border-border rounded-2xl 
                  
                  p-6 hover:bg-accent hover:border-border/60 transition-all
                   duration-300 overflow-hidden card-hover animate-on-scroll  stagger-${Math.min(i + 1, 6)}`}
              >
                {/* Number watermark */}
                <div className="absolute top-4 right-5 text-5xl font-black text-muted-foreground/10 select-none leading-none group-hover:text-muted-foreground/20 transition-colors duration-300">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:bg-muted/80 group-hover:scale-110 transition-all duration-300">
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-base font-bold text-foreground mb-1">{svc.name}</div>
                <div className="text-sm text-muted-foreground leading-relaxed mb-5">{svc.description}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">From ${svc.price}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {svc.durationMinutes} mins
                  </div>
                </div>
                {/* Hover arrow */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center animate-on-scroll">
          <Link
            href="/appoinment"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-muted-foreground text-sm font-medium hover:border-foreground/30 hover:text-foreground hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-200 group"
          >
            Book Any Service
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
