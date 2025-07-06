import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts y Páginas
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import DashboardResultados from './pages/DashboardResultados';
import DashboardVotosRegion from './pages/DashboardVotosRegion';
import DashboardVotosMunicipio from './pages/DashboardVotosMunicipio';
import DashboardVotosMunicipioAvanzado from './pages/DashboardVotosMunicipioAvanzado';
import DashboardVotosCargo from './pages/DashboardVotosCargo';
import DashboardVotosCargoAvanzado from './pages/DashboardVotosCargoAvanzado';
import DashboardVotantesAvanzado from './pages/DashboardVotantesAvanzado';
import DashboardEleccionesAvanzado from './pages/DashboardEleccionesAvanzado';
import CandidatosList from './pages/CandidatosList';
import CandidatoForm from './pages/CandidatoForm';
import VotantesList from './pages/VotantesList';
import VotanteForm from './pages/VotanteForm';
import VotoForm from './pages/VotoForm';
import NotificacionesList from './pages/NotificacionesList';
import NotificacionForm from './pages/NotificacionForm';
import LogsList from './pages/LogsList';
import CsvUploader from './components/ui/CsvUploader';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MapsPage from './pages/MapsPage';

// Componente para proteger rutas basado en roles
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Roles que tienen acceso
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles, comprobar que el usuario tiene uno de ellos
  if (allowedRoles && !allowedRoles.includes(profile?.role || '')) {
    // Redirigir a una página de "Acceso Denegado" o al dashboard
    return <Navigate to="/dashboard" replace />; 
  }

  return <>{children}</>;
};

// Componente que agrupa las rutas de la aplicación
const AppRoutes = () => (
  <Routes>
    {/* Rutas Públicas */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Rutas Protegidas */}
    <Route 
      path="/*" 
      element={
        <ProtectedRoute>
          <MainLayout>
            <Routes>
              {/* Rutas para todos los usuarios autenticados */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/mapa" element={<MapsPage />} />

              {/* Rutas con control de acceso por rol */}
              <Route path="/dashboard/resultados" element={<ProtectedRoute allowedRoles={['admin', 'candidato']}><DashboardResultados /></ProtectedRoute>} />
              <Route path="/dashboard/votos-region" element={<ProtectedRoute allowedRoles={['admin', 'candidato']}><DashboardVotosRegion /></ProtectedRoute>} />
              <Route path="/dashboard/votos-municipio" element={<ProtectedRoute allowedRoles={['admin', 'candidato']}><DashboardVotosMunicipio /></ProtectedRoute>} />
              <Route path="/dashboard/votos-municipio-avanzado" element={<ProtectedRoute allowedRoles={['admin']}><DashboardVotosMunicipioAvanzado /></ProtectedRoute>} />
              <Route path="/dashboard/votos-cargo" element={<ProtectedRoute allowedRoles={['admin', 'candidato']}><DashboardVotosCargo /></ProtectedRoute>} />
              <Route path="/dashboard/votos-cargo-avanzado" element={<ProtectedRoute allowedRoles={['admin']}><DashboardVotosCargoAvanzado /></ProtectedRoute>} />
              <Route path="/dashboard/votantes-avanzado" element={<ProtectedRoute allowedRoles={['admin']}><DashboardVotantesAvanzado /></ProtectedRoute>} />
              <Route path="/dashboard/elecciones-avanzado" element={<ProtectedRoute allowedRoles={['admin']}><DashboardEleccionesAvanzado /></ProtectedRoute>} />
              
              <Route path="/candidatos" element={<ProtectedRoute allowedRoles={['admin']}><CandidatosList /></ProtectedRoute>} />
              <Route path="/candidatos/nuevo" element={<ProtectedRoute allowedRoles={['admin']}><CandidatoForm /></ProtectedRoute>} />
              
              <Route path="/votantes" element={<ProtectedRoute allowedRoles={['admin']}><VotantesList /></ProtectedRoute>} />
              <Route path="/votantes/nuevo" element={<ProtectedRoute allowedRoles={['admin']}><VotanteForm /></ProtectedRoute>} />
              
              <Route path="/votos/nuevo" element={<ProtectedRoute allowedRoles={['admin', 'votante']}><VotoForm /></ProtectedRoute>} />
              
              <Route path="/notificaciones" element={<ProtectedRoute allowedRoles={['admin']}><NotificacionesList /></ProtectedRoute>} />
              <Route path="/notificaciones/nueva" element={<ProtectedRoute allowedRoles={['admin']}><NotificacionForm /></ProtectedRoute>} />
              
              <Route path="/logs" element={<ProtectedRoute allowedRoles={['admin']}><LogsList /></ProtectedRoute>} />
              <Route path="/carga-masiva" element={<ProtectedRoute allowedRoles={['admin']}><CsvUploader /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </MainLayout>
        </ProtectedRoute>
      }
    />
  </Routes>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
