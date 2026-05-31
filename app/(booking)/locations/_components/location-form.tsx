"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useForm } from "react-hook-form";

import { ArrowLeft, Save, MapPin, FileText, Clock3, LocationEdit } from "lucide-react";

import { LocationDTO, CreateLocationRequest, UpdateLocationRequest } from "@/types/booking/location-type";

import { locationService } from "@/services/booking/location.service";

type Props = {
  mode: "create" | "update";

  initialData?: LocationDTO;
};

type FormValues = {
  name: string;

  slug: string;

  address: string;

  phone: string;

  mapEmbedUrl: string;

  openTime: string;

  closeTime: string;
};

export default function LocationForm({ mode, initialData }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",

      slug: initialData?.slug || "",

      address: initialData?.address || "",

      phone: initialData?.phone || "",

      mapEmbedUrl: initialData?.mapEmbedUrl || "",

      openTime: initialData?.openTime || "",

      closeTime: initialData?.closeTime || "",
    },
  });

  const openTime = watch("openTime");

  const closeTime = watch("closeTime");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",

        slug: initialData.slug || "",

        address: initialData.address || "",

        phone: initialData.phone || "",

        mapEmbedUrl: initialData.mapEmbedUrl || "",

        openTime: initialData.openTime || "",

        closeTime: initialData.closeTime || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const payload: CreateLocationRequest | UpdateLocationRequest = {
        ...data,
      };

      if (mode === "create") {
        await locationService.create(payload as CreateLocationRequest);

        toast.success("Create location success");
      } else {
        await locationService.update(initialData!.id, payload as UpdateLocationRequest);

        toast.success("Update location success");
      }

      router.push("/locations");
    } catch (error) {
      console.error(error);

      toast.error(mode === "create" ? "Create failed" : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary";

  const textareaClass =
    "w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            {/* <MapPin className="h-5 w-5 text-primary" /> */}

            <h1 className="text-xl font-bold tracking-[-1px]">
              {mode === "create" ? "Create Location" : "Update Location"}
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">Manage location information and working hours.</p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/locations")}
          className="flex items-center gap-2 self-start rounded-lg underline px-5 py-2.5 text-sm font-medium transition hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Locations
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* INFORMATION */}
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <LocationEdit className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold text-lg">Location Information</h2>
              <div className="text-muted-foreground">Basic details about this location</div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <label className="  mb-1 block text-sm font-medium">
                Location Name <span className="text-red-500">*</span>
              </label>

              <input
                {...register("name", {
                  required: true,
                })}
                className={inputClass}
                placeholder="Enter location name"
              />

              {errors.name && <p className="mt-2 text-xs text-red-500">Location name is required</p>}
            </div>

            <div>
              <label className="  mb-1 block text-sm font-medium">
                Slug <span className="text-red-500">*</span>
              </label>

              <input
                {...register("slug", {
                  required: true,
                })}
                className={inputClass}
                placeholder="Enter slug"
              />
              <p className="text-muted-foreground mt-1">
                URL-friendly version of the name. Will be auto-generated from the name.
              </p>
              {errors.slug && <p className="mt-2 text-xs text-red-500">Slug is required</p>}
            </div>

            <div>
              <label className="  mb-1 block text-sm font-medium">Address</label>

              <textarea rows={2} {...register("address")} className={textareaClass} placeholder="Enter address" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className="  mb-1 block text-sm font-medium">Phone</label>

                <input {...register("phone")} className={inputClass} placeholder="Enter phone number" />
              </div>

              <div>
                <label className="  mb-1 block text-sm font-medium">Map Embed URL</label>

                <input {...register("mapEmbedUrl")} className={inputClass} placeholder="Enter Google Map embed URL" />
              </div>
            </div>
          </div>
        </div>

        {/* WORKING HOURS */}
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <Clock3 className="h-5 w-5 text-primary" />

            <h2 className="font-semibold">Working Hours</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
            <div>
              <label className="  mb-1 block text-sm font-medium">Open Time</label>

              <input
                type="time"
                {...register("openTime", {
                  validate: (value) => {
                    if (!closeTime || !value) return true;

                    return value < closeTime || "Open time must be less than close time";
                  },
                })}
                className={inputClass}
              />

              {errors.openTime && <p className="mt-2 text-xs text-red-500">{errors.openTime.message}</p>}
            </div>

            <div>
              <label className="  mb-1 block text-sm font-medium">Close Time</label>

              <input
                type="time"
                {...register("closeTime", {
                  validate: (value) => {
                    if (!openTime || !value) return true;

                    return value > openTime || "Close time must be greater than open time";
                  },
                })}
                className={inputClass}
              />

              {errors.closeTime && <p className="mt-2 text-xs text-red-500">{errors.closeTime.message}</p>}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/locations")}
            className="rounded-lg border border-border px-6 py-2 h-fittext-sm font-medium transition hover:bg-accent"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 h-fit text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* <Save className="h-4 w-4" /> */}

            {loading ? "Processing..." : mode === "create" ? "Create Location" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
