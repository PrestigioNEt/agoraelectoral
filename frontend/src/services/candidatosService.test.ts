import { describe, it, expect, vi } from 'vitest';
import { getAllCandidatos } from './candidatosService';
import { supabase } from '../supabaseClient';

// Hacemos un mock del cliente de Supabase
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn(),
  },
}));

describe('Candidatos Service', () => {

  it('debería obtener todos los candidatos correctamente', async () => {
    // 1. Arrange: Preparamos el escenario
    const mockData = [
      { id: 1, nombre: 'Candidato A', partido_politico: 'Partido 1', cargo: 'Presidente', created_at: new Date().toISOString() },
      { id: 2, nombre: 'Candidato B', partido_politico: 'Partido 2', cargo: 'Senador', created_at: new Date().toISOString() },
    ];

    // Configuramos el mock para que devuelva nuestros datos de prueba
    vi.mocked(supabase.from('candidatos').select).mockResolvedValueOnce({ 
      data: mockData, 
      error: null 
    });

    // 2. Act: Ejecutamos la función que queremos probar
    const candidatos = await getAllCandidatos();

    // 3. Assert: Verificamos que el resultado es el esperado
    expect(candidatos).toBeDefined();
    expect(candidatos.length).toBe(2);
    expect(candidatos[0].nombre).toBe('Candidato A';
    expect(supabase.from).toHaveBeenCalledWith('candidatos');
    expect(supabase.from('candidatos').select).toHaveBeenCalledWith('*');
  });

  it('debería lanzar un error si la API de Supabase falla', async () => {
    // 1. Arrange: Preparamos el escenario de error
    const mockError = { message: 'Error de red', details: '', hint: '', code: '' };

    vi.mocked(supabase.from('candidatos').select).mockResolvedValueOnce({ 
      data: null, 
      error: mockError 
    });

    // 2. Act & 3. Assert: Verificamos que la función lanza una excepción
    await expect(getAllCandidatos()).rejects.toThrow(mockError);
  });

});
