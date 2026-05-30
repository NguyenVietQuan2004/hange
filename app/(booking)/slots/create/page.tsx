// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { CheckCircle2, Plus, ArrowLeft } from "lucide-react";

// import { serviceSlotService } from "@/services/booking/service-slot.service";
// import { serviceService } from "@/services/booking/service.service";
// import { locationService } from "@/services/booking/location.service";

// import { ServiceDTO } from "@/types/booking/service-type";
// import { LocationDTO } from "@/types/booking/location-type";
// import { BulkCreateServiceSlotRequest, SlotItemDTO } from "@/types/booking/service-slot-type";

// export default function CreateServiceSlotPage() {
//   const router = useRouter();

//   const [allServices, setAllServices] = useState<ServiceDTO[]>([]);
//   const [availableServices, setAvailableServices] = useState<ServiceDTO[]>([]); // Service chưa có slot
//   const [allLocations, setAllLocations] = useState<LocationDTO[]>([]); // Tất cả locations
//   const [locations, setLocations] = useState<LocationDTO[]>([]);

//   const [loading, setLoading] = useState(false);

//   const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
//   const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>([]);
//   const [slotDate, setSlotDate] = useState("");
//   const [slots, setSlots] = useState<SlotItemDTO[]>([{ startTime: "", endTime: "", maxCapacity: 5 }]);

//   // Load Services + Locations ban đầu
//   useEffect(() => {
//     const loadInitialData = async () => {
//       const [servicesData, slotsData, locationsData] = await Promise.all([
//         serviceService.getAll(),
//         serviceSlotService.getAll(),
//         locationService.getAll(),
//       ]);

//       setAllServices(servicesData);
//       setAllLocations(locationsData);

//       // Lọc service chưa có slot nào
//       const servicesWithSlots = new Set(slotsData.map((slot) => slot.serviceId));
//       const servicesWithoutSlots = servicesData.filter((service) => !servicesWithSlots.has(service.id));

//       setAvailableServices(servicesWithoutSlots);
//     };

//     loadInitialData();
//   }, []);

//   // Load locations khi chọn service → Với service mới thì hiển thị TẤT CẢ locations
//   useEffect(() => {
//     if (!selectedServiceId) {
//       setLocations([]);
//       setSelectedLocationIds([]);
//       return;
//     }

//     // Vì đây là service chưa có slot nào → cho phép chọn tất cả locations
//     setLocations(allLocations);
//     setSelectedLocationIds([]); // Reset lựa chọn cũ
//   }, [selectedServiceId, allLocations]);

//   const addSlotRow = () => {
//     setSlots([...slots, { startTime: "", endTime: "", maxCapacity: 5 }]);
//   };

//   const removeSlotRow = (index: number) => {
//     if (slots.length === 1) return;
//     setSlots(slots.filter((_, i) => i !== index));
//   };

//   const updateSlot = (index: number, field: keyof SlotItemDTO, value: any) => {
//     const newSlots = [...slots];
//     newSlots[index] = { ...newSlots[index], [field]: value };
//     setSlots(newSlots);
//   };

//   const handleSubmit = async () => {
//     if (!selectedServiceId || selectedLocationIds.length === 0 || !slotDate) {
//       alert("Vui lòng chọn đầy đủ Dịch vụ, Trung tâm và Ngày");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload: BulkCreateServiceSlotRequest = {
//         serviceId: Number(selectedServiceId),
//         locationIds: selectedLocationIds,
//         slotDate,
//         slots,
//       };

//       await serviceSlotService.bulkCreate(payload);
//       alert("Tạo slots thành công!");
//       router.push("/slots");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-4xl">
//       <div className="mb-6">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
//         >
//           <ArrowLeft size={18} /> Quay lại
//         </button>
//       </div>

//       <div className="rounded-xl border bg-white shadow-sm p-8 space-y-8">
//         <div>
//           <h1 className="text-2xl font-bold uppercase text-orange-500">TẠO KHUNG GIỜ MỚI</h1>
//           <div className="h-[3px] w-20 bg-red-500 mt-2" />
//           <p className="text-sm text-muted-foreground mt-2">
//             Chỉ hiển thị dịch vụ chưa có slot nào (hệ thống sẽ tự động sinh sau)
//           </p>
//         </div>

//         {/* Service & Location */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-semibold text-sm">Dịch vụ</label>
//             <select
//               value={selectedServiceId}
//               onChange={(e) => setSelectedServiceId(Number(e.target.value))}
//               className="mt-2 w-full rounded-lg border px-4 py-3"
//               disabled={availableServices.length === 0}
//             >
//               <option value="">-- Chọn dịch vụ --</option>
//               {availableServices.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>
//             {availableServices.length === 0 && (
//               <p className="text-sm text-amber-600 mt-1">Tất cả dịch vụ đã có slot. Hệ thống sẽ tự động sinh thêm.</p>
//             )}
//           </div>

//           <div>
//             <label className="font-semibold text-sm">Trung tâm (có thể chọn nhiều)</label>
//             <div className="mt-2 max-h-60 overflow-y-auto border rounded-xl p-4 grid grid-cols-2 gap-3">
//               {locations.map((loc) => (
//                 <label key={loc.id} className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={selectedLocationIds.includes(loc.id)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedLocationIds([...selectedLocationIds, loc.id]);
//                       } else {
//                         setSelectedLocationIds(selectedLocationIds.filter((id) => id !== loc.id));
//                       }
//                     }}
//                   />
//                   <span>{loc.address}</span>
//                 </label>
//               ))}
//               {locations.length === 0 && selectedServiceId && (
//                 <p className="text-sm text-muted-foreground col-span-2">Không có trung tâm nào khả dụng.</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Date */}
//         <div>
//           <label className="font-semibold text-sm">Ngày áp dụng</label>
//           <input
//             type="date"
//             value={slotDate}
//             onChange={(e) => setSlotDate(e.target.value)}
//             className="mt-2 w-full rounded-lg border px-4 py-3"
//           />
//         </div>

//         {/* Slots */}
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <label className="font-semibold text-sm">Các khung giờ</label>
//             <button
//               onClick={addSlotRow}
//               className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm"
//             >
//               <Plus size={18} /> Thêm khung giờ
//             </button>
//           </div>

//           <div className="space-y-4">
//             {slots.map((slot, index) => (
//               <div key={index} className="grid grid-cols-12 gap-4 border rounded-xl p-5 relative">
//                 <div className="col-span-4">
//                   <label className="text-xs text-muted-foreground">Giờ bắt đầu</label>
//                   <input
//                     type="time"
//                     value={slot.startTime}
//                     onChange={(e) => updateSlot(index, "startTime", e.target.value)}
//                     className="mt-1 w-full rounded-lg border px-4 py-2.5"
//                   />
//                 </div>
//                 <div className="col-span-4">
//                   <label className="text-xs text-muted-foreground">Giờ kết thúc</label>
//                   <input
//                     type="time"
//                     value={slot.endTime}
//                     onChange={(e) => updateSlot(index, "endTime", e.target.value)}
//                     className="mt-1 w-full rounded-lg border px-4 py-2.5"
//                   />
//                 </div>
//                 <div className="col-span-3">
//                   <label className="text-xs text-muted-foreground">Sức chứa</label>
//                   <input
//                     type="number"
//                     value={slot.maxCapacity}
//                     onChange={(e) => updateSlot(index, "maxCapacity", parseInt(e.target.value))}
//                     min={1}
//                     className="mt-1 w-full rounded-lg border px-4 py-2.5"
//                   />
//                 </div>
//                 {slots.length > 1 && (
//                   <button
//                     onClick={() => removeSlotRow(index)}
//                     className="absolute top-4 right-4 text-red-500 hover:text-red-700"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={loading || !selectedServiceId || selectedLocationIds.length === 0 || !slotDate}
//           className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
//         >
//           <CheckCircle2 size={24} />
//           {loading ? "Đang tạo slots..." : "TẠO TẤT CẢ SLOTS"}
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { format } from "date-fns";

// import { serviceSlotService } from "@/services/booking/service-slot.service";
// import { serviceService } from "@/services/booking/service.service";
// import { locationService } from "@/services/booking/location.service";

// import { ServiceDTO } from "@/types/booking/service-type";
// import { LocationDTO } from "@/types/booking/location-type";
// import { BulkCreateServiceSlotRequest, SlotItemDTO } from "@/types/booking/service-slot-type";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Checkbox } from "@/components/ui/checkbox";
// import { CheckCircle2, Plus, ArrowLeft, MapPin, Calendar as CalendarIcon, Clock, Users, Layers } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Location {
//   id: string;
//   name: string;
//   address?: string;
// }

// export default function CreateServiceSlotPage() {
//   const router = useRouter();

//   // Data
//   const [allServices, setAllServices] = useState<ServiceDTO[]>([]);
//   const [availableServices, setAvailableServices] = useState<ServiceDTO[]>([]);
//   const [allLocations, setAllLocations] = useState<LocationDTO[]>([]);

//   // Form State
//   const [selectedServiceId, setSelectedServiceId] = useState<string>("");
//   const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [slots, setSlots] = useState<SlotItemDTO[]>([{ startTime: "09:00", endTime: "10:00", maxCapacity: 5 }]);
//   const [loading, setLoading] = useState(false);
//   const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

//   // Load initial data
//   useEffect(() => {
//     const loadInitialData = async () => {
//       const [servicesData, slotsData, locationsData] = await Promise.all([
//         serviceService.getAll(),
//         serviceSlotService.getAll(),
//         locationService.getAll(),
//       ]);

//       setAllServices(servicesData);
//       setAllLocations(locationsData);

//       const servicesWithSlots = new Set(slotsData.map((slot) => slot.serviceId));
//       const servicesWithoutSlots = servicesData.filter((service) => !servicesWithSlots.has(service.id));

//       setAvailableServices(servicesWithoutSlots);
//     };

//     loadInitialData();
//   }, []);

//   const selectedService = allServices.find((s) => s.id.toString() === selectedServiceId);
//   const selectedLocations = allLocations.filter((loc) => selectedLocationIds.includes(loc.id.toString()));

//   // Step status
//   const steps = useMemo(
//     () => [
//       { label: "Service", isComplete: !!selectedServiceId },
//       { label: "Locations", isComplete: selectedLocationIds.length > 0 },
//       { label: "Date", isComplete: !!selectedDate },
//       {
//         label: "Slots",
//         isComplete: slots.length > 0 && slots.every((s) => s.startTime && s.endTime && s.maxCapacity > 0),
//       },
//     ],
//     [selectedServiceId, selectedLocationIds, selectedDate, slots],
//   );

//   const currentStep = steps.findIndex((s) => !s.isComplete);
//   const isFormComplete = steps.every((s) => s.isComplete);

//   const handleLocationToggle = (locationId: string) => {
//     setSelectedLocationIds((prev) =>
//       prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId],
//     );
//   };

//   const addSlot = () => {
//     const lastSlot = slots[slots.length - 1];
//     const newStart = lastSlot?.endTime || "09:00";
//     setSlots([...slots, { startTime: newStart, endTime: "", maxCapacity: 5 }]);
//   };

//   const removeSlot = (index: number) => {
//     if (slots.length === 1) return;
//     setSlots(slots.filter((_, i) => i !== index));
//   };

//   const updateSlot = (index: number, field: keyof SlotItemDTO, value: any) => {
//     const newSlots = [...slots];
//     newSlots[index] = { ...newSlots[index], [field]: value };
//     setSlots(newSlots);
//   };

//   const handleSubmit = async () => {
//     if (!isFormComplete || !selectedServiceId) return;

//     setLoading(true);
//     setSubmitResult(null);

//     try {
//       const payload: BulkCreateServiceSlotRequest = {
//         serviceId: Number(selectedServiceId),
//         locationIds: selectedLocationIds.map((id) => Number(id)),
//         slotDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
//         slots,
//       };

//       await serviceSlotService.bulkCreate(payload);

//       setSubmitResult({
//         success: true,
//         message: `Successfully created ${slots.length * selectedLocationIds.length} booking slots.`,
//       });

//       // Reset form
//       setTimeout(() => {
//         setSelectedServiceId("");
//         setSelectedLocationIds([]);
//         setSelectedDate(undefined);
//         setSlots([{ startTime: "09:00", endTime: "10:00", maxCapacity: 5 }]);
//         setSubmitResult(null);
//         router.push("/slots");
//       }, 2000);
//     } catch (error) {
//       setSubmitResult({
//         success: false,
//         message: "Có lỗi xảy ra khi tạo slots.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="mx-auto max-w-6xl px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold">Create Booking Slots</h1>
//             <p className="text-muted-foreground mt-1">Configure time slots for services that customers can book.</p>
//           </div>
//           <Button variant="ghost" onClick={() => router.back()}>
//             <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
//           </Button>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
//           {/* Main Form */}
//           <div className="space-y-6">
//             {/* 1. Service */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>1. Select Service</CardTitle>
//                 <CardDescription>Only services without existing slots are shown.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a service..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {availableServices.map((service) => (
//                       <SelectItem key={service.id} value={service.id.toString()}>
//                         {service.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </CardContent>
//             </Card>

//             {/* 2. Locations */}
//             <Card className={cn(!selectedServiceId && "opacity-50")}>
//               <CardHeader>
//                 <CardTitle>2. Select Locations</CardTitle>
//                 <CardDescription>Choose one or more locations.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {allLocations.map((loc) => {
//                     const isSelected = selectedLocationIds.includes(loc.id.toString());
//                     return (
//                       <label
//                         key={loc.id}
//                         className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
//                           isSelected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
//                         }`}
//                       >
//                         <Checkbox
//                           checked={isSelected}
//                           onCheckedChange={() => handleLocationToggle(loc.id.toString())}
//                           disabled={!selectedServiceId}
//                         />
//                         <div className="flex items-center gap-3">
//                           <MapPin className="h-5 w-5 text-muted-foreground" />
//                           <div>
//                             <p className="font-medium">{loc.address}</p>
//                           </div>
//                         </div>
//                       </label>
//                     );
//                   })}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* 3. Date */}
//             <Card className={cn(!selectedLocationIds.length && "opacity-50")}>
//               <CardHeader>
//                 <CardTitle>3. Select Date</CardTitle>
//                 <CardDescription>Choose the date for these slots.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={cn("w-full justify-start text-left", !selectedDate && "text-muted-foreground")}
//                       disabled={!selectedLocationIds.length}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {selectedDate ? format(selectedDate, "EEEE, dd MMMM yyyy") : "Pick a date"}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={selectedDate}
//                       onSelect={setSelectedDate}
//                       disabled={(date: any) => date < new Date()}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </CardContent>
//             </Card>

//             {/* 4. Slots */}
//             <Card className={cn(!selectedDate && "opacity-50")}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle>4. Configure Slots</CardTitle>
//                     <CardDescription>Define time ranges and capacity.</CardDescription>
//                   </div>
//                   <Button onClick={addSlot} disabled={!selectedDate} className="gap-2">
//                     <Plus className="h-4 w-4" /> Add Slot
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {slots.map((slot, index) => (
//                   <div key={index} className="flex gap-4 items-center border rounded-lg p-4 bg-card">
//                     <div className="font-semibold text-muted-foreground w-6">{index + 1}</div>

//                     <div className="flex-1 grid grid-cols-5 gap-4">
//                       <div>
//                         <p className="text-xs text-muted-foreground mb-1">Start Time</p>
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) => updateSlot(index, "startTime", e.target.value)}
//                           className="w-full border rounded-md px-3 py-2 bg-background"
//                         />
//                       </div>
//                       <div className="flex items-center justify-center text-muted-foreground mt-6">—</div>
//                       <div>
//                         <p className="text-xs text-muted-foreground mb-1">End Time</p>
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) => updateSlot(index, "endTime", e.target.value)}
//                           className="w-full border rounded-md px-3 py-2 bg-background"
//                         />
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground mb-1">Capacity</p>
//                         <input
//                           type="number"
//                           min={1}
//                           value={slot.maxCapacity}
//                           onChange={(e) => updateSlot(index, "maxCapacity", parseInt(e.target.value))}
//                           className="w-full border rounded-md px-3 py-2 bg-background text-center"
//                         />
//                       </div>
//                     </div>

//                     {slots.length > 1 && (
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => removeSlot(index)}
//                         className="text-destructive hover:text-destructive/80"
//                       >
//                         ✕
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar Summary */}
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Creation Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="flex gap-3">
//                     <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Service</p>
//                       <p className="font-medium">{selectedService?.name || "—"}</p>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Locations</p>
//                       <p className="font-medium">{selectedLocationIds.length} selected</p>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Date</p>
//                       <p className="font-medium">{selectedDate ? format(selectedDate, "dd/MM/yyyy") : "—"}</p>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Slot Definitions</p>
//                       <p className="font-medium">{slots.length} slot(s)</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t pt-4 grid grid-cols-2 gap-4">
//                   <div className="bg-secondary/50 rounded-lg p-4">
//                     <p className="text-xs text-muted-foreground">TOTAL SLOTS</p>
//                     <p className="text-3xl font-semibold mt-1">{slots.length * selectedLocationIds.length}</p>
//                   </div>
//                   <div className="bg-secondary/50 rounded-lg p-4">
//                     <p className="text-xs text-muted-foreground">TOTAL CAPACITY</p>
//                     <p className="text-3xl font-semibold mt-1">
//                       {slots.reduce((sum, s) => sum + s.maxCapacity, 0) * selectedLocationIds.length}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Button size="lg" className="w-full gap-2" onClick={handleSubmit} disabled={!isFormComplete || loading}>
//               {loading ? (
//                 "Đang tạo slots..."
//               ) : (
//                 <>
//                   <CheckCircle2 className="h-5 w-5" />
//                   Create {slots.length * selectedLocationIds.length} Slots
//                 </>
//               )}
//             </Button>

//             {submitResult && (
//               <div
//                 className={cn(
//                   "p-4 rounded-lg text-sm",
//                   submitResult.success ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500",
//                 )}
//               >
//                 {submitResult.message}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

import { serviceSlotService } from "@/services/booking/service-slot.service";
import { serviceService } from "@/services/booking/service.service";
import { locationService } from "@/services/booking/location.service";

import { ServiceDTO } from "@/types/booking/service-type";
import { LocationDTO } from "@/types/booking/location-type";
import { BulkCreateServiceSlotRequest, SlotItemDTO } from "@/types/booking/service-slot-type";

// ============================================================
// Types
// ============================================================

interface SlotDefinition extends SlotItemDTO {
  id: string;
}

// ============================================================
// Step Indicator Component
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
              }`}
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
// Location Selector Component
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
        <p className="text-sm text-muted-foreground">Không có trung tâm nào khả dụng.</p>
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
                <p className="text-sm font-medium text-foreground">{location.name || "Trung tâm"}</p>
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
// Slot Row Component
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
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-muted-foreground/30">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-medium text-secondary-foreground">
        {index + 1}
      </div>

      <div className="grid flex-1 grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Giờ bắt đầu</label>
          <Input
            type="time"
            value={slot.startTime}
            onChange={(e: any) => onUpdate(slot.id, "startTime", e.target.value)}
            className="h-9 bg-secondary"
          />
        </div>

        <span className="mt-5 text-muted-foreground">—</span>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Giờ kết thúc</label>
          <Input
            type="time"
            value={slot.endTime}
            onChange={(e: any) => onUpdate(slot.id, "endTime", e.target.value)}
            className="h-9 bg-secondary"
          />
        </div>

        <div className="mt-5 h-6 w-px bg-border" />

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Sức chứa</label>
          <Input
            type="number"
            min={1}
            value={slot.maxCapacity}
            onChange={(e: any) => onUpdate(slot.id, "maxCapacity", parseInt(e.target.value) || 1)}
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
// Preview Summary Component
// ============================================================

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
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
        <CardTitle className="text-sm font-medium text-muted-foreground">Tóm tắt tạo slots</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryItem icon={<LayersIcon className="size-4" />} label="Dịch vụ" value={serviceName || "—"} />
          <SummaryItem
            icon={<MapPinIcon className="size-4" />}
            label="Trung tâm"
            value={locationNames.length > 0 ? locationNames.join(", ") : "—"}
          />
          <SummaryItem
            icon={<CalendarIcon className="size-4" />}
            label="Ngày áp dụng"
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
          <SummaryItem icon={<ClockIcon className="size-4" />} label="Số khung giờ" value={slotsCount.toString()} />
        </div>

        <div className="h-px bg-border" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LayersIcon className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Tổng slots</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">{totalSlotsCreated}</p>
            <p className="text-xs text-muted-foreground">
              {slotsCount} khung × {locationNames.length} trung tâm
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersIcon className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Tổng sức chứa</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">{totalCapacityAllLocations}</p>
            <p className="text-xs text-muted-foreground">
              {totalCapacity} người × {locationNames.length} trung tâm
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Main Page Component
// ============================================================

export default function CreateServiceSlotPage() {
  const router = useRouter();

  // Original logic states
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

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      const [servicesData, slotsData, locationsData] = await Promise.all([
        serviceService.getAll(),
        serviceSlotService.getAll(),
        locationService.getAll(),
      ]);

      setAllServices(servicesData);
      setAllLocations(locationsData);

      const servicesWithSlots = new Set(slotsData.map((slot) => slot.serviceId));
      const servicesWithoutSlots = servicesData.filter((service) => !servicesWithSlots.has(service.id));

      setAvailableServices(servicesWithoutSlots);
    };

    loadInitialData();
  }, []);

  // Load locations when service is selected
  useEffect(() => {
    if (!selectedServiceId) {
      setLocations([]);
      setSelectedLocationIds([]);
      return;
    }
    setLocations(allLocations);
    setSelectedLocationIds([]);
  }, [selectedServiceId, allLocations]);

  // Calculate totals
  const totalCapacity = slots.reduce((sum, slot) => sum + slot.maxCapacity, 0);
  const selectedLocationNames = selectedLocationIds.map((id) => locations.find((l) => l.id === id)?.name ?? "");
  const selectedService = allServices.find((s) => s.id === selectedServiceId);

  // Steps
  const steps = useMemo(
    () => [
      { label: "Dịch vụ", isComplete: !!selectedServiceId },
      { label: "Trung tâm", isComplete: selectedLocationIds.length > 0 },
      { label: "Ngày", isComplete: !!slotDate },
      {
        label: "Khung giờ",
        isComplete: slots.length > 0 && slots.every((s) => s.startTime && s.endTime && s.maxCapacity > 0),
      },
    ],
    [selectedServiceId, selectedLocationIds, slotDate, slots],
  );

  const currentStep = steps.findIndex((s) => !s.isComplete);
  const isFormComplete = steps.every((s) => s.isComplete);

  // Handlers
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
        slotDate: slotDate!.toISOString().split("T")[0], // YYYY-MM-DD
        slots: slots.map(({ startTime, endTime, maxCapacity }) => ({ startTime, endTime, maxCapacity })),
      };

      await serviceSlotService.bulkCreate(payload);

      setSubmitResult({
        success: true,
        message: `Tạo thành công ${slots.length * selectedLocationIds.length} slots cho dịch vụ ${selectedService?.name}`,
      });

      // Reset form sau 3 giây
      setTimeout(() => {
        router.push("/slots");
      }, 2500);
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Có lỗi xảy ra khi tạo slots. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="size-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Tạo Khung Giờ Booking</h1>
                <p className="text-sm text-muted-foreground">Chỉ áp dụng cho dịch vụ chưa có slot</p>
              </div>
            </div>
            <StepIndicator currentStep={currentStep === -1 ? 3 : currentStep} steps={steps} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Main Form */}
            <div className="space-y-6">
              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">1. Chọn Dịch vụ</CardTitle>
                  <CardDescription>Chọn dịch vụ chưa có khung giờ booking</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedServiceId.toString()}
                    onValueChange={(value) => setSelectedServiceId(Number(value))}
                  >
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Chọn dịch vụ..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableServices.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Location Selection */}
              <Card className={cn(!selectedServiceId && "opacity-50")}>
                <CardHeader>
                  <CardTitle className="text-base">2. Chọn Trung tâm</CardTitle>
                  <CardDescription>Chọn một hoặc nhiều trung tâm</CardDescription>
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
                  <CardTitle className="text-base">3. Chọn Ngày</CardTitle>
                  <CardDescription>Ngày áp dụng khung giờ</CardDescription>
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
                        {slotDate ? format(slotDate, "EEEE, dd/MM/yyyy") : "Chọn ngày"}
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
                      <CardTitle className="text-base">4. Cấu hình Khung giờ</CardTitle>
                      <CardDescription>Định nghĩa các khung giờ và sức chứa</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddSlot} disabled={!slotDate}>
                      <PlusIcon className="size-4 mr-1" />
                      Thêm khung
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

            {/* Sidebar Preview */}
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
                    Đang tạo slots...
                  </>
                ) : (
                  <>
                    <CheckIcon className="size-4" />
                    TẠO {slots.length * selectedLocationIds.length || 0} SLOTS
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
                  <p className="text-sm">{submitResult.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
