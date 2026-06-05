"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { categoryService } from "@/services/booking/category.service";
import { toast } from "sonner";
import { CategoryDTO } from "@/types/booking/category-type";
import CategoryForm from "../_components/category-form";

export default function CategoryDetailPage() {
  const params = useParams();

  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<CategoryDTO | null>(null);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const data = await categoryService.getBySlug(slug);

      console.log("Category >>> : ", data);

      setCategory(data);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load category.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!category) {
    return <div className="p-10 text-center">Category not found</div>;
  }

  return <CategoryForm mode="update" initialData={category} />;
}
