"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactFormCard() {
  return (
    <section>
      <div className="mx-auto max-w-3xl md:px-6">
        <div className="rounded-lg border border-border bg-card p-4  md:p-6">
          {/* Header */}
          <div>
            <h2 className="font-bold text-foreground">Send us a message</h2>

            <p className="mt-3  text-muted-foreground">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          {/* Form */}
          <form className="mt-6 space-y-8">
            {/* Name */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block  font-semibold text-foreground">
                  First Name <span className="text-destructive">*</span>
                </label>

                <Input placeholder="John" className="h-10 ring-0!" />
              </div>

              <div>
                <label className="mb-3 block  font-semibold text-foreground">
                  Last Name <span className="text-destructive">*</span>
                </label>

                <Input placeholder="Doe" className="h-10 ring-0!" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-3 block   font-semibold text-foreground">
                Email Address <span className="text-destructive">*</span>
              </label>

              <Input type="email" placeholder="john@company.com" className="h-10 ring-0!" />
            </div>

            {/* Company */}
            <div>
              <label className="mb-3 block   font-semibold text-foreground">Company</label>

              <Input placeholder="Your Company" className="h-10 ring-0!" />
            </div>

            {/* Message */}
            <div>
              <label className="mb-3 block   font-semibold text-foreground">
                Message <span className="text-destructive">*</span>
              </label>

              <Textarea placeholder="Tell us about your project, goals, or how we can help..." className="ring-0!" />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <Checkbox id="terms" />

              <label htmlFor="terms" className="  leading-6 text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="font-semibold text-foreground hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-foreground hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <Button type="submit" className="h-12 w-full   font-semibold">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
