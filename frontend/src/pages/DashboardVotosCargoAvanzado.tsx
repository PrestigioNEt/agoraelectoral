import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { supabase } from '../supabaseClient';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DashboardVotosCargoAvanzado = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let query = supabase.from('votos_por_cargo').select('*');
    if (fechaInicio) query = query.gte('fecha', fechaInicio.toISOString());
    if (fechaFin) query = query.lte('fecha', fechaFin.toISOString());
    query.then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, [fechaInicio, fechaFin]);

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
    pdf.save('dashboard_votos_cargo.pdf');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, 'votos_cargo.xlsx');
  };

  const totalVotos = data.reduce((acc, d) => acc + (d.total_votos || 0), 0);

  if (loading) return <div>Cargando gráfico...</div>;

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <DatePicker
          selected={fechaInicio}
          onChange={setFechaInicio}
          placeholderText="Fecha inicio"
          className="input-field"
        />
        <DatePicker
          selected={fechaFin}
          onChange={setFechaFin}
          placeholderText="Fecha fin"
          className="input-field"
        />
        <button onClick={handleExportPDF} className="btn-primary">Exportar PDF</button>
        <button onClick={handleExportExcel} className="btn-secondary">Exportar Excel</button>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded">Total votos: {totalVotos}</div>
        <div className="bg-green-100 p-4 rounded">Cargos: {data.length}</div>
      </div>
      <div ref={dashboardRef}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Votos por Cargo</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cargo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_votos" stroke="#a21caf" name="Votos" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Cargo</th>
                <th className="px-4 py-2">Total Votos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{row.cargo}</td>
                  <td className="px-4 py-2">{row.total_votos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardVotosCargoAvanzado; 