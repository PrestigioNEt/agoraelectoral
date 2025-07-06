import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/resultados', label: 'Resultados' },
  { to: '/dashboard/votos-region', label: 'Votos por Región' },
  { to: '/dashboard/votos-municipio', label: 'Votos por Municipio' },
  { to: '/dashboard/votos-municipio-avanzado', label: 'Votos Municipio Avanzado' },
  { to: '/dashboard/votos-cargo', label: 'Votos por Cargo' },
  { to: '/dashboard/votos-cargo-avanzado', label: 'Votos Cargo Avanzado' },
  { to: '/dashboard/votantes-avanzado', label: 'Votantes Avanzado' },
  { to: '/dashboard/elecciones-avanzado', label: 'Elecciones Avanzado' },
  { to: '/candidatos', label: 'Candidatos' },
  { to: '/candidatos/nuevo', label: 'Nuevo Candidato' },
  { to: '/votantes', label: 'Votantes' },
  { to: '/votantes/nuevo', label: 'Nuevo Votante' },
  { to: '/votos/nuevo', label: 'Registrar Voto' },
  { to: '/notificaciones', label: 'Notificaciones' },
  { to: '/notificaciones/nueva', label: 'Nueva Notificación' },
  { to: '/logs', label: 'Logs' },
  { to: '/carga-masiva', label: 'Carga Masiva' },
  // Agrega más rutas según tus páginas
];

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow">
      <div className="flex items-center gap-6">
        <span className="font-bold text-xl text-primary-700 dark:text-primary-300">Agora Electoral</span>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-3 py-2 rounded transition ${
              location.pathname === link.to
                ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <ThemeToggle />
    </nav>
  );
};

export default Navbar; 