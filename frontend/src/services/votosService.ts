import { supabase } from '../supabaseClient';

// Definimos la estructura de un Voto para un tipado estricto
export interface Voto {
  id: number;
  votante_id: number; // Foreign key a la tabla 'votantes'
  candidato_id: number; // Foreign key a la tabla 'candidatos'
  eleccion_id: number; // Foreign key a la tabla 'elecciones'
  // Añade aquí cualquier otro campo relevante de tu tabla 'votos'
  created_at: string;
}

/**
 * Obtiene todos los votos de la base de datos.
 * @returns Una promesa que se resuelve con un array de votos.
 */
export const getAllVotos = async (): Promise<Voto[]> => {
  const { data, error } = await supabase
    .from('votos')
    .select('*');

  if (error) {
    console.error('Error fetching votos:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtiene un voto específico por su ID.
 * @param id - El ID del voto a obtener.
 * @returns Una promesa que se resuelve con el objeto del voto.
 */
export const getVotoById = async (id: number): Promise<Voto | null> => {
  const { data, error } = await supabase
    .from('votos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching voto with id ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Crea un nuevo voto en la base de datos.
 * @param votoData - Un objeto con los datos del nuevo voto.
 * @returns Una promesa que se resuelve con el voto recién creado.
 */
export const createVoto = async (votoData: Omit<Voto, 'id' | 'created_at'>): Promise<Voto> => {
  const { data, error } = await supabase
    .from('votos')
    .insert([votoData])
    .select()
    .single();

  if (error) {
    console.error('Error creating voto:', error);
    throw error;
  }

  return data;
};

/**
 * Actualiza un voto existente en la base de datos.
 * @param id - El ID del voto a actualizar.
 * @param updates - Un objeto con los campos a actualizar.
 * @returns Una promesa que se resuelve con el voto actualizado.
 */
export const updateVoto = async (id: number, updates: Partial<Voto>): Promise<Voto> => {
  const { data, error } = await supabase
    .from('votos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating voto with id ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Elimina un voto de la base de datos.
 * @param id - El ID del voto a eliminar.
 * @returns Una promesa que se resuelve a `true` si la operación fue exitosa.
 */
export const deleteVoto = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('votos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting voto with id ${id}:`, error);
    throw error;
  }

  return true;
};