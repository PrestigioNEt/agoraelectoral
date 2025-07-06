import React, { useEffect, useState } from 'react';
import { getAllNotificaciones } from '../services/notificacionesService';

const NotificacionesList = () => {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllNotificaciones()
      .then(setNotificaciones)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando notificaciones...</div>;
  return (
    <ul>
      {notificaciones.map((n) => (
        <li key={n.id}>{n.mensaje} - {n.leido ? 'Leído' : 'No leído'}</li>
      ))}
    </ul>
  );
};

export default NotificacionesList; 