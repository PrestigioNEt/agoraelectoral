import React, { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const COLORS = ['#2563eb', '#10b981', '#f59e42', '#ef4444', '#a21caf', '#fbbf24'];

const DashboardVotosMunicipioAvanzado = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regiones, setRegiones] = useState<any[]>([]);
  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('regiones').select('id, nombre').then(({ data }) => {
      setRegiones(data || []);
    });
  }, []);

  useEffect(() => {
    let query = supabase.from('votos_por_municipio').select('*');
    if (regionSeleccionada) query = query.eq('region', regionSeleccionada);
    if (fechaInicio) query = query.gte('fecha', fechaInicio.toISOString());
    if (fechaFin) query = query.lte('fecha', fechaFin.toISOString());
    query.then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, [regionSeleccionada, fechaInicio, fechaFin]);

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

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, 'votos_municipio.xlsx');
  };

  const totalVotos = data.reduce((acc, d) => acc + (d.total_votos || 0), 0);

  if (loading) return <div>Cargando gráfico...</div>;

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <select
          value={regionSeleccionada}
          onChange={e => setRegionSeleccionada(e.target.value)}
          className="input-field"
        >
          <option value="">Todas las regiones</option>
          {regiones.map(r => (
            <option key={r.id} value={r.nombre}>{r.nombre}</option>
          ))}
        </select>
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
        <div className="bg-green-100 p-4 rounded">Municipios: {data.length}</div>
      </div>
      <div ref={dashboardRef}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Votos por Municipio</h2>
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Municipio</th>
                <th className="px-4 py-2">Región</th>
                <th className="px-4 py-2">Total Votos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{row.municipio}</td>
                  <td className="px-4 py-2">{row.region}</td>
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

export default DashboardVotosMunicipioAvanzado; 