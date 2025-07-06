import { supabase } from '../supabaseClient';

// Definimos la estructura de un Log para un tipado estricto
export interface Log {
  id: number;
  level: 'info' | 'warn' | 'error'; // Nivel de severidad del log
  message: string;
  meta: object; // Metadatos adicionales en formato JSON
  created_at: string;
}

/**
 * Obtiene todos los logs de la base de datos.
 * @returns Una promesa que se resuelve con un array de logs.
 */
export const getAllLogs = async (): Promise<Log[]> => {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false }); // Ordenar por fecha, más nuevos primero

  if (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }

  return data || [];
};

/**
 * Crea un nuevo log en la base de datos.
 * Esta función es útil para registrar eventos importantes desde el frontend.
 * @param logData - Un objeto con los datos del nuevo log.
 * @returns Una promesa que se resuelve con el log recién creado.
 */
export const createLog = async (logData: Omit<Log, 'id' | 'created_at'>): Promise<Log> => {
  const { data, error } = await supabase
    .from('logs')
    .insert([logData])
    .select()
    .single();

  if (error) {
    console.error('Error creating log:', error);
    throw error;
  }

  return data;
};

// Nota: Generalmente, los logs no se actualizan ni se eliminan desde el frontend,
// por lo que omitimos las funciones update y delete para mantener la integridad de los registros.