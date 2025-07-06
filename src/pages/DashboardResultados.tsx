import React, { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { supabase } from '../supabaseClient';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DashboardResultados = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from('resultados_por_candidato')
      .select('*')
      .then(({ data }) => {
        setData(data || []);
        setLoading(false);
      });
  }, []);

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
    pdf.save('dashboard_resultados.pdf');
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
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Votos por Candidato</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="candidato" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_votos" fill="#2563eb" name="Votos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardResultados; 