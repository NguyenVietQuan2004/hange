"use client";

import { FC, useEffect, useState, useRef } from "react";
import { UseFormSetValue, FieldErrors, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { CKEditor } from "ckeditor4-react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
  isEditting?: boolean;
};

const ContentInput: FC<Props> = ({ setValue, watch, errors, isEditting }) => {
  const content = watch("content");
  const [mounted, setMounted] = useState(false);
  const [editorKey, setEditorKey] = useState("editor-0");
  const isInitialDataLoaded = useRef(false); // Theo dõi lần đầu dữ liệu được tải

  // Kiểm tra môi trường trình duyệt và đặt mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  // Cập nhật editorKey chỉ khi dữ liệu ban đầu được tải
  useEffect(() => {
    if (mounted && content && !isInitialDataLoaded.current && isEditting) {
      setEditorKey(`editor-${Date.now()}`);
      isInitialDataLoaded.current = true; // Đánh dấu dữ liệu đã được tải
    }
  }, [content, mounted]);

  return (
    <div>
      <Label className="mb-2" htmlFor="content">
        {/* Nội dung */}
      </Label>

      {mounted ? (
        <CKEditor
          key={editorKey}
          initData={content || ""}
          config={{
            extraPlugins: "justify, font",
            removePlugins: "updatehandler, stylescombo",
            filebrowserUploadUrl: "/api/upload",
            filebrowserUploadMethod: "xhr",
            image2_alignClasses: ["image-align-left", "image-align-center", "image-align-right"],
            image2_captionedClass: "image-captioned",
            allowedContent: true,
            contentsCss: [
              `
                body { background: none !important; }
                img { background: none !important; display: block; margin: 0 auto; }
                figure { background: none !important; margin: 1em auto; display: table; }
                figcaption {
                  text-align: center;
                  font-style: italic;
                  font-size: 0.875rem;
                  color: #666;
                  margin-top: 0.5em;
                }
              `,
            ],
          }}
          onPaste={(evt: any) => {
            let html = evt.data.dataValue;
            html = html.replace(
              /<span[^>]*style="[^"]*font-weight\s*:\s*700[^"]*"[^>]*>(.*?)<\/span>/gi,
              "<strong>$1</strong>",
            );
            html = html.replace(/<span[^>]*>(.*?)<\/span>/gi, "$1");
            evt.data.dataValue = html;
          }}
          onChange={(event: any) => {
            const data = event.editor.getData();
            setValue("content", data, { shouldValidate: true });
          }}
        />
      ) : (
        <Skeleton className="h-75 w-full rounded-md" />
      )}

      {errors.content && <p className="text-red-500 text-sm">Bắt buộc</p>}
    </div>
  );
};

export default ContentInput;
