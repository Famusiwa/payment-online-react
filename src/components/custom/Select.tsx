import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  MutableRefObject,
} from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value?: any) => void;
  // onChangeValue: (event: any) => void;
  label?: string;
  error?: string;
  success?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  className?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      // onChangeValue,
      error,
      success,
      label,
      placeholder = "Select...",
      disabled = false,
      className,
      loading,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    // find currently selected option
    const selected = options.find((opt) => opt.value === value);
    // filter by search term
    const filtered = options.filter((opt) =>
      opt.label?.toLowerCase().includes(search?.toLowerCase())
    );

    // click outside closes dropdown
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          setSearch("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleSelect = (opt: SelectOption) => {
      const fakeEvent = {
        target: {
          name: props?.name || opt.label,
          value: opt.value,
        },
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange?.(fakeEvent);
      setIsOpen(false);
      setSearch("");
    };

    // forward ref + local ref to container
    const setRefs = (node: any) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    return (
      <div
        ref={setRefs}
        className={cn("relative grid grid-cols-12 w-full", className)}
      >
        {label && (
          <label className="mb-1 text-left md:text-right mr-2 col-span-12 md:col-span-3 self-end font-medium text-gray-600">
            {label}
            {props?.required && <span className="text-red-500">*</span>}:
          </label>
        )}
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => !disabled && setIsOpen((o) => !o)}
          className={cn(
            `${
              label ? "col-span-12 md:col-span-9" : "col-span-12"
            } flex justify-between items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-left transition hover:border-primary text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1`,
            disabled && "bg-gray-100 cursor-not-allowed"
          )}
        >
          <span className={cn(selected ? "text-gray-900" : "text-gray-400")}>
            {selected ? selected.label : placeholder}
          </span>
          {loading ? (
            <span className="animate-spin border-2 border-t-transparent border-gray-400 rounded-full w-4 h-4 ml-2" />
          ) : (
            <span className="material-icons text-gray-500">
              {isOpen ? "arrow_drop_up" : "arrow_drop_down"}
            </span>
          )}
          {/* <span className="material-icons text-gray-500">
            {isOpen ? "arrow_drop_up" : "arrow_drop_down"}
          </span> */}
        </button>
        {/* move feedback messages here */}
        {label && <span className="col-span-3"></span>}
        {error && (
          <p className="mt-1 col-span-9 text-sm text-red-600">{error}</p>
        )}
        {!error && success && (
          <p className="mt-1 col-span-9 text-sm text-green-600">{success}</p>
        )}
        {isOpen &&
          (() => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return null;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropUp = spaceBelow < spaceAbove;
            return (
              <div
                className={`bg-white border border-gray-200 rounded-md shadow-lg`}
                style={{
                  position: "fixed",
                  top: dropUp ? undefined : rect.bottom - 0,
                  bottom: dropUp ? window.innerHeight - rect.top : undefined,
                  left: rect.left,
                  width: rect.width,
                  zIndex: 1000,
                }}
              >
                <div className="px-4 py-2">
                  <input
                    type="text"
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <ul className="max-h-60 overflow-auto">
                  {filtered.length > 0 ? (
                    filtered.map((opt) => (
                      <li
                        key={opt.value}
                        onClick={() => handleSelect(opt)}
                        className={cn(
                          "px-4 py-2 cursor-pointer hover:bg-primary/10",
                          opt.value === value && "bg-primary/20 font-medium"
                        )}
                      >
                        {opt.label}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No options found
                    </li>
                  )}
                </ul>
              </div>
            );
          })()}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
