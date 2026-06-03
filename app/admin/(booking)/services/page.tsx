"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Pencil, Trash2, Plus } from "lucide-react";

import { serviceService } from "@/services/booking/service.service";

import { ServiceDTO } from "@/types/booking/service-type";

import ConfirmModal from "@/components/confirm-modal";

const ITEMS_PER_PAGE = 6;

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceDTO[]>([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const data = await serviceService.getAll();

      setServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      await serviceService.remove(deleteId);

      setServices((prev) => prev.filter((item) => item.id !== deleteId));

      setDeleteId(null);
    } catch (error) {
      console.error(error);

      alert("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedServices = services.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl   font-bold">Service Management</h1>

              <p className="mt-2    text-muted-foreground">Manage booking services</p>
            </div>

            <Link
              href="/admin/services/create"
              className="flex items-center gap-2 rounded-md bg-primary px-2 py-2    font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus size={18} />
              Create Service
            </Link>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <table className="w-full border-collapse">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-2 text-left    font-semibold">#</th>

                  <th className="px-6 py-2 text-left    font-semibold">Name</th>

                  <th className="px-6 py-2 text-left    font-semibold">Category</th>

                  <th className="px-6 py-2 text-left    font-semibold">Duration</th>

                  <th className="px-6 py-2 text-left    font-semibold">Price</th>

                  <th className="px-6 py-2 text-center    font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      No services found
                    </td>
                  </tr>
                ) : (
                  paginatedServices.map((service, index) => (
                    <tr key={service.id} className="border-t border-border transition hover:bg-accent/40">
                      <td className="px-6 py-2    text-muted-foreground">{startIndex + index + 1}</td>

                      <td className="px-6 py-2 max-w-45 truncate font-medium">
                        <Link
                          href={`/admin/services/${service.slug}`}
                          className="transition max-w-45 truncate hover:text-primary"
                        >
                          {service.name}
                        </Link>
                      </td>

                      <td className="px-6 py-2  max-w-45 truncate   text-muted-foreground">{service.categoryName}</td>

                      <td className="px-6 py-2    text-muted-foreground">{service.durationMinutes} mins</td>

                      <td className="px-6 py-2    text-muted-foreground">{service.price.toLocaleString()}đ</td>

                      <td className="px-6 py-2">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            href={`/admin/services/${service.slug}`}
                            className="rounded-xl border border-border p-2 transition hover:bg-accent"
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            onClick={() => setDeleteId(service.id)}
                            className="rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30"
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

            {/* PAGINATION */}
            {!loading && services.length > 0 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <p className="   text-muted-foreground">
                  Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, services.length)} of{" "}
                  {services.length}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-xl border border-border px-4 py-2    transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`rounded-xl px-4 py-2    transition ${
                        currentPage === index + 1
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:bg-accent"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="rounded-xl border border-border px-4 py-2    transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        variant="danger"
        loading={deleteLoading}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
