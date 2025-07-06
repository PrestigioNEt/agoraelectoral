import React, { useEffect, useState } from 'react';
import { getAllVotantes } from '../services/votantesService';

const VotantesList = () => {
  const [votantes, setVotantes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllVotantes()
      .then(setVotantes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando votantes...</div>;
  return (
    <ul>
      {votantes.map((v) => (
        <li key={v.id}>{v.user_id} - {v.region} - {v.municipio}</li>
      ))}
    </ul>
  );
};

export default VotantesList; 