// app/(admin)/locations/page.tsx

"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Pencil, Trash2, Plus } from "lucide-react";

import { locationService } from "@/services/booking/location.service";

import { LocationDTO } from "@/types/booking/location-type";

import ConfirmModal from "@/components/confirm-modal";

const ITEMS_PER_PAGE = 6;

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationDTO[]>([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);

      const data = await locationService.getAll();

      setLocations(data);
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

      await locationService.remove(deleteId);

      setLocations((prev) => prev.filter((item) => item.id !== deleteId));

      setDeleteId(null);
    } catch (error) {
      console.error(error);

      alert("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil(locations.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedLocations = locations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Location Management</h1>

              <p className="mt-2 text-sm text-muted-foreground">Manage booking locations</p>
            </div>

            <Link
              href="/locations/create"
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus size={18} />
              Create Location
            </Link>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <table className="w-full border-collapse">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">#</th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">Address</th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">Working Hours</th>

                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : locations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      No locations found
                    </td>
                  </tr>
                ) : (
                  paginatedLocations.map((location, index) => (
                    <tr key={location.id} className="border-t border-border transition hover:bg-accent/40">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{startIndex + index + 1}</td>

                      <td className="px-6 py-4 font-medium">
                        <Link href={`/locations/${location.slug}`} className="transition hover:text-primary">
                          {location.name}
                        </Link>
                      </td>

                      <td className="max-w-xs truncate px-6 py-4 text-sm text-muted-foreground">
                        {location.address || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">{location.phone || "-"}</td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {location.openTime || "--:--"} - {location.closeTime || "--:--"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            href={`/locations/${location.slug}`}
                            className="rounded-xl border border-border p-2 transition hover:bg-accent"
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            onClick={() => setDeleteId(location.id)}
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
            {!loading && locations.length > 0 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, locations.length)} of{" "}
                  {locations.length}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-xl border border-border px-4 py-2 text-sm transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`rounded-xl px-4 py-2 text-sm transition ${
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
                    className="rounded-xl border border-border px-4 py-2 text-sm transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <ConfirmModal
        open={!!deleteId}
        variant="danger"
        loading={deleteLoading}
        title="Delete Location"
        description="Are you sure you want to delete this location? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
