"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { serviceService } from "@/services/booking/service.service";

import { ServiceDTO } from "@/types/booking/service-type";

import ServiceForm from "../_components/service-form";
import { toast } from "sonner";
export default function ServiceDetailPage() {
  const params = useParams();

  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);

  const [service, setService] = useState<ServiceDTO | null>(null);

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const data = await serviceService.getBySlug(slug);

      setService(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!service) {
    return <div className="p-10 text-center">Service not found</div>;
  }

  return <ServiceForm mode="update" initialData={service} />;
}
