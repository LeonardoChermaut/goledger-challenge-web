import { cn } from "@/lib/lib";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DropdownOption = {
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive";
  onClick: () => void;
};

type DropdownMenuProps = {
  options: DropdownOption[];
  className?: string;
};

export const DropdownMenu = ({ options, className }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors focus:outline-none"
        title="Mais opções"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-40 origin-top-right rounded-md border border-input bg-popover p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onClick();
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                option.variant === "destructive" &&
                  "text-destructive hover:bg-destructive/10 hover:text-destructive",
              )}
            >
              <span className="h-4 w-4 shrink-0">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
