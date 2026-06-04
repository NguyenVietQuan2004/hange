"use client";
import { toast } from "sonner";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CalendarIcon,
  PlusIcon,
  CheckIcon,
  AlertCircleIcon,
  Loader2Icon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  LayersIcon,
  Trash2Icon,
  CheckCircle2Icon,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { serviceSlotService } from "@/services/booking/service-slot.service";
import { serviceService } from "@/services/booking/service.service";
import { locationService } from "@/services/booking/location.service";

import { ServiceDTO } from "@/types/booking/service-type";
import { LocationDTO } from "@/types/booking/location-type";
import { BulkCreateServiceSlotRequest, SlotItemDTO } from "@/types/booking/service-slot-type";

interface SlotDefinition extends SlotItemDTO {
  id: string;
}

// ============================================================
// Step Indicator
// ============================================================
function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { label: string; isComplete: boolean }[];
}) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = step.isComplete;

        return (
          <div key={step.label} className="flex items-center gap-2">
            {index > 0 && (
              <div className={`h-px w-6 transition-colors ${isComplete || isActive ? "bg-primary/50" : "bg-border"}`} />
            )}
            <Badge
              variant={isActive ? "default" : isComplete ? "secondary" : "outline"}
              className={`gap-1.5 transition-colors ${
                isComplete && !isActive ? "border-success/20 bg-success/10 text-success" : ""
              } rounded-sm`}
            >
              {isComplete && !isActive ? (
                <CheckCircle2Icon className="size-3" />
              ) : (
                <span className="size-4 text-center text-xs">{index + 1}</span>
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Location Selector
// ============================================================
function LocationSelector({
  locations,
  selectedLocationIds,
  onToggle,
  disabled,
}: {
  locations: LocationDTO[];
  selectedLocationIds: number[];
  onToggle: (locationId: number) => void;
  disabled?: boolean;
}) {
  if (locations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="   text-muted-foreground">No centers available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {locations.map((location) => {
        const isSelected = selectedLocationIds.includes(location.id);
        return (
          <label
            key={location.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
              isSelected ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:border-muted-foreground/30"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <Checkbox checked={isSelected} onCheckedChange={() => onToggle(location.id)} disabled={disabled} />
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4 text-muted-foreground" />
              <div>
                <p className="   font-medium text-foreground">{location.name}</p>
                {location.address && <p className="text-xs text-muted-foreground">{location.address}</p>}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}

// ============================================================
// Slot Row
// ============================================================
function SlotRow({
  slot,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  slot: SlotDefinition;
  index: number;
  onUpdate: (id: string, field: keyof Omit<SlotDefinition, "id">, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-1.5 transition-colors hover:border-muted-foreground/30">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary    font-medium text-secondary-foreground">
        {index + 1}
      </div>

      <div className="grid flex-1 grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Start Time</label>
          <Input
            type="time"
            value={slot.startTime}
            onChange={(e) => onUpdate(slot.id, "startTime", e.target.value)}
            className="h-9 bg-secondary"
          />
        </div>

        <span className="mt-5 text-muted-foreground">—</span>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">End Time</label>
          <Input
            type="time"
            value={slot.endTime}
            onChange={(e) => onUpdate(slot.id, "endTime", e.target.value)}
            className="h-9 bg-secondary"
          />
        </div>

        <div className="mt-5 h-6 w-px bg-border" />

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Capacity</label>
          <Input
            type="number"
            min={1}
            value={slot.maxCapacity}
            onChange={(e) => onUpdate(slot.id, "maxCapacity", parseInt(e.target.value) || 1)}
            className="h-9 w-20 bg-secondary text-center"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(slot.id)}
        disabled={!canRemove}
        className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:opacity-0"
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  );
}

// ============================================================
// Preview Summary
// ============================================================
function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="   font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function PreviewSummary({
  serviceName,
  locationNames,
  date,
  slotsCount,
  totalCapacity,
}: {
  serviceName: string;
  locationNames: string[];
  date: Date | undefined;
  slotsCount: number;
  totalCapacity: number;
}) {
  const totalSlotsCreated = slotsCount * locationNames.length;
  const totalCapacityAllLocations = totalCapacity * locationNames.length;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="   font-medium text-muted-foreground">Slot Creation Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryItem icon={<LayersIcon className="size-4" />} label="Service" value={serviceName || "—"} />
          <SummaryItem
            icon={<MapPinIcon className="size-4" />}
            label="Center"
            value={locationNames.length > 0 ? locationNames.join(", ") : "—"}
          />
          <SummaryItem
            icon={<CalendarIcon className="size-4" />}
            label="Applied Date"
            value={
              date
                ? date.toLocaleDateString("vi-VN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"
            }
          />
          <SummaryItem icon={<ClockIcon className="size-4" />} label="Time Slots" value={slotsCount.toString()} />
        </div>

        <div className="h-px bg-border" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LayersIcon className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Total Slots</span>
            </div>
            <p className="mt-1    font-semibold text-foreground">{totalSlotsCreated}</p>
            <p className="text-xs text-muted-foreground">
              {slotsCount} slots × {locationNames.length} centers
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersIcon className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Total Capacity</span>
            </div>
            <p className="mt-1    font-semibold text-foreground">{totalCapacityAllLocations}</p>
            <p className="text-xs text-muted-foreground">
              {totalCapacity} people × {locationNames.length} centers
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Main Component
// ============================================================
export default function CreateServiceSlotPage() {
  const router = useRouter();

  const [allServices, setAllServices] = useState<ServiceDTO[]>([]);
  const [availableServices, setAvailableServices] = useState<ServiceDTO[]>([]);
  const [allLocations, setAllLocations] = useState<LocationDTO[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);

  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>([]);
  const [slotDate, setSlotDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<SlotDefinition[]>([
    { id: Math.random().toString(36).substring(2, 9), startTime: "", endTime: "", maxCapacity: 5 },
  ]);

  const [loading, setLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [servicesData, locationsData] = await Promise.all([serviceService.getAll(), locationService.getAll()]);

        setAllServices(servicesData);
        setAllLocations(locationsData);

        const existingSlots = await serviceSlotService.getAll({
          page: 0,
          size: 9999999,
        });

        const servicesWithSlots = new Set(existingSlots.content.map((slot: any) => slot.serviceId));

        const servicesWithoutSlots = servicesData.filter((service) => !servicesWithSlots.has(service.id));

        setAvailableServices(servicesWithoutSlots);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load initial data");
      }
    };

    loadInitialData();
  }, []);
  // Load locations when service changes
  useEffect(() => {
    if (!selectedServiceId) {
      setLocations([]);
      setSelectedLocationIds([]);
      return;
    }
    setLocations(allLocations);
    setSelectedLocationIds([]);
  }, [selectedServiceId, allLocations]);

  const totalCapacity = slots.reduce((sum, slot) => sum + slot.maxCapacity, 0);
  const selectedLocationNames = selectedLocationIds.map((id) => locations.find((l) => l.id === id)?.name ?? "");
  const selectedService = allServices.find((s) => s.id === selectedServiceId);

  const steps = useMemo(
    () => [
      { label: "Service", isComplete: !!selectedServiceId },
      { label: "Center", isComplete: selectedLocationIds.length > 0 },
      { label: "Date", isComplete: !!slotDate },
      {
        label: "Time Slots",
        isComplete: slots.length > 0 && slots.every((s) => s.startTime && s.endTime && s.maxCapacity > 0),
      },
    ],
    [selectedServiceId, selectedLocationIds, slotDate, slots],
  );

  const currentStep = steps.findIndex((s) => !s.isComplete);
  const isFormComplete = steps.every((s) => s.isComplete);

  const handleLocationToggle = useCallback((locationId: number) => {
    setSelectedLocationIds((prev) =>
      prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId],
    );
  }, []);

  const handleSlotUpdate = useCallback(
    (id: string, field: keyof Omit<SlotDefinition, "id">, value: string | number) => {
      setSlots((prev) => prev.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot)));
    },
    [],
  );

  const handleSlotRemove = useCallback((id: string) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  }, []);

  const handleAddSlot = useCallback(() => {
    const lastSlot = slots[slots.length - 1];
    const newStartTime = lastSlot?.endTime || "09:00";
    const [hours, minutes] = newStartTime.split(":").map(Number);
    const endHours = (hours + 1) % 24;
    const newEndTime = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    setSlots((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 9), startTime: newStartTime, endTime: newEndTime, maxCapacity: 5 },
    ]);
  }, [slots]);

  const handleSubmit = async () => {
    if (!isFormComplete) return;

    setLoading(true);
    setSubmitResult(null);

    try {
      const payload: BulkCreateServiceSlotRequest = {
        serviceId: Number(selectedServiceId),
        locationIds: selectedLocationIds,
        slotDate: slotDate!.toISOString().split("T")[0],
        slots: slots.map(({ startTime, endTime, maxCapacity }) => ({
          startTime,
          endTime,
          maxCapacity,
        })),
      };

      await serviceSlotService.bulkCreate(payload);

      const totalCreated = slots.length * selectedLocationIds.length;

      toast.success(`Successfully created ${totalCreated} slots for ${selectedService?.name}`);

      setSubmitResult({
        success: true,
        message: `Successfully created ${totalCreated} slots for ${selectedService?.name}`,
      });

      setTimeout(() => router.push("/admin/slots"), 2500);
    } catch (error) {
      console.error(error);

      toast.error("Failed to create slots");

      setSubmitResult({
        success: false,
        message: "Failed to create slots. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-background ">
      <div className="mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="size-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Create Booking Slots</h1>
                <p className="   text-muted-foreground">Only for services that have no slots yet</p>
              </div>
            </div>
            <StepIndicator currentStep={currentStep === -1 ? 3 : currentStep} steps={steps} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Main Form */}
            <div className="space-y-6">
              {/* Service Selection */}
              {/* Service Selection */}
              <Card className="">
                <CardHeader>
                  <CardTitle className=" text-sm">1. Select Service</CardTitle>
                  <CardDescription className="text-sm">Choose a service that has no booking slots yet</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedServiceId.toString()}
                    onValueChange={(value) => setSelectedServiceId(Number(value))}
                    disabled={availableServices.length === 0}
                  >
                    <SelectTrigger className="rounded-sm border-border w-full ring-0">
                      <SelectValue
                        placeholder={availableServices.length === 0 ? "No available services" : "Select service..."}
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {availableServices.length > 0 ? (
                        availableServices.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center    text-muted-foreground">
                          All services already have slots.
                          <br />
                          Please go to management page to edit existing slots.
                        </div>
                      )}
                    </SelectContent>
                  </Select>

                  {availableServices.length === 0 && (
                    <p className="mt-3    text-amber-600 flex items-center gap-2">
                      <AlertCircleIcon className="size-4" />
                      Currently there are no services available for creating new slots.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Location, Date, Slots... (giữ nguyên như cũ) */}
              {/* ... (phần còn lại giữ nguyên hoàn toàn) */}
              {/* Location Selection */}
              <Card className={cn(!selectedServiceId && "opacity-50")}>
                <CardHeader>
                  <CardTitle className=" text-sm">2. Select Centers</CardTitle>
                  <CardDescription>Choose one or multiple centers</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocationSelector
                    locations={locations}
                    selectedLocationIds={selectedLocationIds}
                    onToggle={handleLocationToggle}
                    disabled={!selectedServiceId}
                  />
                </CardContent>
              </Card>

              {/* Date Selection */}
              <Card className={cn(!selectedLocationIds.length && "opacity-50")}>
                <CardHeader>
                  <CardTitle className=" text-sm ">3. Select Date</CardTitle>
                  <CardDescription>Date to apply the time slots</CardDescription>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={!selectedLocationIds.length}
                        className={cn(
                          "w-full justify-start bg-secondary text-left font-normal",
                          !slotDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {slotDate ? format(slotDate, "EEEE, dd/MM/yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={slotDate}
                        onSelect={setSlotDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              {/* Slots Configuration */}
              <Card className={cn(!slotDate && "opacity-50")}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className=" text-sm ">4. Configure Time Slots</CardTitle>
                      <CardDescription>Define time slots and capacity</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddSlot} disabled={!slotDate}>
                      <PlusIcon className="size-4 mr-1" />
                      Add Slot
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {slots.map((slot, index) => (
                    <SlotRow
                      key={slot.id}
                      slot={slot}
                      index={index}
                      onUpdate={handleSlotUpdate}
                      onRemove={handleSlotRemove}
                      canRemove={slots.length > 1}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <PreviewSummary
                serviceName={selectedService?.name || ""}
                locationNames={selectedLocationNames}
                date={slotDate}
                slotsCount={slots.length}
                totalCapacity={totalCapacity}
              />

              <Button className="w-full gap-2" size="lg" onClick={handleSubmit} disabled={!isFormComplete || loading}>
                {loading ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Creating slots...
                  </>
                ) : (
                  <>
                    <CheckIcon className="size-4" />
                    CREATE {slots.length * selectedLocationIds.length || 0} SLOTS
                  </>
                )}
              </Button>

              {submitResult && (
                <div
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-4",
                    submitResult.success ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                  )}
                >
                  {submitResult.success ? (
                    <CheckIcon className="mt-0.5 size-4" />
                  ) : (
                    <AlertCircleIcon className="mt-0.5 size-4" />
                  )}
                  <p className="  ">{submitResult.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
