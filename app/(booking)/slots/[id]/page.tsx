"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Loader2,
  Calendar as CalendarIconLucide,
  LayersIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceSlotService } from "@/services/booking/service-slot.service";
import { serviceService } from "@/services/booking/service.service";
import { locationService } from "@/services/booking/location.service";
import { ServiceDTO } from "@/types/booking/service-type";
import { LocationDTO } from "@/types/booking/location-type";
import { ServiceSlotDTO, UpdateServiceSlotRequest, CreateServiceSlotRequest } from "@/types/booking/service-slot-type";

export default function ManageServiceSlotsPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [slots, setSlots] = useState<ServiceSlotDTO[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [selectedLocationId, setSelectedLocationId] = useState<number | "">("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Accordion state
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  useEffect(() => {
    serviceService.getAll().then(setServices);
    locationService.getAll().then(setLocations);
  }, []);

  const loadSlots = async () => {
    if (!selectedServiceId || !selectedLocationId) {
      alert("Please select Service and Center");
      return;
    }
    setLoading(true);
    try {
      const allSlots = await serviceSlotService.getAll();
      let filtered = allSlots.filter(
        (s) => s.serviceId === Number(selectedServiceId) && s.locationId === Number(selectedLocationId),
      );

      const now = new Date();
      const currentDateStr = now.toISOString().split("T")[0];
      const currentTime = now.getHours() * 60 + now.getMinutes();

      filtered = filtered.filter((slot) => {
        if (slot.slotDate > currentDateStr) return true;
        if (slot.slotDate < currentDateStr) return false;
        const [hour, minute] = slot.startTime.split(":").map(Number);
        const slotTimeInMinutes = hour * 60 + minute;
        return slotTimeInMinutes > currentTime;
      });

      setSlots(filtered);
      setHasLoaded(true);
      setExpandedDates(new Set());
    } finally {
      setLoading(false);
    }
  };

  // Group slots by date
  const groupedSlots = slots.reduce(
    (acc, slot) => {
      const date = slot.slotDate;
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    },
    {} as Record<string, ServiceSlotDTO[]>,
  );

  const sortedDates = Object.keys(groupedSlots).sort();

  const updateSlot = async (slotId: number, updatedData: Partial<ServiceSlotDTO>) => {
    try {
      const payload: UpdateServiceSlotRequest = {
        slotDate: updatedData.slotDate,
        startTime: updatedData.startTime,
        endTime: updatedData.endTime,
        maxCapacity: updatedData.maxCapacity,
      };
      await serviceSlotService.update(slotId, payload);
      loadSlots();
    } catch (err) {
      alert("Update failed");
    }
  };

  const saveNewSlot = async (index: number) => {
    const slot = slots[index];
    if (!slot.slotDate || !slot.startTime || !slot.endTime) {
      alert("Please fill in Date, Start Time and End Time");
      return;
    }
    try {
      const payload: CreateServiceSlotRequest = {
        serviceId: Number(selectedServiceId),
        locationId: Number(selectedLocationId),
        slotDate: slot.slotDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxCapacity: slot.maxCapacity || 5,
      };
      await serviceSlotService.create(payload);
      alert("New slot created successfully!");
      loadSlots();
    } catch (err) {
      alert("Failed to create slot");
    }
  };

  const deleteSlot = async (slotId: number) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;
    try {
      await serviceSlotService.remove(slotId);
      loadSlots();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const addNewSlot = () => {
    const newSlot: ServiceSlotDTO = {
      id: Date.now(),
      serviceId: Number(selectedServiceId),
      locationId: Number(selectedLocationId),
      slotDate: "",
      startTime: "",
      endTime: "",
      maxCapacity: 5,
      bookedCount: 0,
    };
    setSlots([...slots, newSlot]);
  };

  const isNewSlot = (id: number) => id > 1000000000;

  const handleInputChange = (index: number, field: keyof ServiceSlotDTO, value: string | number) => {
    const updatedSlots = [...slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setSlots(updatedSlots);
  };

  const selectedServiceName = services.find((s) => s.id === Number(selectedServiceId))?.name || "";
  const selectedLocationName = locations.find((l) => l.id === Number(selectedLocationId))?.name || "";

  const totalSlots = slots.length;
  const totalCapacity = slots.reduce((sum, slot) => sum + slot.maxCapacity, 0);
  const totalBooked = slots.reduce((sum, slot) => sum + slot.bookedCount, 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto ">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Service Slot Management</h1>
              <p className="text-muted-foreground mt-1">Only showing slots with start time in the future</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-none underline " onClick={() => router.back()}>
                Go Back
              </Button>
              <Button onClick={addNewSlot} className="flex px-2 py-2 h-9 items-center gap-2">
                <Plus size={18} />
                Add new slot
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Filter Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Filters</CardTitle>
                  <CardDescription>Select service and center to manage slots</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-muted-foreground">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <Select value={selectedServiceId.toString()} onValueChange={(v) => setSelectedServiceId(Number(v))}>
                      <SelectTrigger className="rounded-sm! border-border w-full ring-0!">
                        <SelectValue placeholder="Select service..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-sm! w-full mt-8">
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-muted-foreground">
                      Center <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={selectedLocationId.toString()}
                      onValueChange={(v) => setSelectedLocationId(Number(v))}
                      disabled={!selectedServiceId}
                    >
                      <SelectTrigger className="ring-0! border-border rounded-sm ">
                        <SelectValue placeholder={selectedServiceId ? "Select center..." : "Select service first"} />
                      </SelectTrigger>
                      <SelectContent className="mt-8">
                        {locations.map((l) => (
                          <SelectItem key={l.id} value={l.id.toString()}>
                            {l.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-muted-foreground">Date (optional)</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "EEEE, dd/MM/yyyy", { locale: enUS }) : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button
                    onClick={loadSlots}
                    disabled={!selectedServiceId || !selectedLocationId || loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <CalendarIconLucide className="mr-2 h-4 w-4" />
                        Load Slots
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results - Accordion by Date */}
              {hasLoaded && (
                <Card>
                  <CardHeader>
                    <CardTitle>Slots List by Date</CardTitle>
                    <CardDescription>Found {totalSlots} future slots</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sortedDates.length > 0 ? (
                      <div className="space-y-4">
                        {sortedDates.map((date) => {
                          const isExpanded = expandedDates.has(date);
                          return (
                            <div
                              key={date}
                              className="border border-border rounded-lg overflow-hidden bg-card shadow-sm"
                            >
                              <div
                                onClick={() => toggleDate(date)}
                                className="bg-secondary px-2 py-2 flex items-center justify-between cursor-pointer hover:bg-secondary/80 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <CalendarIconLucide className="text-primary" size={22} />
                                  <div>
                                    <p className="text-muted-foreground">Date</p>
                                    <h3 className="font-semibold">{date}</h3>
                                  </div>
                                </div>
                                <ChevronDown
                                  className={cn("h-5 w-5 transition-transform", isExpanded && "rotate-180")}
                                />
                              </div>

                              {isExpanded && (
                                <div className="p-0 space-y-0">
                                  {groupedSlots[date].map((slot) => {
                                    const globalIndex = slots.findIndex((s) => s.id === slot.id);
                                    const isNew = isNewSlot(slot.id);

                                    return (
                                      <div
                                        key={slot.id}
                                        className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 border-b border-border bg-background hover:border-primary/30 transition-all"
                                      >
                                        {isNew && (
                                          <div className="sm:w-40">
                                            <label className="text-xs text-muted-foreground block mb-1.5">Date</label>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  className={cn(
                                                    "w-full justify-start text-left font-normal h-13",
                                                    !slot.slotDate && "text-muted-foreground",
                                                  )}
                                                >
                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                  {slot.slotDate
                                                    ? format(new Date(slot.slotDate), "dd/MM/yyyy")
                                                    : "Pick a date"}
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                  mode="single"
                                                  selected={slot.slotDate ? new Date(slot.slotDate) : undefined}
                                                  onSelect={(date) => {
                                                    if (date) {
                                                      const formatted = format(date, "yyyy-MM-dd");
                                                      handleInputChange(globalIndex, "slotDate", formatted);
                                                    }
                                                  }}
                                                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                />
                                              </PopoverContent>
                                            </Popover>
                                          </div>
                                        )}

                                        <div className="sm:w-40">
                                          <label className="text-xs text-muted-foreground block mb-1.5">
                                            Start Time
                                          </label>
                                          <input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={(e) =>
                                              handleInputChange(globalIndex, "startTime", e.target.value)
                                            }
                                            onBlur={() => !isNew && updateSlot(slot.id, { startTime: slot.startTime })}
                                            className="w-full border border-border rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary"
                                          />
                                        </div>

                                        <div className="sm:w-40">
                                          <label className="text-xs text-muted-foreground block mb-1.5">End Time</label>
                                          <input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) => handleInputChange(globalIndex, "endTime", e.target.value)}
                                            onBlur={() => !isNew && updateSlot(slot.id, { endTime: slot.endTime })}
                                            className="w-full border border-border rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary"
                                          />
                                        </div>

                                        <div className="sm:w-32">
                                          <label className="text-xs text-muted-foreground block mb-1.5">Capacity</label>
                                          <input
                                            type="number"
                                            value={slot.maxCapacity}
                                            onChange={(e) =>
                                              handleInputChange(globalIndex, "maxCapacity", parseInt(e.target.value))
                                            }
                                            onBlur={() =>
                                              !isNew && updateSlot(slot.id, { maxCapacity: slot.maxCapacity })
                                            }
                                            min={1}
                                            className="w-full border border-border rounded-lg px-4 py-3 text-center focus:border-primary focus:ring-1 focus:ring-primary"
                                          />
                                        </div>

                                        <div className="flex-1 flex justify-end items-center gap-4 pt-2 sm:pt-0">
                                          <Badge variant="secondary" className="px-4 py-2 text-orange-600">
                                            {slot.bookedCount} / {slot.maxCapacity}
                                          </Badge>
                                          {isNew ? (
                                            <Button
                                              onClick={() => saveNewSlot(globalIndex)}
                                              className="font-medium px-6"
                                            >
                                              Save New Slot
                                            </Button>
                                          ) : (
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => deleteSlot(slot.id)}
                                              className="h-10 w-10 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                              <Trash2 size={20} />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <CalendarIconLucide className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-medium">No future slots found</p>
                        <p className="text-muted-foreground mt-1">Please add new slots or change filters</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <Card>
                <CardHeader>
                  <CardTitle className="font-medium text-muted-foreground">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                        <LayersIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Service</p>
                        <p className="font-medium">{selectedServiceName || "—"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                        <MapPinIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Center</p>
                        <p className="font-medium">{selectedLocationName || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {hasLoaded && totalSlots > 0 && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                            <ClockIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Slots</p>
                            <p className="font-medium">{totalSlots}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                            <UsersIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Capacity</p>
                            <p className="font-medium">{totalCapacity}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
