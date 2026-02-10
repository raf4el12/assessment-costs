export const typeDefs = `#graphql
  type Plant {
    id: ID!
    name: String!
    clientTypes: [ClientType!]!
  }

  type ClientType {
    id: ID!
    name: String!
    basePrice: Float!
    priceCurrency: String!
    plantId: Int!
    plant: Plant!
    clients: [Client!]!
    margins: [MarginConfig!]!
  }

  type Client {
    id: ID!
    name: String!
    clientTypeId: Int!
    clientType: ClientType!
    linkType: String!
    margins: [MarginConfig!]!
    effectiveMargins: [EffectiveMargin!]!
  }

  type MarginConfig {
    id: ID!
    volumeRange: String!
    marginPercent: Float!
    clientTypeId: Int
    clientId: Int
  }

  type EffectiveMargin {
    volumeRange: String!
    marginPercent: Float!
    source: String!
    isAlert: Boolean!
  }

  type Query {
    plants: [Plant!]!
    clientTypesByPlant(plantId: ID!): [ClientType!]!
  }

  input UpsertClientMarginInput {
    clientId: Int!
    volumeRange: String!
    marginPercent: Float!
  }

  type Mutation {
    upsertClientMargin(input: UpsertClientMarginInput!): Client!
  }
`;
