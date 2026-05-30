"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useForm } from "react-hook-form";

import { Upload, Trash2, ImagePlus, ArrowLeft, Save, FolderPlus, Images, FileText } from "lucide-react";

import { CategoryDTO, CreateCategoryRequest, ImageDTO, UpdateCategoryRequest } from "@/types/booking/category-type";

import { categoryService } from "@/services/booking/category.service";

import { systemService } from "@/services/system.service";

import ContentInput from "@/components/content-blog";

type Props = {
  mode: "create" | "update";

  initialData?: CategoryDTO;
};

type ImageFormType = {
  url: string;

  description?: string;

  file?: File | null;

  preview?: string | null;
};

type FormValues = {
  name: string;

  slug: string;

  description: string;

  content: string;
};

export default function CategoryForm({ mode, initialData }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [imageForms, setImageForms] = useState<ImageFormType[]>(
    initialData?.images?.map((img) => ({
      url: img.url,

      description: img.description,

      preview: img.url,
    })) || [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        content: initialData.content || "",
      });
    }
  }, [initialData, reset]);

  const addImage = () => {
    setImageForms((prev) => [
      ...prev,
      {
        url: "",
        description: "",
        file: null,
        preview: null,
      },
    ]);
  };

  const removeImage = (index: number) => {
    setImageForms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageDescriptionChange = (index: number, value: string) => {
    setImageForms((prev) =>
      prev.map((img, i) =>
        i === index
          ? {
              ...img,
              description: value,
            }
          : img,
      ),
    );
  };

  const handleImageUpload = (index: number, file: File) => {
    setImageForms((prev) =>
      prev.map((img, i) =>
        i === index
          ? {
              ...img,
              file,
              preview: URL.createObjectURL(file),
            }
          : img,
      ),
    );
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      // const uploadedImages = await Promise.all(
      //   imageForms.map(async (img) => {
      //     let imageUrl = img.url;

      //     if (img.file) {
      //       const uploadRes = await systemService.uploadFile({
      //         file: img.file,
      //         folder: "category",
      //       });

      //       imageUrl = uploadRes.filename;
      //     }

      //     return {
      //       url: imageUrl,

      //       description: img.description,
      //     };
      //   }),
      // );

      const uploadedImages: ImageDTO[] = (
        await Promise.all(
          imageForms.map(async (img): Promise<ImageDTO | null> => {
            let imageUrl = img.url;

            // ❌ bỏ qua nếu không có cả file lẫn url
            if (!img.file && !img.url) return null;

            // upload nếu có file
            if (img.file) {
              const uploadRes = await systemService.uploadFile({
                file: img.file,
                folder: "category",
              });

              imageUrl = uploadRes.filename;
            }

            // ❌ nếu sau xử lý vẫn không có url → bỏ
            if (!imageUrl) return null;

            return {
              url: imageUrl,
              description: img.description,
            };
          }),
        )
      ).filter((img): img is ImageDTO => img !== null);

      const payload: CreateCategoryRequest | UpdateCategoryRequest = {
        ...data,

        images: uploadedImages,
      };

      if (mode === "create") {
        await categoryService.create(payload as CreateCategoryRequest);

        toast.success("Create category success");
      } else {
        await categoryService.update(initialData!.id, payload as UpdateCategoryRequest);

        toast.success("Update category success");
      }

      router.push("/categories");
    } catch (error) {
      console.error(error);

      toast.error(mode === "create" ? "Create failed" : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary";

  const textareaClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary";

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <FolderPlus className="h-5 w-5 text-primary" />

            <h1 className="text-2xl font-bold tracking-[-1px]">
              {mode === "create" ? "Create Category" : "Update Category"}
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">Manage category information, content and gallery images.</p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/categories")}
          className="flex items-center gap-2 self-start rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* INFORMATION */}
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 border-b  border-border px-6 py-4">
            <FileText className="h-5 w-5 text-primary" />

            <h2 className="font-semibold">Category Information</h2>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category Name <span className="text-red-500">*</span>
              </label>

              <input
                {...register("name", { required: true })}
                className={inputClass}
                placeholder="Enter category name"
              />

              {errors.name && <p className="mt-2 text-xs text-red-500">Category name is required</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Slug <span className="text-red-500">*</span>
              </label>

              <input {...register("slug", { required: true })} className={inputClass} placeholder="Enter slug" />

              {errors.slug && <p className="mt-2 text-xs text-red-500">Slug is required</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>

              <textarea
                rows={4}
                {...register("description")}
                className={textareaClass}
                placeholder="Enter category description"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium">Content</label>

              <div className="rounded-lg border border-border bg-background p-4">
                <ContentInput isEditting={mode === "update"} setValue={setValue} watch={watch} errors={errors} />
              </div>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <div className="flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />

                <h2 className="font-semibold">Category Images</h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">Upload and manage category gallery images.</p>
            </div>

            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <ImagePlus className="h-4 w-4" />
              Add Image
            </button>
          </div>

          {/* BODY */}
          <div className="p-6">
            {imageForms.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                <Images className="h-10 w-10 text-muted-foreground" />

                <h3 className="mt-4 font-medium">No images added</h3>

                <p className="mt-1 text-sm text-muted-foreground">Start by uploading your first category image.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {imageForms.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-border bg-background">
                    {/* IMAGE */}
                    <div className="relative aspect-video border-b border-border bg-muted">
                      <Image src={image.preview || "/image/default.png"} alt="" fill className="object-cover" />
                    </div>

                    {/* CONTENT */}
                    <div className="space-y-4 p-4">
                      {/* ACTIONS */}
                      <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-accent">
                          <Upload className="h-4 w-4" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];

                              if (!file) return;

                              handleImageUpload(index, file);
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      {/* DESCRIPTION */}
                      <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>

                        <textarea
                          rows={4}
                          placeholder="Enter image description..."
                          value={image.description || ""}
                          onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                          className={textareaClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition hover:bg-accent"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {loading ? "Processing..." : mode === "create" ? "Create Category" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
