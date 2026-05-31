// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { format } from "date-fns";
// import { vi } from "date-fns/locale";
// import {
//   CalendarIcon,
//   Search,
//   Loader2,
//   CalendarDays,
//   LayersIcon,
//   MapPinIcon,
//   ClockIcon,
//   UsersIcon,
//   Plus,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { serviceSlotService } from "@/services/booking/service-slot.service";
// import { serviceService } from "@/services/booking/service.service";
// import { locationService } from "@/services/booking/location.service";
// import { ServiceSlotDTO } from "@/types/booking/service-slot-type";
// import { ServiceDTO } from "@/types/booking/service-type";
// import { LocationDTO } from "@/types/booking/location-type";

// const ITEMS_PER_PAGE = 10;

// export default function ServiceSlotsPage() {
//   // Data states
//   const [services, setServices] = useState<ServiceDTO[]>([]);
//   const [locations, setLocations] = useState<LocationDTO[]>([]);
//   const [slots, setSlots] = useState<ServiceSlotDTO[]>([]);

//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [loadingServices, setLoadingServices] = useState(true);
//   const [hasSearched, setHasSearched] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Filters
//   const [selectedServiceId, setSelectedServiceId] = useState<string>("");
//   const [selectedLocationId, setSelectedLocationId] = useState<string>("");
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>();
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);

//   // Dialogs
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

//   // Load Services
//   useEffect(() => {
//     serviceService.getAll().then((data) => {
//       setServices(data);
//       setLoadingServices(false);
//     });
//   }, []);

//   // Load Locations when Service changes
//   useEffect(() => {
//     if (!selectedServiceId) {
//       setLocations([]);
//       setSelectedLocationId("");
//       return;
//     }

//     const loadLocations = async () => {
//       const allSlots = await serviceSlotService.getAll();
//       const locationIds = allSlots
//         .filter((s) => s.serviceId === Number(selectedServiceId))
//         .map((s) => s.locationId)
//         .filter((v, i, a) => a.indexOf(v) === i);

//       const allLocations = await locationService.getAll();
//       setLocations(allLocations.filter((l) => locationIds.includes(l.id)));
//     };

//     loadLocations();
//   }, [selectedServiceId]);

//   const handleSearch = async () => {
//     if (!selectedServiceId || !selectedLocationId) {
//       alert("Vui lòng chọn Dịch vụ và Trung tâm");
//       return;
//     }

//     setIsLoading(true);
//     setHasSearched(true);
//     setCurrentPage(1);

//     try {
//       const allSlotsData = await serviceSlotService.getAll();
//       let filtered = allSlotsData.filter(
//         (slot) => slot.serviceId === Number(selectedServiceId) && slot.locationId === Number(selectedLocationId),
//       );

//       if (selectedDate) {
//         const dateStr = format(selectedDate, "yyyy-MM-dd");

//         filtered = filtered.filter((slot) => slot.slotDate === dateStr);
//       }

//       setSlots(filtered);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     setDeletingSlotId(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!deletingSlotId) return;
//     await serviceSlotService.remove(deletingSlotId);
//     setDeleteDialogOpen(false);
//     setDeletingSlotId(null);
//     handleSearch(); // Refresh
//   };

//   // Pagination calculations
//   const totalPages = Math.ceil(slots.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const currentSlots = slots.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const getPageNumbers = () => {
//     const pages: (number | "ellipsis")[] = [];
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       if (currentPage <= 3) {
//         pages.push(1, 2, 3, 4, "ellipsis", totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//       } else {
//         pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
//       }
//     }
//     return pages;
//   };

//   const selectedServiceName = services.find((s) => s.id.toString() === selectedServiceId)?.name || "";
//   const selectedLocationName = locations.find((l) => l.id.toString() === selectedLocationId)?.name || "";

//   const totalCapacity = slots.reduce((sum, slot) => sum + slot.maxCapacity, 0);
//   const totalBooked = slots.reduce((sum, slot) => sum + slot.bookedCount, 0);

//   return (
//     <main className="min-h-screen bg-background">
//       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="space-y-6">
//           {/* Header */}
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="   font-bold tracking-tight">Quản lý Slot Dịch vụ</h1>
//               <p className="   text-muted-foreground mt-1">Chọn dịch vụ và trung tâm để xem danh sách slots</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Link
//                 href="/slots/edit"
//                 className="flex items-center gap-2 rounded-md bg-primary px-2 py-2    font-medium text-primary-foreground transition hover:opacity-90"
//               >
//                 <Plus size={18} />
//                 Edit
//               </Link>
//               <Link
//                 href="/slots/create"
//                 className="flex items-center gap-2 rounded-md bg-primary px-2 py-2    font-medium text-primary-foreground transition hover:opacity-90"
//               >
//                 <Plus size={18} />
//                 Tạo Slot Mới
//               </Link>
//             </div>
//           </div>

//           <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
//             {/* Main Content */}
//             <div className="space-y-6">
//               {/* Filter Card */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Bộ lọc tìm kiếm</CardTitle>
//                   <CardDescription>Chọn dịch vụ và trung tâm để xem danh sách slot</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <label className="   text-muted-foreground">
//                       Dịch vụ <span className="text-red-500">*</span>
//                     </label>
//                     <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Chọn dịch vụ..." />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {services.map((service) => (
//                           <SelectItem key={service.id} value={service.id.toString()}>
//                             {service.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="   text-muted-foreground">
//                       Trung tâm <span className="text-red-500">*</span>
//                     </label>
//                     <Select
//                       value={selectedLocationId}
//                       onValueChange={setSelectedLocationId}
//                       disabled={!selectedServiceId}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder={selectedServiceId ? "Chọn trung tâm..." : "Chọn dịch vụ trước"} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {locations.map((loc) => (
//                           <SelectItem key={loc.id} value={loc.id.toString()}>
//                             {loc.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="   text-muted-foreground">Ngày (tùy chọn)</label>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className={cn(
//                             "w-full justify-start text-left font-normal",
//                             !selectedDate && "text-muted-foreground",
//                           )}
//                         >
//                           <CalendarIcon className="mr-2 h-4 w-4" />
//                           {selectedDate ? format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0">
//                         <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
//                       </PopoverContent>
//                     </Popover>
//                   </div>

//                   <Button
//                     onClick={handleSearch}
//                     disabled={!selectedServiceId || !selectedLocationId || isLoading}
//                     className="w-full"
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Đang tìm...
//                       </>
//                     ) : (
//                       <>
//                         <Search className="mr-2 h-4 w-4" />
//                         Tìm kiếm Slots
//                       </>
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>

//               {/* Results */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Danh sách Slot</CardTitle>
//                   {hasSearched && !isLoading && <CardDescription>Tìm thấy {slots.length} slot</CardDescription>}
//                 </CardHeader>
//                 <CardContent>
//                   {!hasSearched && (
//                     <div className="flex flex-col items-center justify-center py-16 text-center">
//                       <div className="rounded-full bg-secondary p-4 mb-4">
//                         <CalendarDays className="h-10 w-10 text-muted-foreground" />
//                       </div>
//                       <h3 className="   font-medium">Chưa có dữ liệu</h3>
//                       <p className="   text-muted-foreground mt-2 max-w-xs">
//                         Vui lòng chọn dịch vụ và trung tâm, sau đó nhấn "Tìm kiếm"
//                       </p>
//                     </div>
//                   )}

//                   {isLoading && (
//                     <div className="flex flex-col items-center justify-center py-16">
//                       <Loader2 className="h-10 w-10 animate-spin text-primary" />
//                       <p className="mt-4    text-muted-foreground">Đang tải dữ liệu...</p>
//                     </div>
//                   )}

//                   {hasSearched && !isLoading && slots.length === 0 && (
//                     <div className="text-center py-16 text-muted-foreground">Không tìm thấy slot nào phù hợp</div>
//                   )}

//                   {hasSearched && !isLoading && slots.length > 0 && (
//                     <>
//                       <div className="rounded-lg border border-border overflow-hidden">
//                         <Table>
//                           <TableHeader>
//                             <TableRow>
//                               <TableHead>#</TableHead>
//                               <TableHead>Ngày</TableHead>
//                               <TableHead>Giờ</TableHead>
//                               <TableHead className="text-center">Sức chứa</TableHead>
//                               <TableHead className="text-center">Đã đặt</TableHead>
//                               {/* <TableHead className="text-right">Thao tác</TableHead> */}
//                             </TableRow>
//                           </TableHeader>
//                           <TableBody>
//                             {currentSlots.map((slot, idx) => (
//                               <TableRow key={slot.id}>
//                                 <TableCell>{startIndex + idx + 1}</TableCell>
//                                 <TableCell>{slot.slotDate}</TableCell>
//                                 <TableCell className="font-medium">
//                                   {slot.startTime} - {slot.endTime}
//                                 </TableCell>
//                                 <TableCell className="text-center">{slot.maxCapacity}</TableCell>
//                                 <TableCell className="text-center">
//                                   <Badge variant="secondary">
//                                     {slot.bookedCount}/{slot.maxCapacity}
//                                   </Badge>
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </div>

//                       {/* Pagination */}
//                       {totalPages > 1 && (
//                         <div className="flex items-center justify-between pt-4">
//                           <p className="   text-muted-foreground">
//                             Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, slots.length)} trong{" "}
//                             {slots.length}
//                           </p>
//                           <Pagination>
//                             <PaginationContent>
//                               <PaginationItem>
//                                 <PaginationPrevious
//                                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                                   className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                                 />
//                               </PaginationItem>
//                               {getPageNumbers().map((page, i) =>
//                                 page === "ellipsis" ? (
//                                   <PaginationEllipsis key={i} />
//                                 ) : (
//                                   <PaginationItem key={i}>
//                                     <PaginationLink
//                                       isActive={currentPage === page}
//                                       onClick={() => setCurrentPage(page as number)}
//                                     >
//                                       {page}
//                                     </PaginationLink>
//                                   </PaginationItem>
//                                 ),
//                               )}
//                               <PaginationItem>
//                                 <PaginationNext
//                                   onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                                   className={
//                                     currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
//                                   }
//                                 />
//                               </PaginationItem>
//                             </PaginationContent>
//                           </Pagination>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Sidebar Summary */}
//             <div className="lg:sticky lg:top-8">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="   font-medium text-muted-foreground">Tóm tắt tìm kiếm</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="flex gap-3">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
//                         <LayersIcon className="h-5 w-5" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground">Dịch vụ</p>
//                         <p className="font-medium">{selectedServiceName || "—"}</p>
//                       </div>
//                     </div>

//                     <div className="flex gap-3">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
//                         <MapPinIcon className="h-5 w-5" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground">Trung tâm</p>
//                         <p className="font-medium">{selectedLocationName || "—"}</p>
//                       </div>
//                     </div>

//                     <div className="flex gap-3">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
//                         <CalendarIcon className="h-5 w-5" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground">Ngày</p>
//                         <p className="font-medium">
//                           {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Tất cả ngày"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {hasSearched && slots.length > 0 && (
//                     <>
//                       <div className="h-px bg-border" />
//                       <div className="space-y-4">
//                         <div className="rounded-lg bg-secondary p-4">
//                           <div className="flex items-center gap-2    text-muted-foreground">
//                             <ClockIcon className="h-4 w-4" />
//                             <span>Tổng số slot</span>
//                           </div>
//                           <p className="   font-bold mt-1">{slots.length}</p>
//                         </div>

//                         <div className="rounded-lg bg-secondary p-4">
//                           <div className="flex items-center gap-2    text-muted-foreground">
//                             <UsersIcon className="h-4 w-4" />
//                             <span>Tổng sức chứa</span>
//                           </div>
//                           <p className="   font-bold mt-1">{totalCapacity}</p>
//                           <p className="   text-muted-foreground mt-1">
//                             Đã đặt: {totalBooked} (
//                             {totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0}%)
//                           </p>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Xác nhận xóa slot</AlertDialogTitle>
//             <AlertDialogDescription>
//               Hành động này không thể hoàn tác. Bạn có chắc muốn xóa slot này?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Hủy</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
//               Xóa
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </main>
//   );
// }

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { locationService } from "@/services/booking/location.service";
import { ServiceSlotDTO } from "@/types/booking/service-slot-type";
import { ServiceDTO } from "@/types/booking/service-type";
import { LocationDTO } from "@/types/booking/location-type";

const ITEMS_PER_PAGE = 10;

export default function ServiceSlotsPage() {
  // Data states
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [slots, setSlots] = useState<ServiceSlotDTO[]>([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

  // Load Services
  useEffect(() => {
    serviceService.getAll().then((data) => {
      setServices(data);
      setLoadingServices(false);
    });
  }, []);

  // Load Locations when Service changes
  useEffect(() => {
    if (!selectedServiceId) {
      setLocations([]);
      setSelectedLocationId("");
      return;
    }

    const loadLocations = async () => {
      const allSlots = await serviceSlotService.getAll();
      const locationIds = allSlots
        .filter((s) => s.serviceId === Number(selectedServiceId))
        .map((s) => s.locationId)
        .filter((v, i, a) => a.indexOf(v) === i);

      const allLocations = await locationService.getAll();
      setLocations(allLocations.filter((l) => locationIds.includes(l.id)));
    };

    loadLocations();
  }, [selectedServiceId]);

  const handleSearch = async () => {
    if (!selectedServiceId || !selectedLocationId) {
      alert("Please select Service and Center");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setCurrentPage(1);

    try {
      const allSlotsData = await serviceSlotService.getAll();
      let filtered = allSlotsData.filter(
        (slot) => slot.serviceId === Number(selectedServiceId) && slot.locationId === Number(selectedLocationId),
      );

      if (selectedDate) {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        filtered = filtered.filter((slot) => slot.slotDate === dateStr);
      }

      setSlots(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingSlotId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingSlotId) return;
    await serviceSlotService.remove(deletingSlotId);
    setDeleteDialogOpen(false);
    setDeletingSlotId(null);
    handleSearch(); // Refresh
  };

  // Pagination calculations
  const totalPages = Math.ceil(slots.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSlots = slots.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }
    return pages;
  };

  const selectedServiceName = services.find((s) => s.id.toString() === selectedServiceId)?.name || "";
  const selectedLocationName = locations.find((l) => l.id.toString() === selectedLocationId)?.name || "";

  const totalCapacity = slots.reduce((sum, slot) => sum + slot.maxCapacity, 0);
  const totalBooked = slots.reduce((sum, slot) => sum + slot.bookedCount, 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto ">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="  text-xl font-bold tracking-tight">Service Slot Management</h1>
              <p className="   text-muted-foreground mt-1">Select service and center to view slot list</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/slots/edit"
                className="flex items-center underline gap-2 rounded-md  px-2 py-2    font-medium text-primary transition hover:opacity-90"
              >
                {/* <Plus size={18} /> */}
                Edit Slots
              </Link>
              <Link
                href="/slots/create"
                className="flex items-center gap-2 rounded-md bg-primary px-2 py-2    font-medium text-primary-foreground transition hover:opacity-90"
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
                    <label className="   text-muted-foreground">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                      <SelectTrigger className="rounded-sm! border-border w-full ring-0!">
                        <SelectValue placeholder="Select service..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-sm! w-full mt-8">
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="   text-muted-foreground">
                      Center <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={selectedLocationId}
                      onValueChange={setSelectedLocationId}
                      disabled={!selectedServiceId}
                    >
                      <SelectTrigger className="border-border ">
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
                    <label className="   text-muted-foreground">Date (optional)</label>
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
                    onClick={handleSearch}
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
                  {hasSearched && !isLoading && <CardDescription>Found {slots.length} slots</CardDescription>}
                </CardHeader>
                <CardContent>
                  {!hasSearched && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="rounded-full bg-secondary p-4 mb-4">
                        <CalendarDays className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="   font-medium">No data yet</h3>
                      <p className="   text-muted-foreground mt-2 max-w-xs">
                        Please select a service and center, then click "Search"
                      </p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <p className="mt-4    text-muted-foreground">Loading data...</p>
                    </div>
                  )}

                  {hasSearched && !isLoading && slots.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">No matching slots found</div>
                  )}

                  {hasSearched && !isLoading && slots.length > 0 && (
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
                          <TableBody>
                            {currentSlots.map((slot, idx) => (
                              <TableRow key={slot.id}>
                                <TableCell>{startIndex + idx + 1}</TableCell>
                                <TableCell>{slot.slotDate}</TableCell>
                                <TableCell className="font-medium">
                                  {slot.startTime} - {slot.endTime}
                                </TableCell>
                                <TableCell className="text-center">{slot.maxCapacity}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="secondary">
                                    {slot.bookedCount}/{slot.maxCapacity}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                          <p className="   text-muted-foreground">
                            Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, slots.length)} of{" "}
                            {slots.length}
                          </p>
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                              {getPageNumbers().map((page, i) =>
                                page === "ellipsis" ? (
                                  <PaginationEllipsis key={i} />
                                ) : (
                                  <PaginationItem key={i}>
                                    <PaginationLink
                                      isActive={currentPage === page}
                                      onClick={() => setCurrentPage(page as number)}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                ),
                              )}
                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                  <CardTitle className="   font-medium text-muted-foreground">Search Summary</CardTitle>
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

                  {hasSearched && slots.length > 0 && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="space-y-4">
                        <div className="rounded-lg bg-secondary p-4">
                          <div className="flex items-center gap-2    text-muted-foreground">
                            <ClockIcon className="h-4 w-4" />
                            <span>Total Slots</span>
                          </div>
                          <p className="   font-bold mt-1">{slots.length}</p>
                        </div>

                        <div className="rounded-lg bg-secondary p-4">
                          <div className="flex items-center gap-2    text-muted-foreground">
                            <UsersIcon className="h-4 w-4" />
                            <span>Total Capacity</span>
                          </div>
                          <p className="   font-bold mt-1">{totalCapacity}</p>
                          <p className="   text-muted-foreground mt-1">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete Slot</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete this slot?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
