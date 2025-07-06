import React, { useState, useEffect } from 'react';
import { createVotos } from '../services/votosService';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import { supabase } from '../lib/supabase';

const VotoForm = () => {
  const [form, setForm] = useState({
    votante_id: '',
    candidato_id: '',
    region: '',
    municipio: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [votantes, setVotantes] = useState<{ value: string; label: string }[]>([]);
  const [candidatos, setCandidatos] = useState<{ value: string; label: string }[]>([]);
  const [regiones, setRegiones] = useState<{ value: string; label: string }[]>([]);
  const [municipios, setMunicipios] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    supabase.from('votantes').select('id').then(({ data }) => {
      if (data) setVotantes(data.map((v: any) => ({ value: v.id, label: v.id })));
    });
    supabase.from('candidatos').select('id, first_name, last_name').then(({ data }) => {
      if (data) setCandidatos(data.map((c: any) => ({ value: c.id, label: `${c.first_name} ${c.last_name}` })));
    });
    supabase.from('regiones').select('id, nombre').then(({ data }) => {
      if (data) setRegiones(data.map((r: any) => ({ value: r.id, label: r.nombre })));
    });
  }, []);

  useEffect(() => {
    if (form.region) {
      supabase.from('municipios').select('id, nombre').eq('region_id', form.region).then(({ data }) => {
        if (data) setMunicipios(data.map((m: any) => ({ value: m.id, label: m.nombre })));
      });
    } else {
      setMunicipios([]);
    }
  }, [form.region]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.votante_id) newErrors.votante_id = 'El votante es obligatorio';
    if (!form.candidato_id) newErrors.candidato_id = 'El candidato es obligatorio';
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
      await createVotos(form);
      setSuccess(true);
      setForm({ votante_id: '', candidato_id: '', region: '', municipio: '' });
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <SelectField label="Votante" name="votante_id" value={form.votante_id} onChange={handleChange} error={errors.votante_id} options={votantes} required />
      <SelectField label="Candidato" name="candidato_id" value={form.candidato_id} onChange={handleChange} error={errors.candidato_id} options={candidatos} required />
      <SelectField label="Región" name="region" value={form.region} onChange={handleChange} error={errors.region} options={regiones} required />
      <SelectField label="Municipio" name="municipio" value={form.municipio} onChange={handleChange} error={errors.municipio} options={municipios} required />
      <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Guardando...' : 'Registrar Voto'}</button>
      {success && <div className="text-green-600">¡Voto registrado!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default VotoForm; 