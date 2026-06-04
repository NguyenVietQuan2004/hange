"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  CalendarIcon,
  Search,
  Loader2,
  CalendarDays,
  LayersIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { serviceSlotService } from "@/services/booking/service-slot.service";
import { serviceService } from "@/services/booking/service.service";

import { ServiceSlotDTO } from "@/types/booking/service-slot-type";
import { ServiceDTO } from "@/types/booking/service-type";
import { LocationDTO } from "@/types/booking/location-type";
import { PageResponse } from "@/types/page-response";

const PAGE_SIZE = 10;

export default function ServiceSlotsPage() {
  // Data states
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [pageData, setPageData] = useState<PageResponse<ServiceSlotDTO> | null>(null);

  // UI states
  const [loadingServices, setLoadingServices] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog
  const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

  /* ================= LOAD SERVICES ================= */
  useEffect(() => {
    serviceService.getAll().then((data) => {
      setServices(data);
      setLoadingServices(false);
    });
  }, []);

  /* ================= LOAD LOCATIONS WHEN SERVICE CHANGES ================= */
  useEffect(() => {
    if (!selectedServiceId) {
      setLocations([]);
      setSelectedLocationId("");
      return;
    }

    const loadLocations = async () => {
      try {
        const data = await serviceSlotService.getLocationsByService(Number(selectedServiceId));
        setLocations(data);
        setSelectedLocationId("");
      } catch (error) {
        console.error(error);
      }
    };

    loadLocations();
  }, [selectedServiceId]);

  /* ================= SEARCH WITH PAGINATION ================= */
  const handleSearch = async (page: number = 1) => {
    if (!selectedServiceId || !selectedLocationId) {
      alert("Vui lòng chọn Service và Center");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setCurrentPage(page);

    try {
      const { content, ...paginationInfo } = await serviceSlotService.getAll({
        serviceId: Number(selectedServiceId),
        locationId: Number(selectedLocationId),
        slotDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
        page: page - 1, // Backend thường dùng 0-based
        size: PAGE_SIZE,
      });

      setPageData({ content, ...paginationInfo });
    } catch (error) {
      console.error("Search failed:", error);
      setPageData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    handleSearch(page);
  };

  // Computed values
  const slots = pageData?.content || [];
  const totalElements = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;

  const selectedServiceName = services.find((s) => s.id.toString() === selectedServiceId)?.name || "";
  const selectedLocationName = locations.find((l) => l.id.toString() === selectedLocationId)?.name || "";

  const totalCapacity = slots.reduce((sum, slot) => sum + slot.maxCapacity, 0);
  const totalBooked = slots.reduce((sum, slot) => sum + slot.bookedCount, 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Service Slot Management</h1>
              <p className="text-muted-foreground mt-1">Select service and center to view slot list</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/slots/edit"
                className="flex items-center gap-2 rounded-md px-4 py-2 font-medium text-primary hover:bg-accent"
              >
                Edit Slots
              </Link>
              <Link
                href="/admin/slots/create"
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus size={18} />
                Create new slot
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Filter Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Filters</CardTitle>
                  <CardDescription>Select service and center to view slots</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                      <SelectTrigger className="rounded-sm border-border w-full ring-0">
                        <SelectValue placeholder="Select service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Center <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={selectedLocationId}
                      onValueChange={setSelectedLocationId}
                      disabled={!selectedServiceId}
                    >
                      <SelectTrigger className="rounded-sm border-border w-full ring-0">
                        <SelectValue placeholder={selectedServiceId ? "Select center..." : "Select service first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Date (optional)</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left", !selectedDate && "text-muted-foreground")}
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
                    onClick={() => handleSearch(1)}
                    disabled={!selectedServiceId || !selectedLocationId || isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search Slots
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Slot List</CardTitle>
                  {hasSearched && !isLoading && pageData && (
                    <CardDescription>
                      Found {totalElements} slots • Page {currentPage} of {totalPages}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!hasSearched && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="rounded-full bg-secondary p-4 mb-4">
                        <CalendarDays className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium">No data yet</h3>
                      <p className="text-muted-foreground mt-2 max-w-xs">
                        Please select a service and center, then click "Search"
                      </p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex flex-col items-center justify-center p-4 py-16">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <p className="mt-4 text-muted-foreground">Loading data...</p>
                    </div>
                  )}

                  {hasSearched && !isLoading && totalElements === 0 && (
                    <div className="text-center py-16 text-muted-foreground">No matching slots found</div>
                  )}

                  {hasSearched && !isLoading && totalElements > 0 && (
                    <>
                      <div className="rounded-lg border border-border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>#</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead className="text-center">Capacity</TableHead>
                              <TableHead className="text-center">Booked</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="*:text-muted-foreground">
                            {slots.map((slot, idx) => (
                              <TableRow key={slot.id}>
                                <TableCell>{(currentPage - 1) * PAGE_SIZE + idx + 1}</TableCell>
                                <TableCell>{slot.slotDate}</TableCell>
                                <TableCell className="font-medium">
                                  {slot.startTime} - {slot.endTime}
                                </TableCell>
                                <TableCell className="text-center">{slot.maxCapacity}</TableCell>
                                <TableCell className="text-center ">
                                  <Badge variant="secondary" className="text-muted-foreground">
                                    {slot.bookedCount}/{slot.maxCapacity}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Real Backend Pagination */}
                      {totalPages > 1 && (
                        <div className="flex  items-center justify-between pt-6">
                          <p className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
                            {Math.min(currentPage * PAGE_SIZE, totalElements)} of {totalElements}
                          </p>

                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>

                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    isActive={currentPage === page}
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}

                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                  className={
                                    currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                                  }
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:sticky lg:top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-muted-foreground">Search Summary</CardTitle>
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

                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium">{selectedDate ? format(selectedDate, "dd/MM/yyyy") : "All dates"}</p>
                      </div>
                    </div>
                  </div>

                  {hasSearched && totalElements > 0 && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="space-y-4">
                        <div className="rounded-lg bg-secondary p-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <ClockIcon className="h-4 w-4" />
                            <span>Total Slots</span>
                          </div>
                          <p className="font-bold mt-1">{totalElements}</p>
                        </div>

                        <div className="rounded-lg bg-secondary p-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <UsersIcon className="h-4 w-4" />
                            <span>Total Capacity</span>
                          </div>
                          <p className="font-bold mt-1">{totalCapacity}</p>
                          <p className="text-muted-foreground mt-1">
                            Booked: {totalBooked} (
                            {totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0}%)
                          </p>
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
