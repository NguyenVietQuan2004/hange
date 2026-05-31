"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Pencil, Trash2, Plus } from "lucide-react";

import { categoryService } from "@/services/booking/category.service";

import { CategoryDTO } from "@/types/booking/category-type";

import ConfirmModal from "@/components/confirm-modal";

const ITEMS_PER_PAGE = 6;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await categoryService.getAll();

      setCategories(data);
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

      await categoryService.remove(deleteId);

      setCategories((prev) => prev.filter((item) => item.id !== deleteId));

      setDeleteId(null);
    } catch (error) {
      console.error(error);

      alert("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedCategories = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground ">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className=" text-xl  font-bold">Category Management</h1>

              <p className="mt-2    text-muted-foreground">Manage booking categories</p>
            </div>

            <Link
              href="/categories/create"
              className="flex items-center gap-2 rounded-md bg-primary px-2 py-2    font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus size={18} />
              Create Category
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <table className="w-full border-collapse">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-2 text-left    font-semibold">#</th>

                  <th className="px-6 py-2 text-left    font-semibold">Name</th>

                  <th className="px-6 py-2 text-left    font-semibold">Slug</th>

                  <th className="px-6 py-2 text-left    font-semibold">Description</th>

                  <th className="px-6 py-2 text-center    font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((category, index) => (
                    <tr key={category.id} className="border-t border-border transition hover:bg-accent/40">
                      <td className="px-6  py-2    text-muted-foreground">{startIndex + index + 1}</td>

                      <td className="px-6 max-w-45 truncate py-2 font-medium">
                        <Link href={`/categories/${category.slug}`} className="transition  hover:text-primary">
                          {category.name}
                        </Link>
                      </td>

                      <td className="px-6 py-2    text-muted-foreground">{category.slug}</td>

                      <td className="max-w-xs truncate px-6 py-2    text-muted-foreground">
                        {category.description || "-"}
                      </td>

                      <td className="px-6 py-2">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            href={`/categories/${category.slug}`}
                            className="rounded-xl border border-border p-2 transition hover:bg-accent"
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            onClick={() => setDeleteId(category.id)}
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

            {/* Pagination */}
            {!loading && categories.length > 0 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <p className="   text-muted-foreground">
                  Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, categories.length)} of{" "}
                  {categories.length}
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

      {/* DELETE MODAL */}
      <ConfirmModal
        open={!!deleteId}
        variant="danger"
        loading={deleteLoading}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
