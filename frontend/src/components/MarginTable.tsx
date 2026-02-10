import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import { useMarginData } from "../hooks/useMarginData";
import { ClientTypeRow } from "./ClientTypeRow";

const VOLUME_RANGES = ["300", "500", "1T", "3T", "5T", "10T", "20T", "30T"];

const UPSERT_CLIENT_MARGIN = gql`
  mutation UpsertClientMargin($input: UpsertClientMarginInput!) {
    upsertClientMargin(input: $input) {
      id
      name
      margins {
        id
        volumeRange
        marginPercent
      }
      effectiveMargins {
        volumeRange
        marginPercent
        source
        isAlert
      }
    }
  }
`;

export function MarginTable() {
  const { plants, loading, error } = useMarginData();
  const [upsertMargin] = useMutation(UPSERT_CLIENT_MARGIN);

  const handleMarginChange = async (
    clientId: string,
    volumeRange: string,
    marginPercent: number
  ) => {
    try {
      await upsertMargin({
        variables: {
          input: {
            clientId: parseInt(clientId, 10),
            volumeRange,
            marginPercent,
          },
        },
      });
    } catch (err) {
      console.error("Error al actualizar margen:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-lg">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-5">
        <p className="text-red-700 font-semibold">Error al cargar datos</p>
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="text-gray-400 text-center p-12">
        No hay plantas configuradas.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {plants.map((plant) => (
        <div key={plant.id}>
          {/* Plant header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🌿</span>
            <h2 className="text-lg font-semibold text-gray-700">
              Planta: {plant.name}
            </h2>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="text-left px-4 py-3 font-semibold w-52 border-r border-gray-700">
                    Tipo / Cliente
                  </th>
                  <th className="text-center px-3 py-3 font-semibold w-28 border-r border-gray-700">
                    Precio Base
                  </th>
                  {VOLUME_RANGES.map((range) => (
                    <th
                      key={range}
                      className="text-center px-3 py-3 font-semibold border-r border-gray-700 last:border-r-0"
                    >
                      {range}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plant.clientTypes.map((ct) => (
                  <ClientTypeRow
                    key={ct.id}
                    clientType={ct}
                    volumeRanges={VOLUME_RANGES}
                    onMarginChange={handleMarginChange}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-3 px-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-block w-3 h-3 rounded bg-slate-50 border border-gray-300" />
              Heredado del tipo
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-block w-3 h-3 rounded bg-yellow-50 border border-yellow-300" />
              Override del cliente
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-block w-3 h-3 rounded bg-red-50 border border-red-300" />
              Alerta: margen ≤ 5%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
