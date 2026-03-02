import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import Button from "./Button";
import { showToast } from "@/lib/toast";

interface InputFileProps {
  label?: string;
  allowFilesLabel?: string;
  acceptedFileTypes?: string;
  setFile: (file: File | null) => void;
}

export interface InputFileRef {
  clearFile: () => void;
}

const InputFile = forwardRef<InputFileRef, InputFileProps>(
  (
    {
      label = "Select File",
      allowFilesLabel,
      acceptedFileTypes = "*",
      setFile,
    },
    ref
  ) => {
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (acceptedFileTypes !== "*") {
          const acceptedTypes = acceptedFileTypes
            .split(",")
            .map((type) => type.trim().toLowerCase());

          const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
          const isValid = acceptedTypes.some((type) =>
            type.startsWith(".") ? type === fileExtension : file.type === type
          );

          if (!isValid) {
            showToast(
              `Only files of type (${acceptedFileTypes}) are allowed.`,
              "error"
            );
            e.target.value = "";
            return;
          }
        }
        setFile(file);
        setFileName(file.name);
      }
    };

    // Expose a method to the parent
    useImperativeHandle(ref, () => ({
      clearFile() {
        setFileName("");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    }));

    return (
      <div className="w-full">
        <label className="block w-full text-sm font-medium text-gray-700 mb-1">
          {label}{" "}
          {allowFilesLabel && (
            <span className="text-red-600">({allowFilesLabel})</span>
          )}
        </label>
        <div className="flex">
          <input
            type="text"
            value={fileName}
            readOnly
            className="flex-1 border border-gray-300 rounded-l px-3 py-2 bg-gray-100"
            placeholder="No file selected"
          />
          <Button
            type="button"
            variant="default"
            size="sm"
            className="rounded-none border-l-0 h-[43px] rounded-r"
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </Button>
          {fileName && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded ml-1 h-[43px]"
              onClick={() => {
                setFileName("");
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
        <input
          type="file"
          accept={acceptedFileTypes}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }
);

InputFile.displayName = "InputFile";
export default InputFile;
