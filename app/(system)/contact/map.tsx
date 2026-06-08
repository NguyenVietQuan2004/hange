"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { MapPin, Phone, Clock3, ChevronRight, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocationDTO } from "@/types/booking/location-type";
import { locationService } from "@/services/booking/location.service";

import { toast } from "sonner";
import { div } from "framer-motion/client";

export default function StoreLocatorPage({ data, loading }: { data: LocationDTO[] | []; loading: boolean }) {
  const [selectedLocation, setSelectedlocation] = useState<LocationDTO | null>(() =>
    data.length > 0 ? data[0] : null,
  );

  useEffect(() => {
    if (data.length > 0 && !selectedLocation) {
      setSelectedlocation(data[0]);
    }
  }, [data, selectedLocation]);

  return (
    <section className="bg-background pt-20 pb-6 md:pb-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10" id="find">
          <h1 className="text-3xl font-bold tracking-tight">Find a Store</h1>

          <p className="mt-3 text-muted-foreground">Enter your zip code to find the nearest location.</p>
        </div>

        {/* Search */}
        <div className="mb-8 flex max-w-xl gap-3">
          <Input disabled={loading} placeholder="Enter zip code or city" className="h-10 ring-0!" />

          <Button disabled={loading} className="h-10 px-6">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-[440px_1fr]">
          {/* Store List */}
          <div className="space-y-5">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl  bg-card p-6">
                  <Skeleton className="h-6 w-40" />

                  <div className="mt-6 space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-5 w-32" />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {data.map((location) => (
                  <div
                    key={location.id}
                    onClick={() => setSelectedlocation(location)}
                    className={`cursor-pointer rounded-2xl border bg-card p-6 transition-all duration-300  hover:brightness-[0.98] ${
                      selectedLocation?.id === location.id ? "border-foreground brightness-[0.98]" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className=" font-semibold">{location.name}</h3>

                        {/* <p className="mt-2 text-muted-foreground">{"None distance"}</p> */}
                      </div>

                      <ChevronRight className=" min-h-5 min-w-5 text-muted-foreground" />
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex gap-3">
                        <MapPin className="mt-0.5 aspect-square w-5 h-5 min-h-5 min-w-5 max-w-5 max-h-5 text-muted-foreground" />

                        <div>
                          <p>{location.address}</p>
                          {/* <p className="text-muted-foreground">{"none city"}</p> */}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone className=" w-5 h-5 min-h-5 min-w-5 max-w-5 max-h-5 aspect-square text-muted-foreground" />
                        <span>{location.phone}</span>
                      </div>

                      <div className="flex gap-3">
                        <Clock3 className=" w-5 h-5 min-h-5 min-w-5 max-w-5 max-h-5 aspect-square text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {location.openTime} - {location.closeTime}{" "}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button variant="outline">Get Directions</Button>

                      <Button variant="outline">Call Store</Button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {!loading && data.length === 0 && (
              <div className="rounded-2xl border border-dashed p-10 text-center">
                <MapPin className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />

                <h3 className="font-medium">No locations found</h3>

                <p className="mt-2 text-sm text-muted-foreground">There are currently no available store locations.</p>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {selectedLocation?.mapEmbedUrl && (
              <iframe
                src={selectedLocation?.mapEmbedUrl}
                width="100%"
                height="100%"
                className="min-h-175"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
