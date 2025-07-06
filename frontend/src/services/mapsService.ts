import { supabase } from '../supabaseClient';

// Definimos la estructura de una Ubicacion para un tipado estricto
export interface Ubicacion {
  id: number;
  nombre: string;
  descripcion: string;
  lat: number;
  lng: number;
  created_at: string;
}

/**
 * Obtiene todas las ubicaciones de la base de datos.
 * @returns Una promesa que se resuelve con un array de ubicaciones.
 */
export const getAllUbicaciones = async (): Promise<Ubicacion[]> => {
  const { data, error } = await supabase
    .from('ubicaciones')
    .select('*');

  if (error) {
    console.error('Error fetching ubicaciones:', error);
    throw error;
  }

  return data || [];
};

/**
 * Crea una nueva ubicación en la base de datos.
 * @param ubicacionData - Un objeto con los datos de la nueva ubicación.
 * @returns Una promesa que se resuelve con la ubicación recién creada.
 */
export const createUbicacion = async (ubicacionData: Omit<Ubicacion, 'id' | 'created_at'>): Promise<Ubicacion> => {
  const { data, error } = await supabase
    .from('ubicaciones')
    .insert([ubicacionData])
    .select()
    .single();

  if (error) {
    console.error('Error creating ubicacion:', error);
    throw error;
  }

  return data;
};
