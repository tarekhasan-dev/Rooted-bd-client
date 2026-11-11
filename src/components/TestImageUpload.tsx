"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface UploadResponse {
  success: boolean;
  message: string;
  image: {
    url: string;
    publicId: string;
  };
}

export default function TestImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Select Image
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    setMessage("");
    setImageUrl("");

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Only JPG, PNG and WEBP images are allowed!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB!");
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // Upload Image
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select an image first!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("image", selectedFile);

      const result = (await api(
        "/upload/image",
        {
          method: "POST",
          body: formData,
        },
        true
      )) as UploadResponse;

      if (result.success) {
        setImageUrl(result.image.url);
        setMessage("Image uploaded successfully!");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Image upload failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-[#e1ece5] bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#164223]">
          Cloudinary Image Upload
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select an image and upload it to Cloudinary.
        </p>
      </div>

      {/* Image Selection */}
      <label
        htmlFor="profile-image"
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#b8d1bd] bg-[#fafcfb] p-8 transition hover:border-[#267A44]"
      >
        <span className="text-4xl">📷</span>

        <span className="mt-3 font-semibold text-[#164223]">
          Choose an Image
        </span>

        <span className="mt-1 text-xs text-gray-500">
          JPG, PNG or WEBP · Maximum 5 MB
        </span>

        <input
          id="profile-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      {/* Selected File */}
      {selectedFile && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Selected Image: {selectedFile.name}
          </p>

          {preview && (
            <img
              src={preview}
              alt="Selected preview"
              className="h-48 w-full rounded-xl object-cover"
            />
          )}
        </div>
      )}

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="mt-5 w-full rounded-xl bg-[#267A44] px-5 py-3 font-semibold text-white transition hover:bg-[#164223] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {/* Upload Message */}
      {message && (
        <p className="mt-4 rounded-lg bg-[#edf2e5] p-3 text-center text-sm font-medium text-[#164223]">
          {message}
        </p>
      )}

      {/* Uploaded Image */}
      {imageUrl && (
        <div className="mt-6">
          <h3 className="mb-3 font-semibold text-[#164223]">
            Uploaded Image
          </h3>

          <img
            src={imageUrl}
            alt="Uploaded to Cloudinary"
            className="w-full rounded-xl object-cover"
          />

          <p className="mt-3 break-all text-xs text-gray-500">
            {imageUrl}
          </p>
        </div>
      )}

    </section>
  );
}