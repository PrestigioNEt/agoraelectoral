import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const { session, setSession } = useAuthStore();

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

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={session ? <DashboardPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;