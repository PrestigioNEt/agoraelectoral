import React, { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const COLORS = ['#2563eb', '#10b981', '#f59e42', '#ef4444', '#a21caf', '#fbbf24'];

const DashboardVotosMunicipio = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regiones, setRegiones] = useState<any[]>([]);
  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('regiones').select('id, nombre').then(({ data }) => {
      setRegiones(data || []);
    });
  }, []);

  useEffect(() => {
    let query = supabase.from('votos_por_municipio').select('*');
    if (regionSeleccionada) query = query.eq('region', regionSeleccionada);
    query.then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, [regionSeleccionada]);

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('dashboard_votos_municipio.pdf');
  };

  if (loading) return <div>Cargando gráfico...</div>;

  return (
    <div>
      <button
        onClick={handleExportPDF}
        className="btn-primary mb-4"
      >
        Exportar a PDF
      </button>
      <div ref={dashboardRef}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Votos por Municipio</h2>
          <select
            value={regionSeleccionada}
            onChange={e => setRegionSeleccionada(e.target.value)}
            className="input-field mb-4"
          >
            <option value="">Todas las regiones</option>
            {regiones.map(r => (
              <option key={r.id} value={r.nombre}>{r.nombre}</option>
            ))}
          </select>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total_votos"
                nameKey="municipio"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#2563eb"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardVotosMunicipio; 