import React, { useState } from 'react';
import { register } from '../services/authService';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ email, password });
      setMessage('¡Registro exitoso! Por favor, revisa tu email para confirmar tu cuenta.');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error durante el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Crear Cuenta</h2>
      {message ? (
        <p style={{ color: 'green' }}>{message}</p>
      ) : (
        <form onSubmit={handleRegister}>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      )}
      <p>¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a></p>
    </div>
  );
};

export default RegisterPage;
