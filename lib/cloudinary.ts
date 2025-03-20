"use server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Convert `ReadableStream` (Browser) to `Readable` (Node.js)
function convertToNodeStream(readableStream: ReadableStream) {
  const reader = readableStream.getReader();
  const nodeStream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    },
  });
  return nodeStream;
}

async function streamUpload(file: File, options: Record<string, any>) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error("Cloudinary Upload Error:", error);
        return reject(new Error("Failed to upload file"));
      }
      resolve(result);
    });

    const nodeStream = convertToNodeStream(file.stream());
    nodeStream.pipe(uploadStream);
  });
}

export async function uploadImage(file: File, folder = "movie-app") {
  try {
    const result = await streamUpload(file, {
      folder,
      transformation: [
        { width: 1000, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
}

export async function uploadVideo(file: File, folder = "movie-app-videos") {
  try {
    console.log("Uploading file:", file.name);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "video",
          chunk_size: 6000000,
          eager: [{ format: "mp4", quality: "auto" }],
          eager_async: true,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(new Error("Failed to upload video"));
          }
          resolve(result);
        }
      );

      const nodeStream = convertToNodeStream(file.stream());
      nodeStream.pipe(uploadStream);
    });

    console.log("Upload successful:", result.secure_url);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading video to Cloudinary:", error);
    throw new Error("Failed to upload video");
  }
}




export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image");
  }
}

export async function deleteVideo(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    return { success: true };
  } catch (error) {
    console.error("Error deleting video from Cloudinary:", error);
    throw new Error("Failed to delete video");
  }
}
