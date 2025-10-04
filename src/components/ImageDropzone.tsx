import { getImageByPath, storeImage } from "@/helper/idb";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaImage } from "react-icons/fa6";

export default function Dropzone({
  data,
  onChange,
  uploadType,
}: {
  data: string[];
  onChange: (src: string, e: File) => void;
  uploadType: "single" | "multiple";
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getImage = async () => {
      if (data && data.length > 0 && data[0]) {
        try {
          const img = await getImageByPath(data[0], "dataUrl");
          if (img && typeof img === "string") {
            setImageUrl(img);
          }
        } catch (error) {
          console.error("Error loading image:", error);
          setImageUrl(null);
        }
      } else {
        setImageUrl(null);
      }
    };

    getImage();
  }, [data]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const handleUpload = async (file: File) => {
        try {
          const url = await storeImage(file);
          if (url) {
            onChange?.(url, file);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };

      if (uploadType === "single") {
        if (acceptedFiles.length > 0) {
          handleUpload(acceptedFiles[0]);
        }
      } else {
        acceptedFiles.forEach(handleUpload);
      }
    },
    [onChange, uploadType]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      className="h-16 w-16 p-4 border-2 border-dotted flex flex-col items-center justify-center rounded cursor-pointer hover:text-blue-800 transition-all duration-300"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {imageUrl ? (
        <div className="w-16 h-16 p-8 relative overflow-hidden flex flex-row items-center justify-center">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-full object-cover absolute inset-0 rounded"
          />
        </div>
      ) : (
        <>
          <FaImage />
          <p className="text-xs">Image</p>
        </>
      )}
    </div>
  );
}
