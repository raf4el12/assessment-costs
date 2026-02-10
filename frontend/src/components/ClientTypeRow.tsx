import { useState } from "react";
import { ClientRow } from "./ClientRow";
import type { ClientType } from "../hooks/useMarginData";

interface ClientTypeRowProps {
  clientType: ClientType;
  volumeRanges: string[];
  onMarginChange: (clientId: string, volumeRange: string, value: number) => void;
}

export function ClientTypeRow({ clientType, volumeRanges, onMarginChange }: ClientTypeRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Index default margins by volumeRange
  const defaultMarginMap = new Map(
    clientType.margins.map((m) => [m.volumeRange, m.marginPercent])
  );

  return (
    <>
      {/* ClientType header row */}
      <tr className="bg-slate-100 hover:bg-slate-200/70 transition-colors">
        {/* Name + expand toggle */}
        <td className="border border-gray-200 px-4 py-2.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 w-full text-left"
          >
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-semibold text-sm text-gray-800">
              {clientType.name}
            </span>
            <span className="text-xs text-gray-400 ml-1">
              ({clientType.clients.length} cliente{clientType.clients.length !== 1 ? "s" : ""})
            </span>
          </button>
        </td>

        {/* Base price */}
        <td className="border border-gray-200 px-3 py-2.5 text-center">
          <span className="text-sm font-medium text-gray-700">
            {clientType.priceCurrency} {clientType.basePrice.toLocaleString()}
          </span>
        </td>

        {/* Default margin cells (read-only) */}
        {volumeRanges.map((range) => {
          const pct = defaultMarginMap.get(range);
          return (
            <td
              key={range}
              className="border border-gray-200 px-3 py-2.5 text-center text-sm font-medium text-gray-600 bg-slate-50"
            >
              {pct != null ? `${pct}%` : "—"}
            </td>
          );
        })}
      </tr>

      {/* Client rows (collapsible) */}
      {isExpanded &&
        clientType.clients.map((client) => (
          <ClientRow
            key={client.id}
            client={client}
            volumeRanges={volumeRanges}
            onMarginChange={onMarginChange}
          />
        ))}
    </>
  );
}
