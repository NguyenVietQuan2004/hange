"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { LocationDTO } from "@/types/booking/location-type";
import { locationService } from "@/services/booking/location.service";

import { Mail, Phone, Globe } from "lucide-react";
import { toast } from "sonner";
import ContactFormCard from "./form";
import StoreLocatorPage from "./map";
import { useMasterDataStore } from "@/app/store/master-data-store";
import { useShallow } from "zustand/react/shallow";
const socialLinks = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com",
    label: "Twitter",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  const { locations, loadingLocations } = useMasterDataStore(
    useShallow((state) => ({
      locations: state.locations,
      loadingLocations: state.loadingLocations,
    })),
  );

  return (
    <section className="bg-background md:py-10">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">Contact Us</h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Have a question about our services, pricing, appointments, or business partnerships? Send us a message and
            our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          <div className="space-y-14 border-border lg:border-r lg:pr-12">
            <div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">Corporate office</h3>

              {loadingLocations ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading address...</span>
                </div>
              ) : (
                locations.length > 0 && (
                  <div className="leading-8 text-muted-foreground">
                    <div className="flex items-start gap-1">{locations[0].address}</div>
                  </div>
                )
              )}
            </div>

            <div>
              <h3 className="mb-5 text-xl font-semibold text-foreground">Get in touch</h3>

              <div className="space-y-5">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5" />

                  {loadingLocations ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    locations.length > 0 && <span>{locations[0].phone}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5 min-w-5 min-h-5 aspect-square max-h-5 max-w-5" />
                  <span>nguyenvietquan.30032004@gmail.com</span>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Globe className="h-5 w-5" />
                  <span>hange.io.vn</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-xl font-semibold text-foreground">Follow us</h3>

              <div className="flex gap-5 text-muted-foreground">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className=" transition-all duration-300 hover:text-foreground"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <ContactFormCard />
        </div>
      </div>

      <StoreLocatorPage data={locations} loading={loadingLocations} />
    </section>
  );
}
