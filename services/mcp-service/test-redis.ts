import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({ url: process.env.REDIS_URL });

async function test() {
  try {
    await client.connect();
    await client.set('test', 'funciona');
    const value = await client.get('test');
    console.log('Valor:', value);
    await client.del('test'); // Limpieza
    await client.disconnect();
    console.log('Conexión y operaciones Redis exitosas.');
  } catch (err) {
    console.error('Error al conectar o usar Redis:', err);
    process.exit(1);
  }
}

test(); 