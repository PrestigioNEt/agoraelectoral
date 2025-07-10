import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  const { session, setSession } = useAuthStore();
  const [redisMessage, setRedisMessage] = useState('');

  useEffect(() => {
    // Obtener la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Limpiar el listener al desmontar el componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession]);

  const handleRedisTest = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/redis-test`);
      const data = await response.json();
      setRedisMessage(data.message);
    } catch (error) {
      setRedisMessage(`Error fetching Redis test: ${error.message}`);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!session ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Redis Test (via Auth Service)</h3>
        <button onClick={handleRedisTest}>Test Redis</button>
        {redisMessage && <p>{redisMessage}</p>}
      </div>
    </>
  );
};

export default App;