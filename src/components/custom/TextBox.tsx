import React from "react";
import { cn } from "@/lib/utils";

export type TextBoxVariant = "default" | "outline" | "error" | "success";
export type TextBoxSize = "default" | "sm" | "lg";

const formatNumber = (value: string | number) => {
  const number = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(number)) return "";
  return number.toLocaleString("en-NG"); // Format for Nigeria (₦)
};

const unformatNumber = (value: string) => {
  return value.replace(/,/g, "");
};

export interface TextBoxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: TextBoxVariant;
  inputSize?: TextBoxSize;
  label?: string;
  error?: string;
  success?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  loading?: boolean;
  onIconClick?: (value?: string) => void;
}

const variantClasses: Record<TextBoxVariant, string> = {
  default:
    "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary",
  outline:
    "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary bg-transparent",
  error: "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500",
  success:
    "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500",
};

const sizeClasses: Record<TextBoxSize, string> = {
  default: "px-3 py-2 text-base",
  sm: "px-2 py-1 text-sm",
  lg: "px-4 py-3 text-lg",
};

const TextBox = React.forwardRef<HTMLInputElement, TextBoxProps>(
  (
    {
      variant = "default",
      size = "default",
      label,
      error,
      success,
      prefixIcon,
      suffixIcon,
      className,
      loading,
      onIconClick,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState(
      props.type === "amount" && props.value
        ? formatNumber(props.value as string)
        : props.value ?? ""
    );

    React.useEffect(() => {
      if (props.type === "amount" && props.value !== undefined) {
        setDisplayValue(formatNumber(props.value as string));
      } else if (props.value !== undefined) {
        setDisplayValue(props.value as string);
      }
    }, [props.value, props.type]);

    const handleIconClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      e.preventDefault();
      onIconClick?.("clicked");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value;

      if (props.type === "amount") {
        const unformatted = unformatNumber(raw);
        setDisplayValue(formatNumber(unformatted)); // update local display
        props.onChange?.({
          ...e,
          target: {
            ...e.target,
            value: unformatted,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      } else {
        setDisplayValue(raw);
        props.onChange?.(e);
      }
    };

    return (
      <div className={cn("grid grid-cols-12 w-full")}>
        {label && (
          <label className="mb-1 self-center text-left md:text-right mr-2 col-span-12 md:col-span-3 font-medium text-gray-600">
            {label}
            {props?.required && <span className="text-red-500">*</span>}:
          </label>
        )}

        <div
          className={cn(
            "w-full",
            label ? "col-span-12 md:col-span-9" : "col-span-12"
          )}
        >
          <div className={cn("relative flex flex-col items-start")}>
            {prefixIcon && (
              <span
                onClick={handleIconClick}
                className="absolute cursor-pointer material-icons left-2 top-2 text-gray-400"
              >
                {prefixIcon}
              </span>
            )}

            <input
              ref={ref}
              className={cn(
                "block w-full rounded-md border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors",
                variantClasses[variant],
                sizeClasses[size as TextBoxSize],
                props.readOnly ||
                  (loading && "bg-gray-100 text-gray-500 cursor-not-allowed"),
                props.disabled &&
                  "bg-gray-100 text-gray-500 cursor-not-allowed",
                className,
                prefixIcon && "pl-10",
                suffixIcon && "pr-10"
              )}
              {...props}
              disabled={loading || props.disabled}
              onChange={handleChange}
              value={displayValue}
            />

            {suffixIcon && !loading && (
              <span
                onClick={handleIconClick}
                className="absolute cursor-pointer material-icons right-2 top-2 text-gray-400"
              >
                {suffixIcon}
              </span>
            )}
            {loading && (
              <span className="absolute right-3 top-3 animate-spin border-2 border-t-transparent border-gray-400 rounded-full w-5 h-5" />
            )}

            {/* move feedback messages here */}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {!error && success && (
              <p className="mt-1 text-sm text-green-600">{success}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TextBox.displayName = "TextBox";

export default TextBox;
