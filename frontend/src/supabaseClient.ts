import { 
  createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL (VITE_SUPABASE_URL) and Anon Key (VITE_SUPABASE_ANON_KEY) must be defined in your .env file or environment variables.');
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
