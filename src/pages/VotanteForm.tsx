import React, { useState, useEffect } from 'react';
import { createVotantes } from '../services/votantesService';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import { supabase } from '../supabaseClient';

const VotanteForm = () => {
  const [form, setForm] = useState({
    user_id: '',
    region: '',
    municipio: '',
    edad: '',
    genero: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [regiones, setRegiones] = useState<{ value: string; label: string }[]>([]);
  const [municipios, setMunicipios] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    // Consultar regiones desde Supabase
    supabase.from('regiones').select('id, nombre').then(({ data }) => {
      if (data) setRegiones(data.map((r: any) => ({ value: r.id, label: r.nombre })));
    });
  }, []);

  useEffect(() => {
    if (form.region) {
      // Consultar municipios según la región seleccionada
      supabase.from('municipios').select('id, nombre').eq('region_id', form.region).then(({ data }) => {
        if (data) setMunicipios(data.map((m: any) => ({ value: m.id, label: m.nombre })));
      });
    } else {
      setMunicipios([]);
    }
  }, [form.region]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.user_id) newErrors.user_id = 'El User ID es obligatorio';
    if (!form.region) newErrors.region = 'La región es obligatoria';
    if (!form.municipio) newErrors.municipio = 'El municipio es obligatorio';
    if (!form.edad || isNaN(Number(form.edad))) newErrors.edad = 'Edad válida obligatoria';
    if (!form.genero) newErrors.genero = 'El género es obligatorio';
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
      await createVotantes({ ...form, edad: Number(form.edad) });
      setSuccess(true);
      setForm({ user_id: '', region: '', municipio: '', edad: '', genero: '' });
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <InputField label="User ID" name="user_id" value={form.user_id} onChange={handleChange} error={errors.user_id} required />
      <SelectField label="Región" name="region" value={form.region} onChange={handleChange} error={errors.region} options={regiones} required />
      <SelectField label="Municipio" name="municipio" value={form.municipio} onChange={handleChange} error={errors.municipio} options={municipios} required />
      <InputField label="Edad" name="edad" value={form.edad} onChange={handleChange} error={errors.edad} required type="number" />
      <InputField label="Género" name="genero" value={form.genero} onChange={handleChange} error={errors.genero} required />
      <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Guardando...' : 'Crear Votante'}</button>
      {success && <div className="text-green-600">¡Votante creado!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default VotanteForm; 