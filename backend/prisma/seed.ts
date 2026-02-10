import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VOLUME_RANGES = ["300", "500", "1T", "3T", "5T", "10T", "20T", "30T"];

async function main() {
  console.log("Limpiando base de datos...");

  await prisma.marginConfig.deleteMany();
  await prisma.client.deleteMany();
  await prisma.clientType.deleteMany();
  await prisma.plant.deleteMany();

  console.log("Base de datos limpia.");

  const peru = await prisma.plant.create({
    data: { name: "Perú (planta)" },
  });
  console.log(`Planta creada: ${peru.name}`);

  const tipoA = await prisma.clientType.create({
    data: {
      name: "Tipo A",
      basePrice: 100,
      priceCurrency: "USD",
      plantId: peru.id,
      margins: {
        create: VOLUME_RANGES.map((range) => ({
          volumeRange: range,
          marginPercent: 15,
        })),
      },
    },
  });
  console.log(`ClientType creado: ${tipoA.name}`);

  const tipoB = await prisma.clientType.create({
    data: {
      name: "Tipo B",
      basePrice: 120,
      priceCurrency: "USD",
      plantId: peru.id,
      margins: {
        create: VOLUME_RANGES.map((range) => ({
          volumeRange: range,
          marginPercent: 20,
        })),
      },
    },
  });
  console.log(`ClientType creado: ${tipoB.name}`);

  const developInc = await prisma.client.create({
    data: {
      name: "Develop Inc",
      clientTypeId: tipoA.id,
      linkType: "STANDARD",
      margins: {
        create: [
          { volumeRange: "3T", marginPercent: 1 },
          { volumeRange: "5T", marginPercent: 14 },
        ],
      },
    },
  });
  console.log(`Client creado: ${developInc.name}`);

  console.log("-----------------------------------");
  console.log("Seed completado exitosamente.");
  console.log("-----------------------------------");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
