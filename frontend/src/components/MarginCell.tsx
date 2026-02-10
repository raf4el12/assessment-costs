import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useRef, useEffect } from "react";

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
  const [localValue, setLocalValue] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value changes when not editing
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(String(value));
    }
  }, [value, isFocused]);

  const commit = () => {
    const parsed = parseFloat(localValue);
    if (!isNaN(parsed) && parsed !== value) {
      onChange(parsed);
    } else {
      setLocalValue(String(value));
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setLocalValue(String(value));
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
          value={isFocused ? localValue : `${value}%`}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setLocalValue(String(value));
          }}
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

        {/* Override indicator dot */}
        {isOverride && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
        )}

        {/* Alert tooltip */}
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
