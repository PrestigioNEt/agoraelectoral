import { Votante } from '../types'; // Asumiendo que tienes un archivo de tipos global

const API_URL = 'http://localhost:3002'; // URL del crm-service

const getToken = () => {
  return localStorage.getItem('authToken');
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Obtiene todos los votantes del crm-service.
 * @returns Una promesa que se resuelve con un array de votantes.
 */
export const getAllVotantes = async (): Promise<Votante[]> => {
  const response = await fetch(`${API_URL}/votantes`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener votantes');
  }
  return response.json();
};

/**
 * Obtiene un votante específico por su ID del crm-service.
 * @param id - El ID del votante a obtener.
 * @returns Una promesa que se resuelve con el objeto del votante.
 */
export const getVotanteById = async (id: number): Promise<Votante | null> => {
  const response = await fetch(`${API_URL}/votantes/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Error al obtener votante con id ${id}`);
  }
  return response.json();
};

/**
 * Crea un nuevo votante en el crm-service.
 * @param votanteData - Un objeto con los datos del nuevo votante.
 * @returns Una promesa que se resuelve con el votante recién creado.
 */
export const createVotante = async (votanteData: Omit<Votante, 'id' | 'created_at'>): Promise<Votante> => {
  const response = await fetch(`${API_URL}/votantes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(votanteData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al crear votante');
  }
  return response.json();
};

/**
 * Actualiza un votante existente en el crm-service.
 * @param id - El ID del votante a actualizar.
 * @param updates - Un objeto con los campos a actualizar.
 * @returns Una promesa que se resuelve con el votante actualizado.
 */
export const updateVotante = async (id: number, updates: Partial<Votante>): Promise<Votante> => {
  const response = await fetch(`${API_URL}/votantes/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Error al actualizar votante con id ${id}`);
  }
  return response.json();
};

/**
 * Elimina un votante del crm-service.
 * @param id - El ID del votante a eliminar.
 * @returns Una promesa que se resuelve a `true` si la operación fue exitosa.
 */
export const deleteVotante = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/votantes/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Error al eliminar votante con id ${id}`);
  }
  return true;
};
