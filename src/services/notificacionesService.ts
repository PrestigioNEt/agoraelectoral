import { supabase } from '../supabaseClient';

// Definimos la estructura de una Notificacion para un tipado estricto
export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: 'info' | 'warning' | 'error'; // Ejemplo de tipos de notificación
  leido: boolean;
  user_id: string; // A quién se dirige la notificación
  created_at: string;
}

/**
 * Obtiene todas las notificaciones de la base de datos.
 * @returns Una promesa que se resuelve con un array de notificaciones.
 */
export const getAllNotificaciones = async (): Promise<Notificacion[]> => {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*');

  if (error) {
    console.error('Error fetching notificaciones:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtiene una notificación específica por su ID.
 * @param id - El ID de la notificación a obtener.
 * @returns Una promesa que se resuelve con el objeto de la notificación.
 */
export const getNotificacionById = async (id: number): Promise<Notificacion | null> => {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching notificacion with id ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Crea una nueva notificación en la base de datos.
 * @param notificacionData - Un objeto con los datos de la nueva notificación.
 * @returns Una promesa que se resuelve con la notificación recién creada.
 */
export const createNotificacion = async (notificacionData: Omit<Notificacion, 'id' | 'created_at'>): Promise<Notificacion> => {
  const { data, error } = await supabase
    .from('notificaciones')
    .insert([notificacionData])
    .select()
    .single();

  if (error) {
    console.error('Error creating notificacion:', error);
    throw error;
  }

  return data;
};

/**
 * Actualiza una notificación existente en la base de datos.
 * @param id - El ID de la notificación a actualizar.
 * @param updates - Un objeto con los campos a actualizar.
 * @returns Una promesa que se resuelve con la notificación actualizada.
 */
export const updateNotificacion = async (id: number, updates: Partial<Notificacion>): Promise<Notificacion> => {
  const { data, error } = await supabase
    .from('notificaciones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating notificacion with id ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Elimina una notificación de la base de datos.
 * @param id - El ID de la notificación a eliminar.
 * @returns Una promesa que se resuelve a `true` si la operación fue exitosa.
 */
export const deleteNotificacion = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('notificaciones')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting notificacion with id ${id}:`, error);
    throw error;
  }

  return true;
};