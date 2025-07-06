import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const DashboardEleccionesAvanzado = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('elecciones').select('*').then(({ data }) => {
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
    pdf.save('dashboard_elecciones.pdf');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, 'elecciones.xlsx');
  };

  const totalElecciones = data.length;

  if (loading) return <div>Cargando datos...</div>;

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <button onClick={handleExportPDF} className="btn-primary">Exportar PDF</button>
        <button onClick={handleExportExcel} className="btn-secondary">Exportar Excel</button>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded">Total elecciones: {totalElecciones}</div>
      </div>
      <div ref={dashboardRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Fecha Inicio</th>
                <th className="px-4 py-2">Fecha Fin</th>
                <th className="px-4 py-2">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{row.id}</td>
                  <td className="px-4 py-2">{row.nombre}</td>
                  <td className="px-4 py-2">{row.fecha_inicio}</td>
                  <td className="px-4 py-2">{row.fecha_fin}</td>
                  <td className="px-4 py-2">{row.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardEleccionesAvanzado; 