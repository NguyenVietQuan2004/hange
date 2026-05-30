// app/(admin)/locations/[slug]/page.tsx

"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { locationService } from "@/services/booking/location.service";

import { LocationDTO } from "@/types/booking/location-type";

import LocationForm from "../_components/location-form";

export default function LocationDetailPage() {
  const params = useParams();

  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState<LocationDTO | null>(null);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const data = await locationService.getBySlug(slug);

      setLocation(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!location) {
    return <div className="p-10 text-center">Location not found</div>;
  }

  return <LocationForm mode="update" initialData={location} />;
}
