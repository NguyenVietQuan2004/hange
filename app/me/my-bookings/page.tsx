"use client";
import { format } from "date-fns";

import {
  Calendar as CalendarIconLucide,
  MapPinIcon,
  Clock,
  Scissors,
  CheckCircle,
  CreditCard,
  FileText,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Eye, Ban } from "lucide-react";

import { bookingService } from "@/services/booking/booking.service";
import { BookingDTO } from "@/types/booking/booking-type";

const ITEMS_PER_PAGE = 10;

export default function MyBookingsPage() {
  const [data, setData] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCancelId, setLoadingCancelId] = useState<number | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      setLoadingCancelId(id);
      await bookingService.cancel(id);
      await fetchData();
    } finally {
      setLoadingCancelId(null);
    }
  };

  const openDetail = (booking: BookingDTO) => {
    setSelectedBooking(booking);
  };

  const closeDetail = () => {
    setSelectedBooking(null);
  };

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const canCancel = (status: string) => status === "PENDING";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-xl font-bold tracking-tight">My Bookings</h1>
          <p className="   text-muted-foreground">View and manage your bookings</p>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-2 text-left text-xs font-semibold uppercase">#</th>
                <th className="px-6 py-2 text-left text-xs font-semibold uppercase">Service</th>
                <th className="px-6 py-2 text-left text-xs font-semibold uppercase">Location</th>
                <th className="px-6 py-2 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-6 py-2 text-left    font-semibold">Date</th>

                <th className="px-6 py-2 text-center text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground">
                    No bookings found
                  </td>
                </tr>
              ) : (
                paginated.map((b, index) => (
                  <tr key={b.id} className="hover:bg-accent/40 transition border-border">
                    {/* STT */}
                    <td className="px-6 py-2    text-muted-foreground">{startIndex + index + 1}</td>

                    {/* SERVICE */}
                    <td className="px-6 py-2 max-w-45 truncate text-muted-foreground font-medium">{b.serviceName}</td>

                    {/* LOCATION */}
                    <td className="px-6 py-2 max-w-45 truncate   text-muted-foreground">{b.locationName}</td>

                    {/* STATUS */}
                    <td className="px-6 py-2">
                      <span
                        className={`inline-flex rounded-full  border px-3 py-1 text-xs font-medium ${statusStyle(
                          b.status,
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-muted-foreground">
                      {" "}
                      {format(new Date(b.createdAt), "dd/MM/yyyy HH:mm")}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-2">
                      <div className="flex items-center justify-end gap-2">
                        {/* VIEW (MODAL) */}

                        {/* CANCEL */}
                        {canCancel(b.status) && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            disabled={loadingCancelId === b.id}
                            className="rounded-lg border-red-200 p-2 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                          >
                            <Ban size={18} />
                          </button>
                        )}

                        <button onClick={() => openDetail(b)} className="rounded-lg p-2 hover:bg-accent transition">
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          {!loading && data.length > 0 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <p className="   text-muted-foreground">
                Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, data.length)} of {data.length}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="rounded-lg border px-4 py-2    hover:bg-accent disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`rounded-lg px-4 py-2    ${
                      currentPage === i + 1 ? "bg-primary text-primary-foreground" : "border hover:bg-accent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="rounded-lg border px-4 py-2    hover:bg-accent disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE BOOKING */}
      {/* <div className="mt-20">
        <CreateBookingPage />
      </div> */}

      {/* MODAL DETAIL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeDetail}>
          <div className="w-full max-w-2xl rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CalendarIconLucide className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Booking #{selectedBooking.id}</h2>
              </div>

              <button
                onClick={closeDetail}
                className="rounded-lg px-4 py-2    hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Đóng
              </button>
            </div>

            {/* CONTENT */}
            <div className="space-y-5   ">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Scissors className="h-5 w-5" />
                  <span>Dịch vụ</span>
                </div>
                <span className="font-medium">{selectedBooking.serviceName}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPinIcon className="h-5 w-5" />
                  <span>Trung tâm</span>
                </div>
                <span className="font-medium">{selectedBooking.locationName}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5" />
                  <span>Trạng thái</span>
                </div>
                <span className="font-medium">{selectedBooking.status}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CreditCard className="h-5 w-5" />
                  <span>Giá</span>
                </div>
                <span className="font-medium">{selectedBooking.servicePrice?.toLocaleString()} ₫</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>Thời lượng</span>
                </div>
                <span className="font-medium">{selectedBooking.serviceDuration} phút</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                  <CalendarIconLucide className="h-5 w-5" />
                  <span>Thời gian</span>
                </div>
                <div className="font-medium pl-8">
                  {selectedBooking.slotDate} | {selectedBooking.slotTimeStart} - {selectedBooking.slotTimeEnd}
                </div>
              </div>

              {selectedBooking.note && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 text-muted-foreground mb-2">
                    <FileText className="h-5 w-5" />
                    <span>Ghi chú</span>
                  </div>
                  <div className="pl-8">{selectedBooking.note}</div>
                </div>
              )}

              {selectedBooking.userDTO && (
                <>
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3 text-muted-foreground mb-2">
                      <User className="h-5 w-5" />
                      <span>Khách hàng</span>
                    </div>
                    <div className="pl-8">
                      <div className="font-medium">{selectedBooking.userDTO.fullName}</div>
                      <div className="text-xs text-muted-foreground">{selectedBooking.userDTO.email}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <CalendarIconLucide className="h-5 w-5" />
                      <span>Ngày tạo</span>
                    </div>

                    <span className="font-medium">
                      {format(new Date(selectedBooking.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
