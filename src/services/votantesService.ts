import { supabase } from '../supabaseClient';

// Definimos la estructura de un Votante para un tipado estricto
export interface Votante {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  // Añade aquí cualquier otro campo relevante de tu tabla 'votantes'
  created_at: string;
}

/**
 * Obtiene todos los votantes de la base de datos.
 * @returns Una promesa que se resuelve con un array de votantes.
 */
export const getAllVotantes = async (): Promise<Votante[]> => {
  const { data, error } = await supabase
    .from('votantes')
    .select('*');

  if (error) {
    console.error('Error fetching votantes:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtiene un votante específico por su ID.
 * @param id - El ID del votante a obtener.
 * @returns Una promesa que se resuelve con el objeto del votante.
 */
export const getVotanteById = async (id: number): Promise<Votante | null> => {
  const { data, error } = await supabase
    .from('votantes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching votante with id ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Crea un nuevo votante en la base de datos.
 * @param votanteData - Un objeto con los datos del nuevo votante.
 * @returns Una promesa que se resuelve con el votante recién creado.
 */
export const createVotante = async (votanteData: Omit<Votante, 'id' | 'created_at'>): Promise<Votante> => {
  const { data, error } = await supabase
    .from('votantes')
    .insert([votanteData])
    .select()
    .single();

  if (error) {
    console.error('Error creating votante:', error);
    throw error;
  }

  return data;
};

/**
 * Actualiza un votante existente en la base de datos.
 * @param id - El ID del votante a actualizar.
 * @param updates - Un objeto con los campos a actualizar.
 * @returns Una promesa que se resuelve con el votante actualizado.
 */
export const updateVotante = async (id: number, updates: Partial<Votante>): Promise<Votante> => {
  const { data, error } = await supabase
    .from('votantes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating votante with id ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Elimina un votante de la base de datos.
 * @param id - El ID del votante a eliminar.
 * @returns Una promesa que se resuelve a `true` si la operación fue exitosa.
 */
export const deleteVotante = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('votantes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting votante with id ${id}:`, error);
    throw error;
  }

  return true;
};