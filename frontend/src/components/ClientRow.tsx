import { MarginCell } from "./MarginCell";
import type { Client } from "../hooks/useMarginData";

interface ClientRowProps {
  client: Client;
  volumeRanges: string[];
  onMarginChange: (clientId: string, volumeRange: string, value: number) => void;
}

export function ClientRow({ client, volumeRanges, onMarginChange }: ClientRowProps) {
  const marginMap = new Map(
    client.effectiveMargins.map((em) => [em.volumeRange, em])
  );

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="border border-gray-200 px-4 py-2.5 pl-10">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">└</span>
          <span className="text-sm text-gray-700">{client.name}</span>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            {client.linkType}
          </span>
        </div>
      </td>

      <td className="border border-gray-200 px-3 py-2.5 text-center text-sm text-gray-300">
        —
      </td>

      {volumeRanges.map((range) => {
        const em = marginMap.get(range);
        return (
          <MarginCell
            key={range}
            value={em?.marginPercent ?? 0}
            isAlert={em?.isAlert ?? false}
            isOverride={em?.source === "client"}
            onChange={(newValue) => onMarginChange(client.id, range, newValue)}
          />
        );
      })}
    </tr>
  );
}
