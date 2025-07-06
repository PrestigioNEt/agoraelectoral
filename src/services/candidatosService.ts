import { supabase } from '../supabaseClient';

// Definimos la estructura de un Candidato para tener un tipado estricto
export interface Candidato {
  id: number;
  nombre: string;
  partido_politico: string;
  cargo: string;
  // Añade aquí cualquier otro campo relevante de tu tabla 'candidatos'
  created_at: string;
}

/**
 * Obtiene todos los candidatos de la base de datos.
 * @returns Una promesa que se resuelve con un array de candidatos.
 */
export const getAllCandidatos = async (): Promise<Candidato[]> => {
  const { data, error } = await supabase
    .from('candidatos')
    .select('*');

  if (error) {
    console.error('Error fetching candidatos:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtiene un candidato específico por su ID.
 * @param id - El ID del candidato a obtener.
 * @returns Una promesa que se resuelve con el objeto del candidato.
 */
export const getCandidatoById = async (id: number): Promise<Candidato | null> => {
  const { data, error } = await supabase
    .from('candidatos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching candidato with id ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Crea un nuevo candidato en la base de datos.
 * @param candidatoData - Un objeto con los datos del nuevo candidato (sin el id).
 * @returns Una promesa que se resuelve con el candidato recién creado.
 */
export const createCandidato = async (candidatoData: Omit<Candidato, 'id' | 'created_at'>): Promise<Candidato> => {
  const { data, error } = await supabase
    .from('candidatos')
    .insert([candidatoData])
    .select()
    .single();

  if (error) {
    console.error('Error creating candidato:', error);
    throw error;
  }

  return data;
};

/**
 * Actualiza un candidato existente en la base de datos.
 * @param id - El ID del candidato a actualizar.
 * @param updates - Un objeto con los campos a actualizar.
 * @returns Una promesa que se resuelve con el candidato actualizado.
 */
export const updateCandidato = async (id: number, updates: Partial<Candidato>): Promise<Candidato> => {
  const { data, error } = await supabase
    .from('candidatos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating candidato with id ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Elimina un candidato de la base de datos.
 * @param id - El ID del candidato a eliminar.
 * @returns Una promesa que se resuelve a `true` si la operación fue exitosa.
 */
export const deleteCandidato = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('candidatos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting candidato with id ${id}:`, error);
    throw error;
  }

  return true;
};