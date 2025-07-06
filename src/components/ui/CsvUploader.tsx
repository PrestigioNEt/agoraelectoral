import React, { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '../../lib/supabase';

const TABLES = [
  { value: 'votos', label: 'Votos' },
  { value: 'candidatos', label: 'Candidatos' },
  { value: 'votantes', label: 'Votantes' },
  // Agrega más tablas si lo necesitas
];

const CsvUploader = () => {
  const [table, setTable] = useState(TABLES[0].value);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setResult(null);
    setError(null);
  };

  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTable(e.target.value);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const { data, errors } = results;
          if (errors.length > 0) {
            setError('Error al parsear el CSV: ' + errors[0].message);
            setLoading(false);
            return;
          }
          // Inserción masiva (en lotes de 500 para evitar límites)
          const batchSize = 500;
          let totalInserted = 0;
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const { error: insertError } = await supabase.from(table).insert(batch);
            if (insertError) {
              setError('Error al insertar datos: ' + insertError.message);
              setLoading(false);
              return;
            }
            totalInserted += batch.length;
          }
          setResult(`¡Carga exitosa! Registros insertados: ${totalInserted}`);
        } catch (err: any) {
          setError('Error inesperado: ' + err.message);
        }
        setLoading(false);
      },
      error: (err) => {
        setError('Error al leer el archivo: ' + err.message);
        setLoading(false);
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow space-y-4">
      <h2 className="text-lg font-bold mb-2">Carga masiva de datos (CSV)</h2>
      <label className="block mb-2">
        Selecciona la tabla destino:
        <select value={table} onChange={handleTableChange} className="input-field w-full mt-1">
          {TABLES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="input-field w-full"
      />
      <button
        onClick={handleUpload}
        className="btn-primary w-full"
        disabled={loading || !file}
      >
        {loading ? 'Cargando...' : 'Subir CSV'}
      </button>
      {result && <div className="text-green-600">{result}</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="text-xs text-gray-500 mt-2">
        El archivo CSV debe tener encabezados que coincidan con los nombres de las columnas de la tabla seleccionada.
      </div>
    </div>
  );
};

export default CsvUploader; 