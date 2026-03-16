import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: "public_placeholder", // not needed for server-side upload
    privateKey: process.env.IMAGE_KIT_KEY || "",
    urlEndpoint: "https://ik.imagekit.io/agrisense",
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: `crop_${Date.now()}_${file.name}`,
            folder: "/agrisense/crop-diseases",
        });

        return NextResponse.json({
            success: true,
            url: uploadResponse.url,
            fileId: uploadResponse.fileId,
            name: uploadResponse.name,
            thumbnailUrl: uploadResponse.thumbnailUrl,
        });
    } catch (err: any) {
        console.error("Image upload error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to upload image: " + err.message,
            },
            { status: 500 }
        );
    }
}
