// "use client";
// import { format } from "date-fns";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Check, X, Eye, User } from "lucide-react";

// import { bookingService } from "@/services/booking/booking.service";
// import { BookingDTO } from "@/types/booking/booking-type";

// const ITEMS_PER_PAGE = 6;

// export default function BookingsPage() {
//   const [data, setData] = useState<BookingDTO[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await bookingService.getAll();
//       setData(res.content);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirm = async (id: number) => {
//     await bookingService.confirm(id);
//     fetchData();
//   };

//   const handleReject = async (id: number) => {
//     await bookingService.reject(id);
//     fetchData();
//   };

//   const canUpdate = (status: string) => status === "PENDING";

//   const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginated = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const statusStyle = (status: string) => {
//     switch (status) {
//       case "CONFIRMED":
//         return "bg-green-50 text-green-700 border-green-200";
//       case "REJECTED":
//       case "CANCELLED":
//         return "bg-red-50 text-red-700 border-red-200";
//       default:
//         return "bg-yellow-50 text-yellow-700 border-yellow-200";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <div className="mx-auto max-w-7xl">
//         {/* HEADER */}
//         <div className="mb-8">
//           <h1 className="text-xl font-bold">Booking Management</h1>
//           <p className="mt-2    text-muted-foreground">Manage all service bookings</p>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
//           <table className="w-full">
//             <thead className="border-b border-border bg-muted/50">
//               <tr>
//                 <th className="px-6 py-2 text-left    font-semibold">#</th>
//                 <th className="px-2 py-2 text-left    font-semibold">Service</th>
//                 <th className="px-2 py-2 text-left    font-semibold">Location</th>
//                 <th className="px-6 py-2 text-left    font-semibold">User</th>
//                 <th className="px-6 py-2 text-left    font-semibold">Status</th>
//                 <th className="px-6 py-2 text-left    font-semibold">Date</th>
//                 <th className="px-6 py-2 text-center    font-semibold">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : data.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
//                     No bookings found
//                   </td>
//                 </tr>
//               ) : (
//                 paginated.map((b, index) => (
//                   <tr key={b.id} className="border-t border-border hover:bg-accent/40">
//                     {/* STT */}
//                     <td className="px-6 py-2    text-muted-foreground">{startIndex + index + 1}</td>

//                     {/* SERVICE */}
//                     <td className="px-2 py-2 max-w-40 text-muted-foreground truncate font-medium">{b.serviceName}</td>

//                     {/* LOCATION */}
//                     <td className="px-2 py-2 max-w-40 truncate   text-muted-foreground">{b.locationName}</td>

//                     {/* USER */}
//                     <td className="px-2 py-2">
//                       <div className="flex items-center gap-2">
//                         <User size={16} className="text-muted-foreground" />
//                         <div className="  ">
//                           <div className="font-medium max-w-20 text-muted-foreground truncate">
//                             {b.userDTO?.fullName || "Unknown"}
//                           </div>
//                           <div className="text-xs max-w-45 truncate text-muted-foreground">{b.userDTO?.phone}</div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* STATUS (FIXED COLORS) */}
//                     <td className="px-2 py-2">
//                       <span
//                         className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyle(
//                           b.status,
//                         )}`}
//                       >
//                         {b.status}
//                       </span>
//                     </td>
//                     <td className="px-2 py-2 text-muted-foreground">
//                       {" "}
//                       {format(new Date(b.createdAt), "dd/MM/yyyy HH:mm")}
//                     </td>
//                     {/* ACTIONS */}
//                     <td className="px-2 py-2">
//                       <div className="flex items-center justify-start gap-2">
//                         {/* VIEW */}
//                         <Link href={`/admin/bookings/${b.id}`} className="rounded-xl p-2 transition hover:bg-accent">
//                           <Eye size={18} />
//                         </Link>

//                         {/* ONLY PENDING */}
//                         {canUpdate(b.status) && (
//                           <>
//                             <button
//                               onClick={() => handleConfirm(b.id)}
//                               className="rounded-xl border border-green-200 p-2 text-green-600 transition hover:bg-green-50"
//                             >
//                               <Check size={18} />
//                             </button>

//                             <button
//                               onClick={() => handleReject(b.id)}
//                               className="rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
//                             >
//                               <X size={18} />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* PAGINATION */}
//           {!loading && data.length > 0 && (
//             <div className="flex items-center justify-between border-t border-border px-6 py-2">
//               <p className="   text-muted-foreground">
//                 Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, data.length)} of {data.length}
//               </p>

//               <div className="flex gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => p - 1)}
//                   className="rounded-xl border px-4 py-2    disabled:opacity-50"
//                 >
//                   Previous
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`rounded-xl px-4 py-2    ${
//                       currentPage === i + 1 ? "bg-primary text-primary-foreground" : "border hover:bg-accent"
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((p) => p + 1)}
//                   className="rounded-xl border px-4 py-2    disabled:opacity-50"
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
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Eye, User } from "lucide-react";

import { bookingService } from "@/services/booking/booking.service";
import { BookingDTO } from "@/types/booking/booking-type";
import { PageResponse } from "@/types/page-response";

const ITEMS_PER_PAGE = 1; // Bạn có thể thay đổi số lượng hiển thị mỗi trang

export default function BookingsPage() {
  const [pageData, setPageData] = useState<PageResponse<BookingDTO> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data với phân trang từ backend
  const fetchData = async (page: number) => {
    try {
      setLoading(true);

      const response = await bookingService.getAll({
        page: page - 1, // Backend thường dùng 0-based
        size: ITEMS_PER_PAGE,
        // sort: "createdAt,desc" // Nếu muốn sort có thể mở comment
      });

      setPageData(response);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleConfirm = async (id: number) => {
    await bookingService.confirm(id);
    fetchData(currentPage); // Refresh trang hiện tại
  };

  const handleReject = async (id: number) => {
    await bookingService.reject(id);
    fetchData(currentPage);
  };

  const canUpdate = (status: string) => status === "PENDING";

  const statusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-50 text-green-700 border-green-200";
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const totalPages = pageData?.totalPages ?? 0;
  const bookings = pageData?.content ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-xl font-bold">Booking Management</h1>
          <p className="mt-2 text-muted-foreground">Manage all service bookings</p>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">#</th>
                <th className="px-3 py-3 text-left font-semibold">Service</th>
                <th className="px-3 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">User</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Created At</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Không có booking nào
                  </td>
                </tr>
              ) : (
                bookings.map((b, index) => (
                  <tr key={b.id} className="border-t border-border hover:bg-accent/40">
                    <td className="px-6 py-3 text-muted-foreground">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

                    <td className="px-3 py-3 max-w-40 truncate font-medium text-muted-foreground">{b.serviceName}</td>

                    <td className="px-3 py-3 max-w-40 truncate text-muted-foreground">{b.locationName || "-"}</td>

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        <div>
                          <div className="font-medium truncate max-w-32">{b.userDTO?.fullName || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{b.userDTO?.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyle(
                          b.status,
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-muted-foreground">
                      {format(new Date(b.createdAt), "dd/MM/yyyy HH:mm")}
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/bookings/${b.id}`} className="rounded-xl p-2 hover:bg-accent transition">
                          <Eye size={18} />
                        </Link>

                        {canUpdate(b.status) && (
                          <>
                            <button
                              onClick={() => handleConfirm(b.id)}
                              className="rounded-xl border border-green-200 p-2 text-green-600 hover:bg-green-50 transition"
                            >
                              <Check size={18} />
                            </button>

                            <button
                              onClick={() => handleReject(b.id)}
                              className="rounded-xl border border-red-200 p-2 text-red-500 hover:bg-red-50 transition"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION - SERVER SIDE */}
          {!loading && pageData && totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, pageData.totalElements)} của {pageData.totalElements} booking
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={pageData.first}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="rounded-xl border px-4 py-2 disabled:opacity-50 hover:bg-accent transition"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`rounded-xl px-4 py-2 transition ${
                      currentPage === i + 1 ? "bg-primary text-primary-foreground" : "border hover:bg-accent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={pageData.last}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="rounded-xl border px-4 py-2 disabled:opacity-50 hover:bg-accent transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
