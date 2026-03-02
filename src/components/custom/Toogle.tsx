import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
}) => {
  return (
    <label className="flex items-center cursor-pointer select-none gap-2">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => !disabled && onChange(!checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ${
            checked ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-700"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        <div
          className={`absolute left-0 top-0 h-6 w-6 bg-white border border-gray-300 rounded-full shadow transform transition-transform duration-200 ${
            checked ? "translate-x-5 border-primary-600" : ""
          }`}
        />
      </div>
      {label && (
        <span
          className={`text-md ${
            disabled ? "text-gray-400" : "text-gray-900 dark:text-white"
          }`}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;
