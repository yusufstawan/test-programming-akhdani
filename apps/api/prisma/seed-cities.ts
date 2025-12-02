import {prisma} from "../src/common/prisma"

async function main() {
  console.log('Start seeding...');

  const cities = [
    {
      name: 'Jakarta Pusat',
      latitude: -6.1805,
      longitude: 106.8284,
      province: 'DKI Jakarta',
      island: 'Jawa',
      isOverseas: false,
    },
    {
      name: 'Depok',
      latitude: -6.4025,
      longitude: 106.7942,
      province: 'Jawa Barat',
      island: 'Jawa',
      isOverseas: false,
    },
    {
      name: 'Bandung',
      latitude: -6.9175,
      longitude: 107.6191,
      province: 'Jawa Barat',
      island: 'Jawa',
      isOverseas: false,
    },
    {
      name: 'Cirebon',
      latitude: -6.732,
      longitude: 108.5523,
      province: 'Jawa Barat',
      island: 'Jawa',
      isOverseas: false,
    },
    {
      name: 'Surabaya',
      latitude: -7.2575,
      longitude: 112.7521,
      province: 'Jawa Timur',
      island: 'Jawa',
      isOverseas: false,
    },
    {
      name: 'Medan',
      latitude: 3.5952,
      longitude: 98.6722,
      province: 'Sumatera Utara',
      island: 'Sumatera',
      isOverseas: false,
    },
    {
      name: 'Singapore',
      latitude: 1.3521,
      longitude: 103.8198,
      province: '-',
      island: '-',
      isOverseas: true,
    },
  ];

  for (const city of cities) {
    const existingCity = await prisma.city.findFirst({
      where: { name: city.name },
    });

    if (!existingCity) {
      await prisma.city.create({
        data: city,
      });
      console.log(`Created city: ${city.name}`);
    } else {
      console.log(`City already exists: ${city.name}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
