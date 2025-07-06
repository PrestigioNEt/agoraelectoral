import React, { useEffect, useState } from 'react';
import { getAllCandidatos } from '../services/candidatosService';

const CandidatosList = () => {
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllCandidatos()
      .then(setCandidatos)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando candidatos...</div>;
  return (
    <ul>
      {candidatos.map((c) => (
        <li key={c.id}>{c.first_name} {c.last_name} ({c.role})</li>
      ))}
    </ul>
  );
};

export default CandidatosList; 