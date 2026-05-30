// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Edit, Trash2, Eye, Plus } from "lucide-react";

// import { serviceSlotService } from "@/services/booking/service-slot.service";
// import { serviceService } from "@/services/booking/service.service";

// import { ServiceSlotDTO } from "@/types/booking/service-slot-type";
// import { ServiceDTO } from "@/types/booking/service-type";

// const ITEMS_PER_PAGE = 8;

// export default function ServiceSlotsPage() {
//   const [slots, setSlots] = useState<ServiceSlotDTO[]>([]);
//   const [services, setServices] = useState<ServiceDTO[]>([]);

//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [filterServiceId, setFilterServiceId] = useState<string>("");
//   const [filterDate, setFilterDate] = useState("");

//   useEffect(() => {
//     fetchData();
//     serviceService.getAll().then(setServices);
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filterServiceId, filterDate]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await serviceSlotService.getAll();
//       setSlots(res);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Bạn có chắc muốn xóa slot này?")) return;
//     await serviceSlotService.remove(id);
//     fetchData();
//   };

//   const filteredSlots = slots.filter((slot) => {
//     const matchService = !filterServiceId || slot.serviceId === Number(filterServiceId);
//     const matchDate = !filterDate || slot.slotDate === filterDate;
//     return matchService && matchDate;
//   });

//   const totalPages = Math.ceil(filteredSlots.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginated = filteredSlots.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   // ==================== PAGINATION HELPER ====================
//   const getPaginationNumbers = (): (number | string)[] => {
//     if (totalPages <= 7) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }

//     const pages: (number | string)[] = [1];

//     if (currentPage > 3) {
//       pages.push("...");
//     }

//     const start = Math.max(2, currentPage - 1);
//     const end = Math.min(totalPages - 1, currentPage + 1);

//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }

//     if (currentPage < totalPages - 2) {
//       pages.push("...");
//     }

//     if (totalPages > 1) {
//       pages.push(totalPages);
//     }

//     return pages;
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <div className="mx-auto max-w-7xl">
//         {/* HEADER */}
//         <div className="mb-8 flex items-end justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">Quản lý Slot Dịch vụ</h1>
//             <p className="mt-2 text-sm text-muted-foreground">Quản lý các khung giờ đặt lịch</p>
//           </div>

//           <Link
//             href="/slots/create"
//             className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600"
//           >
//             <Plus size={20} />
//             Tạo Slot Mới
//           </Link>
//         </div>

//         {/* FILTER */}
//         <div className="mb-6 flex gap-4">
//           <div>
//             <label className="text-sm font-medium">Dịch vụ</label>
//             <select
//               value={filterServiceId}
//               onChange={(e) => setFilterServiceId(e.target.value)}
//               className="mt-1 w-72 rounded-lg border px-3 py-2"
//             >
//               <option value="">Tất cả dịch vụ</option>
//               {services.map((service) => (
//                 <option key={service.id} value={service.id}>
//                   {service.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Ngày</label>
//             <input
//               type="date"
//               value={filterDate}
//               onChange={(e) => setFilterDate(e.target.value)}
//               className="mt-1 rounded-lg border px-3 py-2"
//             />
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
//           <table className="w-full">
//             <thead className="border-b bg-muted/50">
//               <tr>
//                 <th className="px-6 py-4 text-left">STT</th>
//                 <th className="px-6 py-4 text-left">Dịch vụ</th>
//                 <th className="px-6 py-4 text-left">Trung tâm</th>
//                 <th className="px-6 py-4 text-left">Ngày</th>
//                 <th className="px-6 py-4 text-left">Giờ</th>
//                 <th className="px-6 py-4 text-center">Sức chứa</th>
//                 <th className="px-6 py-4 text-center">Đã đặt</th>
//                 <th className="px-6 py-4 text-center">Hành động</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={8} className="py-20 text-center text-muted-foreground">
//                     Đang tải...
//                   </td>
//                 </tr>
//               ) : paginated.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="py-20 text-center text-muted-foreground">
//                     Không có slot nào
//                   </td>
//                 </tr>
//               ) : (
//                 paginated.map((slot, index) => (
//                   <tr key={slot.id} className="border-t hover:bg-accent/40">
//                     <td className="px-6 py-4 text-sm text-muted-foreground">{startIndex + index + 1}</td>
//                     <td className="px-6 py-4 font-medium">{slot.serviceId}</td>
//                     <td className="px-6 py-4 text-sm text-muted-foreground">{slot.locationId}</td>
//                     <td className="px-6 py-4">{slot.slotDate}</td>
//                     <td className="px-6 py-4 font-medium">
//                       {slot.startTime} - {slot.endTime}
//                     </td>
//                     <td className="px-6 py-4 text-center">{slot.maxCapacity}</td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="font-medium text-orange-600">
//                         {slot.bookedCount}/{slot.maxCapacity}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex justify-center gap-2">
//                         <Link href={`slots/${slot.id}`} className="rounded-xl p-2 hover:bg-accent">
//                           <Eye size={18} />
//                         </Link>
//                         <Link href={`/slots/edit/${slot.id}`} className="rounded-xl p-2 text-blue-600 hover:bg-accent">
//                           <Edit size={18} />
//                         </Link>
//                         <button
//                           onClick={() => handleDelete(slot.id)}
//                           className="rounded-xl p-2 text-red-600 hover:bg-red-50"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* PAGINATION - ĐÃ CẢI TIẾN */}
//           {!loading && filteredSlots.length > 0 && (
//             <div className="flex items-center justify-between border-t border-border px-6 py-4">
//               <p className="text-sm text-muted-foreground">
//                 Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredSlots.length)} /{" "}
//                 {filteredSlots.length}
//               </p>

//               <div className="flex gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => p - 1)}
//                   className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50 hover:bg-accent"
//                 >
//                   Previous
//                 </button>

//                 {getPaginationNumbers().map((page, index) => (
//                   <button
//                     key={index}
//                     onClick={() => typeof page === "number" && setCurrentPage(page)}
//                     disabled={page === "..."}
//                     className={`rounded-xl px-4 py-2 text-sm ${
//                       page === currentPage
//                         ? "bg-primary text-white"
//                         : page === "..."
//                           ? "cursor-default text-muted-foreground"
//                           : "border hover:bg-accent"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((p) => p + 1)}
//                   className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50 hover:bg-accent"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Plus, Search } from "lucide-react";

import { serviceSlotService } from "@/services/booking/service-slot.service";
import { serviceService } from "@/services/booking/service.service";
import { locationService } from "@/services/booking/location.service";

import { ServiceSlotDTO } from "@/types/booking/service-slot-type";
import { ServiceDTO } from "@/types/booking/service-type";
import { LocationDTO } from "@/types/booking/location-type";

const ITEMS_PER_PAGE = 8;

export default function ServiceSlotsPage() {
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [slots, setSlots] = useState<ServiceSlotDTO[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | "">("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | "">("");
  const [selectedDate, setSelectedDate] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

  // Load Services ban đầu
  useEffect(() => {
    serviceService.getAll().then((data) => {
      setServices(data);
      setLoadingServices(false);
    });
  }, []);

  // Load Locations khi chọn Service
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
      alert("Vui lòng chọn Dịch vụ và Trung tâm");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const allSlots = await serviceSlotService.getAll();
      let filtered = allSlots.filter(
        (slot) => slot.serviceId === Number(selectedServiceId) && slot.locationId === Number(selectedLocationId),
      );

      if (selectedDate) {
        filtered = filtered.filter((slot) => slot.slotDate === selectedDate);
      }

      setSlots(filtered);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa slot này?")) return;
    await serviceSlotService.remove(id);
    handleSearch(); // Refresh lại danh sách
  };

  const totalPages = Math.ceil(slots.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = slots.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Pagination helper (giữ nguyên logic đẹp)
  const getPaginationNumbers = (): (number | string)[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | string)[] = [1];
    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Slot Dịch vụ</h1>
            <p className="mt-2 text-sm text-muted-foreground">Chọn dịch vụ và trung tâm để xem danh sách slots</p>
          </div>

          <Link
            href="/slots/create"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600"
          >
            <Plus size={20} />
            Tạo Slot Mới
          </Link>
        </div>

        {/* SELECTORS */}
        <div className="mb-8 rounded-xl border bg-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Dịch vụ</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-3"
                disabled={loadingServices}
              >
                <option value="">-- Chọn dịch vụ --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Trung tâm</label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-3"
                disabled={!selectedServiceId}
              >
                <option value="">-- Chọn trung tâm --</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Ngày</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-3"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!selectedServiceId || !selectedLocationId || loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Search size={18} />
                {loading ? "Đang tải..." : "Xem Danh sách Slots"}
              </button>
            </div>
          </div>
        </div>

        {/* TABLE - Chỉ hiển thị sau khi đã search */}
        {hasSearched && (
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left">STT</th>
                  <th className="px-6 py-4 text-left">Ngày</th>
                  <th className="px-6 py-4 text-left">Giờ</th>
                  <th className="px-6 py-4 text-center">Sức chứa</th>
                  <th className="px-6 py-4 text-center">Đã đặt</th>
                  <th className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      Đang tải...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-muted-foreground">
                      Không có slot nào cho lựa chọn này
                    </td>
                  </tr>
                ) : (
                  paginated.map((slot, index) => (
                    <tr key={slot.id} className="border-t hover:bg-accent/40">
                      <td className="px-6 py-4">{startIndex + index + 1}</td>
                      <td className="px-6 py-4">{slot.slotDate}</td>
                      <td className="px-6 py-4 font-medium">
                        {slot.startTime} - {slot.endTime}
                      </td>
                      <td className="px-6 py-4 text-center">{slot.maxCapacity}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-orange-600">
                          {slot.bookedCount}/{slot.maxCapacity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {/* <Link href={`/slots/${slot.id}`} className="rounded-xl p-2 hover:bg-accent">
                            <Eye size={18} />
                          </Link> */}
                          <Link href={`/slots/${slot.id}`} className="rounded-xl p-2 text-blue-600 hover:bg-accent">
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(slot.id)}
                            className="rounded-xl p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {!loading && slots.length > 0 && (
              <div className="flex items-center justify-between border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, slots.length)} / {slots.length}
                </p>

                <div className="flex gap-2">
                  {/* Previous, Numbers, Next buttons giống như trước */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50 hover:bg-accent"
                  >
                    Previous
                  </button>

                  {getPaginationNumbers().map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof page === "number" && setCurrentPage(page)}
                      disabled={page === "..."}
                      className={`rounded-xl px-4 py-2 text-sm ${
                        page === currentPage
                          ? "bg-primary text-white"
                          : page === "..."
                            ? "text-muted-foreground"
                            : "border hover:bg-accent"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50 hover:bg-accent"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
