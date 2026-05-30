// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Plus, Trash2, ArrowLeft, Save, Calendar } from "lucide-react";

// import { serviceSlotService } from "@/services/booking/service-slot.service";
// import { serviceService } from "@/services/booking/service.service";
// import { locationService } from "@/services/booking/location.service";

// import { ServiceDTO } from "@/types/booking/service-type";
// import { LocationDTO } from "@/types/booking/location-type";
// import { ServiceSlotDTO, UpdateServiceSlotRequest, CreateServiceSlotRequest } from "@/types/booking/service-slot-type";

// export default function ManageServiceSlotsPage() {
//   const router = useRouter();

//   const [services, setServices] = useState<ServiceDTO[]>([]);
//   const [locations, setLocations] = useState<LocationDTO[]>([]);
//   const [slots, setSlots] = useState<ServiceSlotDTO[]>([]);

//   const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
//   const [selectedLocationId, setSelectedLocationId] = useState<number | "">("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     serviceService.getAll().then(setServices);
//     locationService.getAll().then(setLocations);
//   }, []);

//   const loadSlots = async () => {
//     if (!selectedServiceId || !selectedLocationId) {
//       alert("Vui lòng chọn Dịch vụ và Trung tâm");
//       return;
//     }

//     setLoading(true);
//     try {
//       const allSlots = await serviceSlotService.getAll();
//       const filtered = allSlots.filter(
//         (s) => s.serviceId === Number(selectedServiceId) && s.locationId === Number(selectedLocationId),
//       );
//       setSlots(filtered);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Group slots by date
//   const groupedSlots = slots.reduce(
//     (acc, slot) => {
//       const date = slot.slotDate;
//       if (!acc[date]) acc[date] = [];
//       acc[date].push(slot);
//       return acc;
//     },
//     {} as Record<string, ServiceSlotDTO[]>,
//   );

//   const sortedDates = Object.keys(groupedSlots).sort();

//   const updateSlot = async (slotId: number, updatedData: Partial<ServiceSlotDTO>) => {
//     try {
//       const payload: UpdateServiceSlotRequest = {
//         slotDate: updatedData.slotDate,
//         startTime: updatedData.startTime,
//         endTime: updatedData.endTime,
//         maxCapacity: updatedData.maxCapacity,
//       };
//       await serviceSlotService.update(slotId, payload);
//       loadSlots();
//     } catch (err) {
//       alert("Cập nhật thất bại");
//     }
//   };

//   const saveNewSlot = async (index: number) => {
//     const slot = slots[index];
//     if (!slot.slotDate || !slot.startTime || !slot.endTime) {
//       alert("Vui lòng nhập đầy đủ Ngày, Giờ bắt đầu và Giờ kết thúc");
//       return;
//     }

//     try {
//       const payload: CreateServiceSlotRequest = {
//         serviceId: Number(selectedServiceId),
//         locationId: Number(selectedLocationId),
//         slotDate: slot.slotDate,
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//         maxCapacity: slot.maxCapacity || 5,
//       };

//       await serviceSlotService.create(payload);
//       alert("Tạo slot mới thành công!");
//       loadSlots();
//     } catch (err) {
//       alert("Tạo slot thất bại");
//     }
//   };

//   const deleteSlot = async (slotId: number) => {
//     if (!confirm("Bạn có chắc muốn xóa slot này?")) return;
//     try {
//       await serviceSlotService.remove(slotId);
//       loadSlots();
//     } catch (err) {
//       alert("Xóa thất bại");
//     }
//   };

//   const addNewSlot = () => {
//     const newSlot: ServiceSlotDTO = {
//       id: Date.now(),
//       serviceId: Number(selectedServiceId),
//       locationId: Number(selectedLocationId),
//       slotDate: "",
//       startTime: "",
//       endTime: "",
//       maxCapacity: 5,
//       bookedCount: 0,
//     };
//     setSlots([...slots, newSlot]);
//   };

//   const isNewSlot = (id: number) => id > 1000000000;

//   const handleInputChange = (index: number, field: keyof ServiceSlotDTO, value: string | number) => {
//     const updatedSlots = [...slots];
//     updatedSlots[index] = { ...updatedSlots[index], [field]: value };
//     setSlots(updatedSlots);
//   };

//   return (
//     <div className="mx-auto max-w-6xl">
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
//           <h1 className="text-2xl font-bold uppercase text-orange-500">QUẢN LÝ SLOT DỊCH VỤ</h1>
//           <div className="h-[3px] w-20 bg-red-500 mt-2" />
//         </div>

//         {/* Filter */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <label className="font-semibold text-sm">Dịch vụ</label>
//             <select
//               value={selectedServiceId}
//               onChange={(e) => setSelectedServiceId(Number(e.target.value))}
//               className="mt-2 w-full rounded-lg border px-4 py-3"
//             >
//               <option value="">-- Chọn dịch vụ --</option>
//               {services.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="font-semibold text-sm">Trung tâm</label>
//             <select
//               value={selectedLocationId}
//               onChange={(e) => setSelectedLocationId(Number(e.target.value))}
//               className="mt-2 w-full rounded-lg border px-4 py-3"
//               disabled={!selectedServiceId}
//             >
//               <option value="">-- Chọn trung tâm --</option>
//               {locations.map((l) => (
//                 <option key={l.id} value={l.id}>
//                   {l.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-end">
//             <button
//               onClick={loadSlots}
//               disabled={!selectedServiceId || !selectedLocationId || loading}
//               className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium disabled:opacity-50"
//             >
//               {loading ? "Đang tải..." : "TẢI DANH SÁCH SLOTS"}
//             </button>
//           </div>
//         </div>

//         {/* ==================== GROUP BY DATE ==================== */}
//         {sortedDates.length > 0 && (
//           <div className="space-y-8">
//             {sortedDates.map((date) => (
//               <div key={date} className="border rounded-2xl overflow-hidden bg-white">
//                 <div className="bg-orange-50 px-6 py-4 border-b flex items-center gap-3">
//                   <Calendar className="text-orange-600" size={24} />
//                   <h2 className="text-lg font-semibold">Ngày: {date}</h2>
//                 </div>

//                 <div className="p-6 space-y-4">
//                   {groupedSlots[date].map((slot) => {
//                     const globalIndex = slots.findIndex((s) => s.id === slot.id);
//                     const isNew = isNewSlot(slot.id);

//                     return (
//                       <div key={slot.id} className="flex flex-wrap items-end gap-4 bg-gray-50 p-5 rounded-xl border">
//                         <div>
//                           <label className="text-xs text-muted-foreground">Giờ bắt đầu</label>
//                           <input
//                             type="time"
//                             value={slot.startTime}
//                             onChange={(e) => handleInputChange(globalIndex, "startTime", e.target.value)}
//                             onBlur={() => !isNew && updateSlot(slot.id, { startTime: slot.startTime })}
//                             className="mt-1 w-40 border rounded-lg px-4 py-2.5"
//                           />
//                         </div>

//                         <div>
//                           <label className="text-xs text-muted-foreground">Giờ kết thúc</label>
//                           <input
//                             type="time"
//                             value={slot.endTime}
//                             onChange={(e) => handleInputChange(globalIndex, "endTime", e.target.value)}
//                             onBlur={() => !isNew && updateSlot(slot.id, { endTime: slot.endTime })}
//                             className="mt-1 w-40 border rounded-lg px-4 py-2.5"
//                           />
//                         </div>

//                         <div>
//                           <label className="text-xs text-muted-foreground">Sức chứa</label>
//                           <input
//                             type="number"
//                             value={slot.maxCapacity}
//                             onChange={(e) => handleInputChange(globalIndex, "maxCapacity", parseInt(e.target.value))}
//                             onBlur={() => !isNew && updateSlot(slot.id, { maxCapacity: slot.maxCapacity })}
//                             min={1}
//                             className="mt-1 w-28 border rounded-lg px-4 py-2.5 text-center"
//                           />
//                         </div>

//                         <div className="ml-auto flex items-center gap-4">
//                           <div className="text-sm font-medium text-orange-600">
//                             {slot.bookedCount} / {slot.maxCapacity}
//                           </div>

//                           {isNew ? (
//                             <button
//                               onClick={() => saveNewSlot(globalIndex)}
//                               className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700"
//                             >
//                               Lưu Slot Mới
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => deleteSlot(slot.id)}
//                               className="text-red-600 hover:bg-red-50 p-3 rounded-xl"
//                             >
//                               <Trash2 size={20} />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-3 pt-4">
//           <button onClick={addNewSlot} className="flex items-center gap-2 px-6 py-3 border rounded-xl hover:bg-gray-50">
//             <Plus size={20} /> Thêm Slot Mới
//           </button>

//           <button
//             onClick={loadSlots}
//             className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
//           >
//             <Save size={20} /> Làm Mới Danh Sách
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Save, Calendar } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    serviceService.getAll().then(setServices);
    locationService.getAll().then(setLocations);
  }, []);

  const loadSlots = async () => {
    if (!selectedServiceId || !selectedLocationId) {
      alert("Vui lòng chọn Dịch vụ và Trung tâm");
      return;
    }

    setLoading(true);
    try {
      const allSlots = await serviceSlotService.getAll();
      let filtered = allSlots.filter(
        (s) => s.serviceId === Number(selectedServiceId) && s.locationId === Number(selectedLocationId),
      );

      // ========== LỌC CHỈ HIỂN THỊ SLOT TƯƠNG LAI ==========
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
      alert("Cập nhật thất bại");
    }
  };

  const saveNewSlot = async (index: number) => {
    const slot = slots[index];
    if (!slot.slotDate || !slot.startTime || !slot.endTime) {
      alert("Vui lòng nhập đầy đủ Ngày, Giờ bắt đầu và Giờ kết thúc");
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
      alert("Tạo slot mới thành công!");
      loadSlots();
    } catch (err) {
      alert("Tạo slot thất bại");
    }
  };

  const deleteSlot = async (slotId: number) => {
    if (!confirm("Bạn có chắc muốn xóa slot này?")) return;
    try {
      await serviceSlotService.remove(slotId);
      loadSlots();
    } catch (err) {
      alert("Xóa thất bại");
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

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      <div className="rounded-xl border bg-white shadow-sm p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold uppercase text-orange-500">QUẢN LÝ SLOT DỊCH VỤ</h1>
          <div className="h-[3px] w-20 bg-red-500 mt-2" />
          <p className="text-sm text-muted-foreground mt-2">Chỉ hiển thị slot có thời gian bắt đầu trong tương lai</p>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-sm">Dịch vụ</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border px-4 py-3"
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
            <label className="font-semibold text-sm">Trung tâm</label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border px-4 py-3"
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

          <div className="flex items-end">
            <button
              onClick={loadSlots}
              disabled={!selectedServiceId || !selectedLocationId || loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? "Đang tải..." : "TẢI DANH SÁCH SLOTS"}
            </button>
          </div>
        </div>

        {/* Group by Date */}
        {sortedDates.length > 0 && (
          <div className="space-y-8">
            {sortedDates.map((date) => (
              <div key={date} className="border rounded-2xl overflow-hidden bg-white">
                <div className="bg-orange-50 px-6 py-4 border-b flex items-center gap-3">
                  <Calendar className="text-orange-600" size={24} />
                  <h2 className="text-lg font-semibold">Ngày: {date}</h2>
                </div>

                <div className="p-6 space-y-4">
                  {groupedSlots[date].map((slot) => {
                    const globalIndex = slots.findIndex((s) => s.id === slot.id);
                    const isNew = isNewSlot(slot.id);

                    return (
                      <div key={slot.id} className="flex flex-wrap items-end gap-4 bg-gray-50 p-5 rounded-xl border">
                        {/* Ngày - Chỉ hiển thị cho slot mới */}
                        {isNew && (
                          <div>
                            <label className="text-xs text-muted-foreground">Ngày</label>
                            <input
                              type="date"
                              value={slot.slotDate}
                              onChange={(e) => handleInputChange(globalIndex, "slotDate", e.target.value)}
                              className="mt-1 w-40 border rounded-lg px-4 py-2.5"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-xs text-muted-foreground">Giờ bắt đầu</label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => handleInputChange(globalIndex, "startTime", e.target.value)}
                            onBlur={() => !isNew && updateSlot(slot.id, { startTime: slot.startTime })}
                            className="mt-1 w-40 border rounded-lg px-4 py-2.5"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground">Giờ kết thúc</label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => handleInputChange(globalIndex, "endTime", e.target.value)}
                            onBlur={() => !isNew && updateSlot(slot.id, { endTime: slot.endTime })}
                            className="mt-1 w-40 border rounded-lg px-4 py-2.5"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground">Sức chứa</label>
                          <input
                            type="number"
                            value={slot.maxCapacity}
                            onChange={(e) => handleInputChange(globalIndex, "maxCapacity", parseInt(e.target.value))}
                            onBlur={() => !isNew && updateSlot(slot.id, { maxCapacity: slot.maxCapacity })}
                            min={1}
                            className="mt-1 w-28 border rounded-lg px-4 py-2.5 text-center"
                          />
                        </div>

                        <div className="ml-auto flex items-center gap-4">
                          <div className="text-sm font-medium text-orange-600">
                            {slot.bookedCount} / {slot.maxCapacity}
                          </div>

                          {isNew ? (
                            <button
                              onClick={() => saveNewSlot(globalIndex)}
                              className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700"
                            >
                              Lưu Slot Mới
                            </button>
                          ) : (
                            <button
                              onClick={() => deleteSlot(slot.id)}
                              className="text-red-600 hover:bg-red-50 p-3 rounded-xl"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button onClick={addNewSlot} className="flex items-center gap-2 px-6 py-3 border rounded-xl hover:bg-gray-50">
            <Plus size={20} /> Thêm Slot Mới
          </button>

          <button
            onClick={loadSlots}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
          >
            <Save size={20} /> Làm Mới Danh Sách
          </button>
        </div>
      </div>
    </div>
  );
}
