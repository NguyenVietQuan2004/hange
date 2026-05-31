// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { CheckCircle2 } from "lucide-react";

// import { serviceService } from "@/services/booking/service.service";
// import { serviceSlotService } from "@/services/booking/service-slot.service";
// import { locationService } from "@/services/booking/location.service";
// import { bookingService } from "@/services/booking/booking.service";

// import { ServiceDTO } from "@/types/booking/service-type";
// import { LocationDTO } from "@/types/booking/location-type";
// import { ServiceSlotDTO } from "@/types/booking/service-slot-type";

// export default function CreateBookingPage() {
//   const router = useRouter();

//   const [services, setServices] = useState<ServiceDTO[]>([]);
//   const [locations, setLocations] = useState<LocationDTO[]>([]);
//   const [slots, setSlots] = useState<ServiceSlotDTO[]>([]);

//   const [serviceId, setServiceId] = useState<number | null>(null);
//   const [locationId, setLocationId] = useState<number | null>(null);
//   const [date, setDate] = useState("");
//   const [slotId, setSlotId] = useState<number | null>(null);

//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     serviceService.getAll().then(setServices);
//   }, []);

//   /* ================= SERVICE ================= */
//   const handleServiceChange = async (id: number) => {
//     setServiceId(id);
//     setLocationId(null);
//     setDate("");
//     setSlotId(null);

//     const allSlots = await serviceSlotService.getAll();

//     const locationIds = allSlots
//       .filter((s) => s.serviceId === id)
//       .map((s) => s.locationId)
//       .filter((v, i, a) => a.indexOf(v) === i);

//     const allLocations = await locationService.getAll();

//     setLocations(allLocations.filter((l) => locationIds.includes(l.id)));
//   };

//   /* ================= LOCATION ================= */
//   const handleLocationChange = (id: number) => {
//     setLocationId(id);
//     setDate("");
//     setSlotId(null);
//   };

//   /* ================= DATE ================= */
//   const handleDateChange = async (value: string) => {
//     setDate(value);
//     setSlotId(null);

//     if (!serviceId || !locationId) return;

//     const allSlots = await serviceSlotService.getAll();

//     setSlots(allSlots.filter((s) => s.serviceId === serviceId && s.locationId === locationId && s.slotDate === value));
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     if (!slotId) return;

//     setLoading(true);
//     try {
//       await bookingService.create({
//         slotId,
//         note,
//       });

//       router.push("/bookings/me");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-2xl">
//       {/* CARD */}
//       <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
//         {/* TITLE */}
//         <div>
//           <h1 className="  font-bold uppercase text-orange-500">ĐẶT LỊCH HẸN NGAY</h1>
//           <div className="h-[2px] w-16 bg-red-500 mt-2" />
//         </div>

//         {/* SERVICE */}
//         <div>
//           <label className="font-semibold  ">Lựa chọn dịch vụ:</label>

//           <select
//             className="mt-2 w-full rounded-lg border px-3 py-2"
//             value={serviceId ?? ""}
//             onChange={(e) => handleServiceChange(Number(e.target.value))}
//           >
//             <option value="">-- Chọn dịch vụ --</option>
//             {services.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* LOCATION */}
//         <div>
//           <label className="font-semibold  ">Trung tâm:</label>

//           <select
//             className="mt-2 w-full rounded-lg border px-3 py-2 disabled:opacity-50"
//             disabled={!serviceId}
//             value={locationId ?? ""}
//             onChange={(e) => handleLocationChange(Number(e.target.value))}
//           >
//             <option value="">-- Chọn trung tâm --</option>
//             {locations.map((l) => (
//               <option key={l.id} value={l.id}>
//                 {l.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* DATE */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="font-semibold  ">Ngày dự kiến:</label>

//             <input
//               type="date"
//               disabled={!locationId}
//               value={date}
//               onChange={(e) => handleDateChange(e.target.value)}
//               className="mt-2 w-full rounded-lg border px-3 py-2 disabled:opacity-50"
//             />
//           </div>

//           {/* SLOT */}
//           <div>
//             <label className="font-semibold  ">Giờ dự kiến:</label>

//             <select
//               disabled={!date}
//               value={slotId ?? ""}
//               onChange={(e) => setSlotId(Number(e.target.value))}
//               className="mt-2 w-full rounded-lg border px-3 py-2 disabled:opacity-50"
//             >
//               <option value="">-- Chọn giờ --</option>
//               {slots.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.startTime} - {s.endTime} ({s.bookedCount}/{s.maxCapacity})
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* NOTE */}
//         <div>
//           <label className="font-semibold  ">Ghi chú:</label>
//           <input
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             className="mt-2 w-full rounded-lg border px-3 py-2"
//             placeholder="Nhập ghi chú..."
//           />
//         </div>

//         {/* SUMMARY */}
//         <div className="rounded-lg bg-gray-50 p-3   space-y-1">
//           <div>✔ Service: {services.find((s) => s.id === serviceId)?.name || "—"}</div>
//           <div>✔ Location: {locations.find((l) => l.id === locationId)?.name || "—"}</div>
//           <div>
//             ✔ Slot:{" "}
//             {slots.find((s) => s.id === slotId)
//               ? `${slots.find((s) => s.id === slotId)?.startTime} - ${slots.find((s) => s.id === slotId)?.endTime}`
//               : "—"}
//           </div>
//         </div>

//         {/* BUTTON */}
//         <button
//           disabled={!slotId || loading}
//           onClick={handleSubmit}
//           className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white disabled:opacity-50"
//         >
//           <CheckCircle2 className="inline mr-2" />
//           {loading ? "Đang đặt lịch..." : "ĐẶT LỊCH HẸN TỚI TRUNG TÂM"}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { serviceService } from "@/services/booking/service.service";
import { serviceSlotService } from "@/services/booking/service-slot.service";
import { locationService } from "@/services/booking/location.service";
import { bookingService } from "@/services/booking/booking.service";

import { ServiceDTO } from "@/types/booking/service-type";
import { LocationDTO } from "@/types/booking/location-type";
import { ServiceSlotDTO } from "@/types/booking/service-slot-type";

export default function CreateSlotBookingPage() {
  const router = useRouter();

  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [slots, setSlots] = useState<ServiceSlotDTO[]>([]);

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState<number | null>(null);

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD ================= */
  useEffect(() => {
    serviceService.getAll().then(setServices);
  }, []);

  /* ================= SERVICE ================= */
  const handleServiceChange = async (id: number) => {
    setServiceId(id);
    setLocationId(null);
    setDate("");
    setSlotId(null);

    const allSlots = await serviceSlotService.getAll();

    const locationIds = allSlots
      .filter((s) => s.serviceId === id)
      .map((s) => s.locationId)
      .filter((v, i, a) => a.indexOf(v) === i);

    const allLocations = await locationService.getAll();

    setLocations(allLocations.filter((l) => locationIds.includes(l.id)));
  };

  /* ================= LOCATION ================= */
  const handleLocationChange = (id: number) => {
    setLocationId(id);
    setDate("");
    setSlotId(null);
  };

  /* ================= DATE ================= */
  const handleDateChange = async (value: string) => {
    setDate(value);
    setSlotId(null);

    if (!serviceId || !locationId) return;

    const allSlots = await serviceSlotService.getAll();

    setSlots(allSlots.filter((s) => s.serviceId === serviceId && s.locationId === locationId && s.slotDate === value));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!slotId) return;

    setLoading(true);
    try {
      await bookingService.create({
        slotId,
        note,
      });

      router.push("/bookings/me");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* CARD */}
      <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
        {/* TITLE */}
        <div>
          <h1 className="  font-bold uppercase text-orange-500">BOOK APPOINTMENT NOW</h1>
          <div className="h-0.5 w-16 bg-red-500 mt-2" />
        </div>

        {/* SERVICE */}
        <div>
          <label className="font-semibold  ">Select Service:</label>

          <select
            className="mt-2 w-full rounded-lg border px-3 py-2"
            value={serviceId ?? ""}
            onChange={(e) => handleServiceChange(Number(e.target.value))}
          >
            <option value="">-- Select Service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* LOCATION */}
        <div>
          <label className="font-semibold  ">Center:</label>

          <select
            className="mt-2 w-full rounded-lg border px-3 py-2 disabled:opacity-50"
            disabled={!serviceId}
            value={locationId ?? ""}
            onChange={(e) => handleLocationChange(Number(e.target.value))}
          >
            <option value="">-- Select Center --</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold  ">Expected Date:</label>

            <input
              type="date"
              disabled={!locationId}
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="mt-2 w-full rounded-lg border px-3 py-2 disabled:opacity-50"
            />
          </div>

          {/* SLOT */}
          <div>
            <label className="font-semibold  ">Expected Time:</label>

            <select
              disabled={!date}
              value={slotId ?? ""}
              onChange={(e) => setSlotId(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border px-3 py-2 disabled:opacity-50"
            >
              <option value="">-- Select Time Slot --</option>
              {slots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.startTime} - {s.endTime} ({s.bookedCount}/{s.maxCapacity})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* NOTE */}
        <div>
          <label className="font-semibold  ">Note:</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full rounded-lg border px-3 py-2"
            placeholder="Enter note..."
          />
        </div>

        {/* SUMMARY */}
        <div className="rounded-lg bg-gray-50 p-3   space-y-1">
          <div>✔ Service: {services.find((s) => s.id === serviceId)?.name || "—"}</div>
          <div>✔ Location: {locations.find((l) => l.id === locationId)?.name || "—"}</div>
          <div>
            ✔ Slot:{" "}
            {slots.find((s) => s.id === slotId)
              ? `${slots.find((s) => s.id === slotId)?.startTime} - ${slots.find((s) => s.id === slotId)?.endTime}`
              : "—"}
          </div>
        </div>

        {/* BUTTON */}
        <button
          disabled={!slotId || loading}
          onClick={handleSubmit}
          className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white disabled:opacity-50"
        >
          <CheckCircle2 className="inline mr-2" />
          {loading ? "Booking appointment..." : "BOOK APPOINTMENT AT CENTER"}
        </button>
      </div>
    </div>
  );
}
