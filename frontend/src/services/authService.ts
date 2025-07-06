import { Session, User } from '@supabase/supabase-js';

// Definimos los tipos para las credenciales de login y registro
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {}

const API_URL = 'http://localhost:3001'; // URL del auth-service

/**
 * Maneja el inicio de sesión de un usuario.
 * @param credentials - Email y contraseña del usuario.
 * @returns Una promesa que se resuelve con la sesión del usuario.
 */
export const login = async (credentials: LoginCredentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data;
};

/**
 * Maneja el registro de un nuevo usuario.
 * @param credentials - Email y contraseña para el nuevo usuario.
 * @returns Una promesa que se resuelve con el usuario creado.
 */
export const register = async (credentials: RegisterCredentials) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data;
};

/**
 * Cierra la sesión del usuario actual.
 */
export const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
};

/**
 * Escucha los cambios en el estado de autenticación (login, logout).
 * @param callback - Una función que se ejecuta cada vez que el estado de auth cambia.
 * @returns Un objeto con el método `unsubscribe` para dejar de escuchar.
 */
export const onAuthStateChange = (callback: (event: any, session: Session | null) => void) => {
  // Esta parte es más compleja en una arquitectura de microservicios.
  // Por ahora, la dejaremos como está, pero en el futuro podríamos
  // implementar websockets o un sistema de polling para notificar al frontend
  // de los cambios de estado de autenticación.
  return { unsubscribe: () => {} };
};