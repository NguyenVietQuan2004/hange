import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // Lấy FormData từ request
    const formData = await req.formData();
    const file = formData.get("upload") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Kiểm tra định dạng file
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExt = path.extname(file.name).toLowerCase().slice(1);
    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Kiểm tra kích thước file (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Đọc file thành buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;

    // Trả về data URL cho CKEditor

    return NextResponse.json({
      uploaded: 1,
      fileName: file.name,
      url: `data:${mimeType};base64,${base64}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error processing file" }, { status: 500 });
  }
}
