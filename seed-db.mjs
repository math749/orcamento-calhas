import { drizzle } from 'drizzle-orm/mysql2';
import { products, materials } from './drizzle/schema.ts';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function seed() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    // Insert products
    await db.insert(products).values([
      {
        name: 'Calha Meia Cana',
        type: 'calha',
        description: 'Calha de meia cana para drenagem de água de chuva',
      },
      {
        name: 'Calha Quadrada',
        type: 'calha',
        description: 'Calha quadrada de alta capacidade',
      },
      {
        name: 'Rufo Frontal',
        type: 'rufo',
        description: 'Rufo frontal para proteção de fachada',
      },
      {
        name: 'Rufo Lateral',
        type: 'rufo',
        description: 'Rufo lateral para proteção lateral',
      },
      {
        name: 'Pingadeira Padrão',
        type: 'pingadeira',
        description: 'Pingadeira padrão para acabamento',
      },
      {
        name: 'Pingadeira Reforçada',
        type: 'pingadeira',
        description: 'Pingadeira reforçada para áreas de alto fluxo',
      },
    ]);

    // Insert materials with prices
    await db.insert(materials).values([
      {
        name: 'Alumínio Natural',
        description: 'Alumínio com acabamento natural',
        pricePerSqMeter: 13000, // R$ 130,00
      },
      {
        name: 'Alumínio Pintura Padrão',
        description: 'Alumínio com pintura padrão',
        pricePerSqMeter: 14000, // R$ 140,00
      },
      {
        name: 'Alumínio Pintura Premium',
        description: 'Alumínio com pintura premium',
        pricePerSqMeter: 15000, // R$ 150,00
      },
      {
        name: 'Galvanizado Natural',
        description: 'Aço galvanizado com acabamento natural',
        pricePerSqMeter: 13000, // R$ 130,00
      },
      {
        name: 'Galvanizado Pintura Padrão',
        description: 'Aço galvanizado com pintura padrão',
        pricePerSqMeter: 14000, // R$ 140,00
      },
      {
        name: 'Cobre Natural',
        description: 'Cobre com acabamento natural',
        pricePerSqMeter: 15000, // R$ 150,00
      },
    ]);

    console.log('✓ Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
