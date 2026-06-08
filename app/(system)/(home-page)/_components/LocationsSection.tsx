import { useMasterDataStore } from "@/app/store/master-data-store";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";

export default function LocationsSection() {
  // const locations = [
  //   {
  //     name: "Downtown Center",
  //     address: "123 Main Street, Suite 100",
  //     hours: "Mon–Sat 7am–7pm",
  //     phone: "(123) 456-7890",
  //   },
  //   { name: "Westside Branch", address: "456 West Ave, Unit B", hours: "Mon–Fri 8am–6pm", phone: "(123) 456-7891" },
  //   { name: "Airport Service", address: "789 Airport Blvd, Bay 3", hours: "Daily 6am–10pm", phone: "(123) 456-7892" },
  // ];

  const { locations } = useMasterDataStore(
    useShallow((state) => ({
      locations: state.locations,
    })),
  );

  return (
    <section id="locations" className="bg-background py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16 animate-on-scroll">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Locations</p>
          <h2
            className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Find us
            <br />
            <em className="font-normal text-muted-foreground">near you.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {locations.map((loc, i) => {
            if (i > 2) return null;

            return (
              <div
                key={loc.name}
                className={`border border-border rounded-2xl p-6 bg-card hover:bg-accent hover:border-border/60 transition-all duration-300 group card-hover animate-on-scroll stagger-${i + 1}`}
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>

                <h3 className="text-base font-bold text-foreground mb-1">{loc.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{loc.address}</p>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {loc.openTime} - {loc.closeTime}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {loc.phone}
                  </div>
                </div>

                <Link
                  href="/contact#find"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group-hover:text-foreground/70 link-underline"
                >
                  Book at this location
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
