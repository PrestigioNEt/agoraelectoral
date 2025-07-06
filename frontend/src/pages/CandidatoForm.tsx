import React, { useState } from 'react';
import { createCandidatos } from '../services/candidatosService';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';

const regiones = [
  { value: 'norte', label: 'Norte' },
  { value: 'sur', label: 'Sur' },
];
const municipiosPorRegion: Record<string, { value: string; label: string }[]> = {
  norte: [
    { value: 'ciudad1', label: 'Ciudad 1' },
    { value: 'ciudad2', label: 'Ciudad 2' },
  ],
  sur: [
    { value: 'ciudad3', label: 'Ciudad 3' },
    { value: 'ciudad4', label: 'Ciudad 4' },
  ],
};

const CandidatoForm = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    partido: '',
    cargo: '',
    region: '',
    municipio: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const municipios = form.region ? municipiosPorRegion[form.region] || [] : [];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.first_name) newErrors.first_name = 'El nombre es obligatorio';
    if (!form.last_name) newErrors.last_name = 'El apellido es obligatorio';
    if (!form.partido) newErrors.partido = 'El partido es obligatorio';
    if (!form.cargo) newErrors.cargo = 'El cargo es obligatorio';
    if (!form.region) newErrors.region = 'La región es obligatoria';
    if (!form.municipio) newErrors.municipio = 'El municipio es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    if (e.target.name === 'region') setForm(f => ({ ...f, municipio: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await createCandidatos(form);
      setSuccess(true);
      setForm({ first_name: '', last_name: '', partido: '', cargo: '', region: '', municipio: '' });
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <InputField label="Nombre" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required />
      <InputField label="Apellido" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required />
      <InputField label="Partido" name="partido" value={form.partido} onChange={handleChange} error={errors.partido} required />
      <InputField label="Cargo" name="cargo" value={form.cargo} onChange={handleChange} error={errors.cargo} required />
      <SelectField label="Región" name="region" value={form.region} onChange={handleChange} error={errors.region} options={regiones} required />
      <SelectField label="Municipio" name="municipio" value={form.municipio} onChange={handleChange} error={errors.municipio} options={municipios} required />
      <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Guardando...' : 'Crear Candidato'}</button>
      {success && <div className="text-green-600">¡Candidato creado!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default CandidatoForm; 