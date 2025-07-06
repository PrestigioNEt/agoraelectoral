import React, { useEffect, useState } from 'react';
import { getAllLogs } from '../services/logsService';

const LogsList = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllLogs()
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando logs...</div>;
  return (
    <ul>
      {logs.map((l) => (
        <li key={l.id}>{l.accion} - {l.descripcion} - {l.fecha}</li>
      ))}
    </ul>
  );
};

export default LogsList; 