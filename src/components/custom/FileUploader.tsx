import React, { useCallback, useEffect, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import Button from "./Button";

interface FileUploadProps {
  buttonText?: string;
  addMoreText?: string;
  initialFiles?: File[];
  onFilesSelected?: (files: File[]) => void;
  acceptedFileTypes?: string | string[]; 
}

const FileUpload: React.FC<FileUploadProps> = ({
  buttonText = "Select Files",
  addMoreText = "Add More Files",
  initialFiles = [],
  onFilesSelected,
  acceptedFileTypes, 
}) => {
  const [files, setFiles] = useState<File[]>(initialFiles);

  useEffect(() => {
    if (initialFiles.length === 0) {
      setFiles(initialFiles);
    }
  }, [initialFiles]);

  const accept: Accept | undefined = acceptedFileTypes
    ? Array.isArray(acceptedFileTypes)
      ? Object.fromEntries(acceptedFileTypes.map((type) => [type, []]))
      : { [acceptedFileTypes]: [] }
    : undefined;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      onFilesSelected?.(newFiles);
    },
    [files, onFilesSelected]
  );

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesSelected?.(newFiles);
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept,
  });

  return (
    <div className="w-full mt-5">
      {files.length === 0 ? (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button onClick={open} variant="outline">
            {buttonText}
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps({
            className:
              "border-2 border-dashed p-4 rounded flex flex-col items-center cursor-pointer bg-gray-50",
          })}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <p className="mb-2 text-gray-600">
              {isDragActive
                ? "Drop files here..."
                : "Drag & drop files here, or"}
            </p>

            <Button variant="link" className="ml-1 mt-[-7px]" onClick={open} size="sm">
              {addMoreText}
            </Button>
          </div>

          <ul className="mt-2 text-sm w-full">
            {files.map((file, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-white p-2 border-b"
              >
                <span className="text-gray-800">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </span>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => removeFile(idx)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
