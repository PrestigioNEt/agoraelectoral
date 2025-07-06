import { supabase } from '../supabaseClient';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

// Definimos los tipos para las credenciales de login y registro
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  // Puedes añadir campos adicionales aquí, como nombre de usuario
  // por ahora, solo se requiere email y password
}

/**
 * Maneja el inicio de sesión de un usuario.
 * @param credentials - Email y contraseña del usuario.
 * @returns Una promesa que se resuelve con la sesión del usuario.
 */
export const login = async (credentials: LoginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    console.error('Error during login:', error.message);
    throw error;
  }
  return data;
};

/**
 * Maneja el registro de un nuevo usuario.
 * @param credentials - Email y contraseña para el nuevo usuario.
 * @returns Una promesa que se resuelve con el usuario creado.
 */
export const register = async (credentials: RegisterCredentials) => {
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) {
    console.error('Error during registration:', error.message);
    throw error;
  }
  // El usuario se crea, pero puede requerir confirmación por email
  return data;
};

/**
 * Cierra la sesión del usuario actual.
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error during logout:', error.message);
    throw error;
  }
};

/**
 * Obtiene el usuario actualmente autenticado.
 * @returns Una promesa que se resuelve con el objeto del usuario o null si no hay sesión.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return session?.user ?? null;
};

/**
 * Escucha los cambios en el estado de autenticación (login, logout).
 * @param callback - Una función que se ejecuta cada vez que el estado de auth cambia.
 * @returns Un objeto con el método `unsubscribe` para dejar de escuchar.
 */
export const onAuthStateChange = (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChanged(callback);
  return subscription;
};
