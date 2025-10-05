import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileImport } from "react-icons/fa6";
import Button from "./shared/Button";

export default function FileDropzone({
  onChange,
}: {
  onChange: (file: File) => void;
}) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      onChange?.(file);
    });
  }, [onChange]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} accept="application/json" />

      <Button title="Import" leftIcon={<FaFileImport />} type="button"></Button>
    </div>
  );
}
