import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

interface AccordionContextProps {
  openItem: string | null;
  setOpenItem: (id: string) => void;
}

interface AccordionItemProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export const AccordionContext = createContext<AccordionContextProps | null>(
  null
);

interface AccordionProps {
  children: ReactNode;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
}) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem: toggleItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  children,
  className,
}) => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }

  const { openItem, setOpenItem } = context;

  const isOpen = openItem === id;

  const handleToggle = () => {
    setOpenItem(id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={cn("border-b", className)}>
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        <span className="font-medium">{title}</span>
        <span
          className={`material-icons ${
            isOpen ? "text-secondary " : "text-primary"
          }`}
        >
          {isOpen ? "expand_less " : "expand_more"}
        </span>
      </button>
      <div
        id={`accordion-content-${id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out text-sm ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
};
