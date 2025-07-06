import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/authService';
import { User } from '@supabase/supabase-js';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login'; // Redirigir al login tras cerrar sesión
  };

  if (loading) {
    return <p>Cargando perfil...</p>;
  }

  if (!user) {
    // Esto no debería pasar si la ruta está protegida, pero es un buen fallback
    window.location.href = '/login';
    return null;
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Perfil de Usuario</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>ID de Usuario:</strong> {user.id}</p>
      <p><strong>Último inicio de sesión:</strong> {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
      
      <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default ProfilePage;
