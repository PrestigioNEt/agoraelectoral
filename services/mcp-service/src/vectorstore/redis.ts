import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({ url: REDIS_URL });

client.connect();

export async function queryMemory(query: string) {
  // Ejemplo: buscar en un índice vectorial (ajusta según tu esquema)
  // Aquí solo se simula una búsqueda simple
  // Reemplaza por lógica de búsqueda vectorial real
  const result = await client.get(query);
  return { result };
}

export async function updateMemory(key: string, vector: number[], metadata: any) {
  // Ejemplo: guardar un vector y metadatos
  // Reemplaza por lógica de almacenamiento vectorial real
  await client.set(key, JSON.stringify({ vector, ...metadata }));
  return { status: 'ok' };
} 