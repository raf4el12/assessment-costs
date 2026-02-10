import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client/core";

const GET_FULL_TREE = gql`
  query ObtenerArbolCompleto {
    plants {
      id
      name
      clientTypes {
        id
        name
        basePrice
        priceCurrency
        margins {
          id
          volumeRange
          marginPercent
        }
        clients {
          id
          name
          linkType
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
    }
  }
`;

export interface EffectiveMargin {
  volumeRange: string;
  marginPercent: number;
  source: string;
  isAlert: boolean;
}

export interface MarginConfig {
  id: string;
  volumeRange: string;
  marginPercent: number;
}

export interface Client {
  id: string;
  name: string;
  linkType: string;
  margins: MarginConfig[];
  effectiveMargins: EffectiveMargin[];
}

export interface ClientType {
  id: string;
  name: string;
  basePrice: number;
  priceCurrency: string;
  margins: MarginConfig[];
  clients: Client[];
}

export interface Plant {
  id: string;
  name: string;
  clientTypes: ClientType[];
}

export function useMarginData() {
  const { data, loading, error } = useQuery<{ plants: Plant[] }>(GET_FULL_TREE);

  return {
    plants: data?.plants ?? [],
    loading,
    error,
  };
}
