import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useRef } from "react";

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

interface MarginCellProps {
  value: number;
  isAlert: boolean;
  isOverride: boolean;
  onChange: (newValue: number) => void;
}

export function MarginCell({ value, isAlert, isOverride, onChange }: MarginCellProps) {
  const [editValue, setEditValue] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = editValue !== null;

  const commit = () => {
    if (editValue !== null) {
      const parsed = parseFloat(editValue);
      if (!isNaN(parsed) && parsed !== value) {
        onChange(parsed);
      }
    }
    setEditValue(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setEditValue(null);
      inputRef.current?.blur();
    }
  };

  return (
    <td
      className={cn(
        "relative border border-gray-200 p-0",
        isAlert && "bg-red-50",
        !isAlert && isOverride && "bg-yellow-50",
      )}
    >
      <div className="group relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={isEditing ? editValue : `${value}%`}
          onChange={(e) => setEditValue(e.target.value)}
          onFocus={() => setEditValue(String(value))}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full h-full px-3 py-2 text-center text-sm font-medium bg-transparent outline-none",
            "border-2 border-transparent transition-colors",
            "focus:border-blue-400 focus:bg-white",
            isAlert && "text-red-600 font-bold",
            !isAlert && isOverride && "text-amber-700",
            !isAlert && !isOverride && "text-gray-700",
          )}
        />

        {isOverride && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
        )}

        {isAlert && (
          <div
            className={cn(
              "absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2",
              "bg-red-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap",
              "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
            )}
          >
            ⚠ El margen no puede ser menor a 5%
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-700" />
          </div>
        )}
      </div>
    </td>
  );
}
