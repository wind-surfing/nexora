import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaImage } from "react-icons/fa6";

export default function Dropzone() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      className="h-16 w-16 p-4 border-2 border-dotted flex flex-col items-center justify-center rounded cursor-pointer hover:text-blue-800 transition-all duration-300"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <FaImage />

      <p className="text-xs">Image</p>
    </div>
  );
}
