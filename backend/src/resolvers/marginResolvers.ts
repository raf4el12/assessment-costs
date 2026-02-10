import prisma from "../lib/prisma";

const VOLUME_RANGES = ["300", "500", "1T", "3T", "5T", "10T", "20T", "30T"];

const ALERT_THRESHOLD = 5;

interface EffectiveMargin {
  volumeRange: string;
  marginPercent: number;
  source: string;
  isAlert: boolean;
}

export const marginResolvers = {
  Query: {
    plants: () => {
      return prisma.plant.findMany({
        include: {
          clientTypes: {
            include: {
              margins: true,
              clients: { include: { margins: true } },
            },
          },
        },
      });
    },

    clientTypesByPlant: (_: unknown, { plantId }: { plantId: string }) => {
      return prisma.clientType.findMany({
        where: { plantId: parseInt(plantId, 10) },
        include: {
          plant: true,
          margins: true,
          clients: { include: { margins: true, clientType: true } },
        },
      });
    },
  },

  Mutation: {
    upsertClientMargin: async (
      _: unknown,
      { input }: { input: { clientId: number; volumeRange: string; marginPercent: number } }
    ) => {
      const { clientId, volumeRange, marginPercent } = input;

      const client = await prisma.client.findUniqueOrThrow({
        where: { id: clientId },
      });

      const existing = await prisma.marginConfig.findFirst({
        where: { clientId, volumeRange },
      });

      if (existing) {
        await prisma.marginConfig.update({
          where: { id: existing.id },
          data: { marginPercent },
        });
      } else {
        await prisma.marginConfig.create({
          data: { clientId, volumeRange, marginPercent },
        });
      }

      return prisma.client.findUniqueOrThrow({
        where: { id: client.id },
        include: { margins: true, clientType: { include: { margins: true } } },
      });
    },
  },

  Client: {
    effectiveMargins: async (parent: { id: number; clientTypeId: number }) => {
      const clientTypeMargins = await prisma.marginConfig.findMany({
        where: { clientTypeId: parent.clientTypeId, clientId: null },
      });

      const clientMargins = await prisma.marginConfig.findMany({
        where: { clientId: parent.id },
      });

      const overrideMap = new Map(
        clientMargins.map((m) => [m.volumeRange, m.marginPercent])
      );

      const defaultMap = new Map(
        clientTypeMargins.map((m) => [m.volumeRange, m.marginPercent])
      );

      const effectiveMargins: EffectiveMargin[] = VOLUME_RANGES.map((range) => {
        const hasOverride = overrideMap.has(range);
        const marginPercent = hasOverride
          ? overrideMap.get(range)!
          : defaultMap.get(range) ?? 0;

        return {
          volumeRange: range,
          marginPercent,
          source: hasOverride ? "client" : "client_type",
          isAlert: marginPercent <= ALERT_THRESHOLD,
        };
      });

      return effectiveMargins;
    },
  },
};
