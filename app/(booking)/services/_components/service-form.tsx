"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Upload,
  Trash2,
  ImagePlus,
  ArrowLeft,
  Save,
  Wrench,
  Images,
  FileText,
  Folder,
  BriefcaseBusiness,
} from "lucide-react";
import { ServiceDTO, CreateServiceRequest, UpdateServiceRequest, ImageDTO } from "@/types/booking/service-type";
import { CategoryDTO } from "@/types/booking/category-type";
import { serviceService } from "@/services/booking/service.service";
import { categoryService } from "@/services/booking/category.service";
import { systemService } from "@/services/system.service";
import ContentInput from "@/components/content-blog";
type Props = { mode: "create" | "update"; initialData?: ServiceDTO };
type ImageFormType = { url: string; description?: string; file?: File | null; preview?: string | null };
type FormValues = {
  name: string;
  slug: string;
  description: string;
  content: string;
  durationMinutes: number;
  price: number;
  categoryId: number;
};
export default function ServiceForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [imageForms, setImageForms] = useState<ImageFormType[]>(
    initialData?.images?.map((img) => ({ url: img.url, description: img.description, preview: img.url })) || [],
  );
  console.log(initialData);
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
      durationMinutes: initialData?.durationMinutes || 30,
      price: initialData?.price || 0,
      categoryId: initialData?.categoryId || 0,
    },
  });
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        content: initialData.content || "",
        durationMinutes: initialData.durationMinutes || 30,
        price: initialData.price || 0,
        categoryId: initialData.categoryId || 0,
      });
    }
  }, [initialData, reset]);
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error("Cannot load categories");
    }
  };
  const addImage = () => {
    setImageForms((prev) => [...prev, { url: "", description: "", file: null, preview: null }]);
  };
  const removeImage = (index: number) => {
    setImageForms((prev) => prev.filter((_, i) => i !== index));
  };
  const handleImageDescriptionChange = (index: number, value: string) => {
    setImageForms((prev) => prev.map((img, i) => (i === index ? { ...img, description: value } : img)));
  };
  const handleImageUpload = (index: number, file: File) => {
    setImageForms((prev) =>
      prev.map((img, i) => (i === index ? { ...img, file, preview: URL.createObjectURL(file) } : img)),
    );
  };
  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      // const uploadedImages = await Promise.all(
      //   imageForms.map(async (img) => {
      //     let imageUrl = img.url;
      //      if (!img.file && !img.url) return null;
      //     if (img.file) {
      //       const uploadRes = await systemService.uploadFile({ file: img.file, folder: "service" });
      //       imageUrl = uploadRes.filename;
      //     }
      //     return { url: imageUrl, description: img.description };
      //   }),
      // );
      const uploadedImages: ImageDTO[] = (
        await Promise.all(
          imageForms.map(async (img): Promise<ImageDTO | null> => {
            let imageUrl = img.url;

            if (!img.file && !img.url) return null;

            if (img.file) {
              const uploadRes = await systemService.uploadFile({
                file: img.file,
                folder: "service",
              });

              imageUrl = uploadRes.filename;
            }

            if (!imageUrl) return null;

            return {
              url: imageUrl,
              description: img.description,
            };
          }),
        )
      ).filter((img): img is ImageDTO => img !== null);

      const payload: CreateServiceRequest | UpdateServiceRequest = {
        ...data,
        images: uploadedImages,
      };
      if (mode === "create") {
        await serviceService.create(payload as CreateServiceRequest);
        toast.success("Create service success");
      } else {
        await serviceService.update(initialData!.id, payload as UpdateServiceRequest);
        toast.success("Update service success");
      }
      router.push("/services");
    } catch (error) {
      console.error(error);
      toast.error(mode === "create" ? "Create failed" : "Update failed");
    } finally {
      setLoading(false);
    }
  };
  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-2    outline-none transition focus:ring-2 focus:ring-primary";
  const textareaClass =
    "w-full rounded-lg border border-border bg-background px-4 py-2    outline-none transition focus:ring-2 focus:ring-primary";
  return (
    <div className="space-y-8">
      {" "}
      {/* HEADER */}{" "}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {" "}
        <div>
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            {/* <Wrench className="h-5 w-5 text-primary" />{" "} */}
            <h1 className=" text-xl  font-bold tracking-[-1px]">
              {" "}
              {mode === "create" ? "Create Service" : "Update Service"}{" "}
            </h1>{" "}
          </div>{" "}
          <p className="mt-2    text-muted-foreground">
            {" "}
            Manage service information, pricing and gallery images.{" "}
          </p>{" "}
        </div>{" "}
        <button
          type="button"
          onClick={() => router.push("/services")}
          className="flex items-center gap-2 self-start rounded-lg underline px-5 py-2.5    font-medium transition hover:bg-accent"
        >
          {" "}
          <ArrowLeft className="h-4 w-4" /> Back to Services{" "}
        </button>{" "}
      </div>{" "}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {" "}
        {/* INFORMATION */}{" "}
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {" "}
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            {" "}
            {/* <FileText className="h-5 w-5 text-primary" /> */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <BriefcaseBusiness className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold text-lg">Service Information</h2>
              <div className="text-muted-foreground">Basic details about this service</div>
            </div>
          </div>{" "}
          <div className="space-y-6 p-6">
            {" "}
            <div>
              {" "}
              <label className="mb-1 block    font-medium">
                {" "}
                Service Name <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <input
                {...register("name", { required: true })}
                className={inputClass}
                placeholder="Enter service name"
              />{" "}
              {errors.name && <p className="mt-2 text-xs text-red-500">Service name is required</p>}{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="mb-1 block    font-medium">
                {" "}
                Slug <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <input {...register("slug", { required: true })} className={inputClass} placeholder="Enter slug" />{" "}
              <p className="text-muted-foreground mt-1">
                URL-friendly version of the name. Will be auto-generated from the name.
              </p>
              {errors.slug && <p className="mt-2 text-xs text-red-500">Slug is required</p>}{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="mb-1 block    font-medium">
                {" "}
                Category <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <select
                key={categories.length}
                {...register("categoryId", { required: true, valueAsNumber: true })}
                className={inputClass}
              >
                {" "}
                <option value="">Select category</option>{" "}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {" "}
                    {category.name}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
              {errors.categoryId && <p className="mt-2 text-xs text-red-500">Category is required</p>}{" "}
            </div>{" "}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {" "}
              <div>
                {" "}
                <label className="mb-1 block    font-medium"> Duration (minutes) </label>{" "}
                <input
                  type="number"
                  {...register("durationMinutes", {
                    required: "Duration is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Duration cannot be negative",
                    },
                  })}
                  className={inputClass}
                  placeholder="30"
                />
                {errors.durationMinutes && (
                  <p className="mt-2 text-xs text-red-500">{errors.durationMinutes.message}</p>
                )}
              </div>{" "}
              <div>
                {" "}
                <label className="mb-1 block    font-medium"> Price </label>{" "}
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Price cannot be negative",
                    },
                  })}
                  className={inputClass}
                  placeholder="100000"
                />
                {errors.price && <p className="mt-2 text-xs text-red-500">{errors.price.message}</p>}
              </div>{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="mb-1 block    font-medium"> Description </label>{" "}
              <textarea
                rows={2}
                {...register("description")}
                className={textareaClass}
                placeholder="Brief description of this service"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="mb-3 block    font-medium">Content</label>{" "}
              {/* <div className="rounded-lg border border-border bg-background p-4"> */}{" "}
              <ContentInput isEditting={mode === "update"} setValue={setValue} watch={watch} errors={errors} />{" "}
              {/* </div>{" "} */}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* IMAGES */}{" "}
        <div className="overflow-hidden rounded-xl  border-border bg-card">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <div className="flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />

                <h2 className="font-semibold">Category Images</h2>
              </div>

              <p className="mt-1    text-muted-foreground">Upload and manage category gallery images.</p>
            </div>

            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 h-fit    font-medium text-primary-foreground transition hover:opacity-90"
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

                <p className="mt-1    text-muted-foreground">
                  Add images to visually represent this category.
                  <br />
                  Recommended size: 1200 x 675 pixels (16:9 ratio)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {imageForms.map((image, index) => (
                  // <div key={index} className="overflow-hidden rounded-xl border border-border bg-background">
                  //   {/* IMAGE */}
                  //   <div className="relative aspect-video border-b border-border bg-muted">
                  //     <Image src={image.preview || "/image/default.png"} alt="" fill className="object-cover" />
                  //   </div>

                  //   {/* CONTENT */}
                  //   <div className="space-y-4 p-4">
                  //     {/* ACTIONS */}
                  //     <div className="flex items-center justify-between">
                  //       <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2    font-medium transition hover:bg-accent">
                  //         <Upload className="h-4 w-4" />
                  //         Upload
                  //         <input
                  //           type="file"
                  //           accept="image/*"
                  //           className="hidden"
                  //           onChange={(e) => {
                  //             const file = e.target.files?.[0];

                  //             if (!file) return;

                  //             handleImageUpload(index, file);
                  //           }}
                  //         />
                  //       </label>

                  //       <button
                  //         type="button"
                  //         onClick={() => removeImage(index)}
                  //         className="flex items-center gap-2 rounded-lg px-3 py-2    font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                  //       >
                  //         <Trash2 className="h-4 w-4" />
                  //         Remove
                  //       </button>
                  //     </div>

                  //     {/* DESCRIPTION */}
                  //     <div>
                  //       <label className="mb-1 block    font-medium">Description</label>

                  //       <textarea
                  //         rows={2}
                  //         placeholder="Describe this image for accessibility..."
                  //         value={image.description || ""}
                  //         onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                  //         className={textareaClass}
                  //       />
                  //     </div>
                  //   </div>
                  // </div>

                  <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card">
                    {/* IMAGE */}
                    <div className="group  relative aspect-[16/9] bg-muted">
                      {/* <Image src={image.preview || "/image/default.png"} alt="" fill className="object-cover" /> */}

                      {image.preview ? (
                        <Image src={image.preview} alt="" fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Images className="h-16 w-16 text-muted-foreground/60" />
                        </div>
                      )}

                      {/* <label className="absolute inset-0 flex items-center justify-center">
                        <div className="flex cursor-pointer items-center gap-2 rounded-xl bg-background/90 px-4 py-3 font-medium shadow-lg backdrop-blur">
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
                        </div>
                      </label> */}

                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <label className="cursor-pointer">
                          <div className="flex items-center gap-2 rounded-xl bg-background px-4 py-3 font-medium shadow-lg">
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
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <label className="text-[12px] font-medium text-muted-foreground">Image Description</label>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-muted-foreground transition hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Describe this image for accessibility..."
                        value={image.description || ""}
                        onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* ACTIONS */}{" "}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          {" "}
          <button
            type="button"
            onClick={() => router.push("/services")}
            className="rounded-lg border border-border px-6 py-2 h-fit   font-medium transition hover:bg-accent"
          >
            {" "}
            Cancel{" "}
          </button>{" "}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 h-fit    font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {" "}
            {/* <Save className="h-4 w-4" />{" "} */}
            {loading ? "Processing..." : mode === "create" ? "Create Service" : "Save Changes"}{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
    </div>
  );
}
