"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Loader2,
  ChevronDown,
  FolderOpen,
} from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { serviceService } from "@/services/booking/service.service";
import { serviceSlotService } from "@/services/booking/service-slot.service";
import { locationService } from "@/services/booking/location.service";
import { bookingService } from "@/services/booking/booking.service";
import { categoryService } from "@/services/booking/category.service";

import { ServiceDTO } from "@/types/booking/service-type";
import { LocationDTO } from "@/types/booking/location-type";
import { ServiceSlotDTO } from "@/types/booking/service-slot-type";
import { CategoryDTO } from "@/types/booking/category-type";

const STEPS = [
  { id: 1, title: "Service", icon: Briefcase },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Date", icon: CalendarIcon },
  { id: 4, title: "Time", icon: Clock },
  { id: 5, title: "Notes", icon: FileText },
];

export default function CreateBookingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Data states
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [slots, setSlots] = useState<ServiceSlotDTO[]>([]);

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [slotId, setSlotId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  // Accordion state
  const [openCategories, setOpenCategories] = useState<number[]>([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      const [allServices, allCategories] = await Promise.all([serviceService.getAll(), categoryService.getAll()]);
      setServices(allServices);
      setCategories(allCategories);
    };
    loadData();
  }, []);

  /* ================= HANDLERS ================= */
  const toggleCategory = (categoryId: number) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  const handleServiceChange = async (id: number) => {
    setServiceId(id);
    setLocationId(null);
    setDate("");
    setSlotId(null);
    setSlots([]);

    const allSlots = await serviceSlotService.getAll();
    const locationIds = allSlots
      .filter((s) => s.serviceId === id)
      .map((s) => s.locationId)
      .filter((v, i, a) => a.indexOf(v) === i);

    const allLocations = await locationService.getAll();
    setLocations(allLocations.filter((l) => locationIds.includes(l.id)));
  };

  const handleLocationChange = (id: number) => {
    setLocationId(id);
    setDate("");
    setSlotId(null);
    setSlots([]);
  };

  const handleDateChange = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    // FIXED: Lấy đúng ngày local mà không bị lệch timezone
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    setDate(dateStr);
    setSlotId(null);

    if (!serviceId || !locationId) return;

    const allSlots = await serviceSlotService.getAll();
    setSlots(
      allSlots.filter((s) => s.serviceId === serviceId && s.locationId === locationId && s.slotDate === dateStr),
    );
  };
  const handleSubmit = async () => {
    if (!slotId) return;
    setIsSubmitting(true);
    try {
      await bookingService.create({ slotId, note });
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    router.push("/");
  };

  // Computed values
  const selectedService = services.find((s) => s.id === serviceId);
  const selectedLocation = locations.find((l) => l.id === locationId);
  const selectedSlot = slots.find((s) => s.id === slotId);

  const groupedServices = useMemo(() => {
    const map = new Map<number, ServiceDTO[]>();
    services.forEach((service) => {
      const catId = (service as any).categoryId ?? 0;
      if (!map.has(catId)) map.set(catId, []);
      map.get(catId)!.push(service);
    });
    return map;
  }, [services]);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!serviceId;
      case 2:
        return !!locationId;
      case 3:
        return !!date;
      case 4:
        return !!slotId;
      case 5:
        return true;
      default:
        return false;
    }
  }, [currentStep, serviceId, locationId, date, slotId]);

  // Success Screen
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="mb-2   font-semibold">Booking Confirmed!</h1>
              <p className="mb-8 text-muted-foreground">Your appointment has been successfully scheduled.</p>

              <div className="mb-8 w-full max-w-sm space-y-4 rounded-lg border border-border bg-secondary/30 p-6 text-left">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <div className="  text-muted-foreground">Service</div>
                    <div className="font-medium">{selectedService?.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="  text-muted-foreground">Location</div>
                    <div className="font-medium">{selectedLocation?.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="  text-muted-foreground">Date & Time</div>
                    <div className="font-medium">
                      {date} • {selectedSlot?.startTime} - {selectedSlot?.endTime}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-border px-6 py-2 font-medium transition hover:bg-accent"
                >
                  Book Another Appointment
                </button>
                <button
                  onClick={() => router.push("/my-bookings")}
                  className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition hover:opacity-90"
                >
                  View My Appointments
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className=" text-xl font-semibold tracking-tight">Book an Appointment</h1>
          <p className="mt-2 text-muted-foreground">Complete the steps below to schedule your appointment.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-4 overflow-hidden rounded-lg border border-border bg-card px-6 py-2">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <button
                    onClick={() => isCompleted && setCurrentStep(step.id)}
                    className={cn("flex flex-col items-center gap-2 transition", isCompleted && "cursor-pointer")}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full border-2 transition",
                        isCompleted && "border-primary bg-primary text-primary-foreground",
                        isCurrent && "border-primary bg-secondary text-primary",
                        !isCompleted && !isCurrent && "border-border bg-background text-muted-foreground",
                      )}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className={cn("  font-medium", isCurrent && "text-primary")}>{step.title}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={cn("mx-4 h-0.5 flex-1", isCompleted ? "bg-primary" : "bg-border")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {/* Step 1: Service with Category Accordion */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg  font-semibold">Select Service</h2>
                      <p className="text-muted-foreground">Choose a category and then select the service</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {categories.map((category) => {
                      const categoryServices = groupedServices.get(category.id) || [];
                      const isOpen = openCategories.includes(category.id);

                      return (
                        <div key={category.id} className="border border-border rounded-xl overflow-hidden bg-card">
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="w-full flex items-center justify-between p-5 py-3 hover:bg-accent/50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <FolderOpen className="h-5 w-5 text-primary" />
                              <span className="font-semibold">{category.name}</span>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 text-muted-foreground transition-transform duration-300",
                                isOpen && "rotate-180",
                              )}
                            />
                          </button>

                          {/* Slide Animation */}
                          <div
                            className={cn(
                              "overflow-hidden transition-all duration-300 ease-out",
                              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                            )}
                          >
                            <div className="p-5 pt-1 bg-muted/30 space-y-3">
                              {categoryServices.length > 0 ? (
                                categoryServices.map((service) => (
                                  <button
                                    key={service.id}
                                    onClick={() => handleServiceChange(service.id)}
                                    className={cn(
                                      "w-full rounded-xl border p-4 text-left transition-all hover:shadow-sm",
                                      serviceId === service.id
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                                        : "border-border hover:border-primary/40 hover:bg-accent",
                                    )}
                                  >
                                    <div className="font-medium">{service.name}</div>
                                    {service.description && (
                                      <div className="  text-muted-foreground mt-1 line-clamp-2">
                                        {service.description}
                                      </div>
                                    )}
                                  </button>
                                ))
                              ) : (
                                <p className="text-muted-foreground text-center py-6">
                                  No services available in this category.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg  font-semibold">Select Location</h2>
                      <p className="text-muted-foreground">Choose your preferred center</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {locations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => handleLocationChange(loc.id)}
                        className={cn(
                          "w-full flex items-start gap-4 rounded-lg border border-border p-4 text-left transition",
                          locationId === loc.id
                            ? "border-accent bg-primary/5 ring-2 ring-primary/30"
                            : "hover:border-primary/50 hover:bg-accent",
                        )}
                      >
                        <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                        <div>
                          <div className="font-medium">{loc.name}</div>
                          <div className="  text-muted-foreground">{loc.address}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Date */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg  font-semibold">Select Date</h2>
                      <p className="text-muted-foreground">Choose your preferred date</p>
                    </div>
                  </div>
                  <div className="flex justify-center p-4">
                    <Calendar
                      mode="single"
                      selected={date ? new Date(date + "T00:00:00") : undefined} // Fix timezone
                      onSelect={handleDateChange}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} // Disable today and before
                      className="rounded-lg w-60 border"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Time Slot */}
              {/* Step 4: Time Slot */}
              {currentStep === 4 && (
                <div>
                  <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Select Time Slot</h2>
                      <p className="text-muted-foreground">Date: {date}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      {slots.map((slot) => {
                        const remaining = slot.maxCapacity - slot.bookedCount;
                        const isFull = remaining <= 0;
                        const isSelected = slotId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => !isFull && setSlotId(slot.id)}
                            disabled={isFull}
                            className={cn(
                              "rounded-lg flex flex-col justify-center items-center border border-border p-4 text-left transition-all duration-200 relative",
                              isSelected && !isFull
                                ? "ring-primary! ring-1"
                                : isFull
                                  ? "border-red-200 bg-red-50/70 text-red-400 cursor-not-allowed opacity-75 line-through"
                                  : "border-border hover:border-primary/50 hover:bg-accent hover:shadow-sm",
                            )}
                          >
                            <div className="font-medium">
                              {slot.startTime.slice(0, 5)}
                              {/* {slot.startTime} - {slot.endTime} */}
                            </div>

                            <div className="mt-2 flex items-center justify-between text-sm">
                              {isFull ? (
                                <span className="font-medium text-red-500"></span>
                              ) : remaining <= 3 ? (
                                <span className="font-medium text-amber-500">Only {remaining} left</span>
                              ) : (
                                <span className="text-muted-foreground">{remaining} slots left</span>
                              )}
                            </div>

                            {/* Optional: Full badge */}
                            {isFull && (
                              <div className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest bg-red-500 text-white px-2 py-0.5 rounded">
                                FULL
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {slots.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No available time slots for this date.</p>
                    )}
                  </div>
                </div>
              )}
              {/* Step 5: Notes */}
              {currentStep === 5 && (
                <div>
                  <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="  font-semibold">Additional Notes</h2>
                      <p className="text-muted-foreground">Any special requests or information (optional)</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Enter symptoms, special requirements, or any other notes..."
                      className="w-full min-h-35 rounded-lg border border-border bg-background p-4 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 rounded-lg border px-5 py-2 hover:bg-accent disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {currentStep < 5 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={!canProceed}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground disabled:opacity-50"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!slotId || isSubmitting}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg border border-border bg-card">
              <div className="p-6 border-b">
                <h2 className="font-semibold">Booking Summary</h2>
              </div>
              <div className="p-6 space-y-5  ">
                <div>
                  <div className="text-muted-foreground">Service</div>
                  <div className="font-medium mt-1">{selectedService?.name || "---"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Location</div>
                  <div className="font-medium mt-1">{selectedLocation?.name || "---"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Date</div>
                  <div className="font-medium mt-1">{date || "---"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Time</div>
                  <div className="font-medium mt-1">
                    {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : "---"}
                  </div>
                </div>
                {note && (
                  <div>
                    <div className="text-muted-foreground">Notes</div>
                    <div className="mt-1  ">{note}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
