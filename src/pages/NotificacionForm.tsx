import React, { useState } from 'react';
import { createNotificaciones } from '../services/notificacionesService';

const NotificacionForm = () => {
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await createNotificaciones({ mensaje });
      setSuccess(true);
      setMensaje('');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
        placeholder="Mensaje de notificación"
        className="input-field w-full"
        required
      />
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Notificación'}
      </button>
      {success && <div className="text-green-600">¡Notificación enviada!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default NotificacionForm; 