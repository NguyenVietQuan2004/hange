"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { bookingService } from "@/services/booking/booking.service";
import { BookingDTO } from "@/types/booking/booking-type";

import { ArrowLeft, Check, X, Ban } from "lucide-react";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDTO | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getById(id);
      setBooking(data);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    const data = await bookingService.getById(id);
    setBooking(data);
  };

  if (loading) {
    return <div className="p-10 text-center text-muted-foreground">Loading...</div>;
  }

  if (!booking) {
    return <div className="p-10 text-center text-muted-foreground">Booking not found</div>;
  }

  const isPending = booking.status === "PENDING";

  const statusStyle =
    booking.status === "CONFIRMED"
      ? "bg-green-50 text-green-700 border-green-200"
      : booking.status === "REJECTED" || booking.status === "CANCELLED"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-yellow-50 text-yellow-700 border-yellow-200";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Booking #{booking.id}</h1>
          <p className="text-sm text-muted-foreground">View booking information and status management</p>
        </div>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT CARD */}
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>

            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyle}`}>{booking.status}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Service</span>
            <span className="font-medium">{booking.serviceName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-medium">{booking.servicePrice?.toLocaleString()} ₫</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="font-medium">{booking.serviceDuration} min</span>
          </div>

          {/* LOCATION */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="font-medium">{booking.locationName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Address</span>
              <span className="text-right text-sm max-w-[60%] text-muted-foreground">{booking.locationAddress}</span>
            </div>
          </div>

          {/* USER INFO (NEW) */}
          {booking.userDTO && (
            <div className="border-t pt-4 space-y-3 flex gap-1">
              <div className="text-sm font-medium">User: </div>

              <div className="flex flex-col">
                <span className="font-medium">{booking.userDTO.fullName}</span>
                <span className="text-xs text-muted-foreground">{booking.userDTO.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CARD */}
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="font-medium">{booking.slotDate}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Time</span>
            <span className="font-medium">
              {booking.slotTimeStart} - {booking.slotTimeEnd}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="font-medium">{booking.createdAt}</span>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm text-muted-foreground mb-2">Note</div>
            <div className="text-sm text-foreground">{booking.note || "No note provided"}</div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      {isPending && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              await bookingService.confirm(booking.id);
              refresh();
            }}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <Check className="h-4 w-4" />
            Confirm
          </button>

          <button
            onClick={async () => {
              await bookingService.reject(booking.id);
              refresh();
            }}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <X className="h-4 w-4" />
            Reject
          </button>

          <button
            onClick={async () => {
              await bookingService.cancel(booking.id);
              refresh();
            }}
            className="flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-accent"
          >
            <Ban className="h-4 w-4" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
