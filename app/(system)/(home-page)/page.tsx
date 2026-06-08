"use client";

import { useEffect } from "react";

import HeroSection from "./_components/HeroSection";
import TrustBarSection from "./_components/TrustBarSection";
import ServicesSection from "./_components/ServicesSection";
import HowItWorksSection from "./_components/HowItWorksSection";
import StatsSection from "./_components/StatsSection";
import TestimonialsSection from "./_components/TestimonialsSection";
import LocationsSection from "./_components/LocationsSection";
import CtaSection from "./_components/CtaSection";
import { useMasterDataStore } from "@/app/store/master-data-store";
import { useShallow } from "zustand/react/shallow";

function useScrollReveal() {
  const { services, categories, locations } = useMasterDataStore(
    useShallow((state) => ({
      services: state.services,
      locations: state.locations,
      categories: state.categories,
    })),
  );

  useEffect(() => {
    const els = document.querySelectorAll(".animate-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [services, categories, locations]);
}

export default function LandingPage() {
  useScrollReveal();

  return (
    <div className="bg-background">
      <HeroSection />
      <TrustBarSection />
      <ServicesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <LocationsSection />
      <CtaSection />
    </div>
  );
}
