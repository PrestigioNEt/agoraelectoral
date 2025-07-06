import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const DashboardVotantesAvanzado = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regiones, setRegiones] = useState<any[]>([]);
  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('regiones').select('id, nombre').then(({ data }) => {
      setRegiones(data || []);
    });
  }, []);

  useEffect(() => {
    if (regionSeleccionada) {
      supabase.from('municipios').select('id, nombre').eq('region_id', regionSeleccionada).then(({ data }) => {
        setMunicipios(data || []);
      });
    } else {
      setMunicipios([]);
    }
  }, [regionSeleccionada]);

  useEffect(() => {
    let query = supabase.from('votantes').select('*');
    if (regionSeleccionada) query = query.eq('region', regionSeleccionada);
    if (municipioSeleccionado) query = query.eq('municipio', municipioSeleccionado);
    query.then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, [regionSeleccionada, municipioSeleccionado]);

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
    pdf.save('dashboard_votantes.pdf');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, 'votantes.xlsx');
  };

  const totalVotantes = data.length;

  if (loading) return <div>Cargando datos...</div>;

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
        <select
          value={municipioSeleccionado}
          onChange={e => setMunicipioSeleccionado(e.target.value)}
          className="input-field"
        >
          <option value="">Todos los municipios</option>
          {municipios.map(m => (
            <option key={m.id} value={m.nombre}>{m.nombre}</option>
          ))}
        </select>
        <button onClick={handleExportPDF} className="btn-primary">Exportar PDF</button>
        <button onClick={handleExportExcel} className="btn-secondary">Exportar Excel</button>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded">Total votantes: {totalVotantes}</div>
      </div>
      <div ref={dashboardRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Región</th>
                <th className="px-4 py-2">Municipio</th>
                <th className="px-4 py-2">Edad</th>
                <th className="px-4 py-2">Género</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{row.id}</td>
                  <td className="px-4 py-2">{row.region}</td>
                  <td className="px-4 py-2">{row.municipio}</td>
                  <td className="px-4 py-2">{row.edad}</td>
                  <td className="px-4 py-2">{row.genero}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardVotantesAvanzado; 