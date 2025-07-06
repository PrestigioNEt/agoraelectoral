import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllUbicaciones, Ubicacion } from '../services/mapsService';
import L from 'leaflet';

// Arreglo para un problema conocido con los iconos de los marcadores en Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapsPage: React.FC = () => {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const data = await getAllUbicaciones();
        setUbicaciones(data);
      } catch (err) {
        setError('No se pudieron cargar las ubicaciones.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUbicaciones();
  }, []);

  if (loading) {
    return <p>Cargando mapa y ubicaciones...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Mapa de Ubicaciones</h2>
      <MapContainer center={[9.9333, -84.0833]} zoom={8} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {ubicaciones.map(ubicacion => (
          <Marker key={ubicacion.id} position={[ubicacion.lat, ubicacion.lng]}>
            <Popup>
              <strong>{ubicacion.nombre}</strong><br />
              {ubicacion.descripcion}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapsPage;
