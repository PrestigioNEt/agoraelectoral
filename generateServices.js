// generateServices.js
const fs = require('fs');
const path = require('path');

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const tables = [
  'candidatos',
  'votantes',
  'votos',
  'notificaciones',
  'logs',
  // Agrega aquí más tablas si lo deseas
];

const serviceTemplate = (table) => `import { supabase } from './supabaseClient';


export const getAll${capitalize(table)} = async () => {
  const { data, error } = await supabase
    .from('${table}')
    .select('*');
  if (error) throw error;
  return data;
};

export const get${capitalize(table)}ById = async (id) => {
  const { data, error } = await supabase
    .from('${table}')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const create${capitalize(table)} = async (record) => {
  const { data, error } = await supabase
    .from('${table}')
    .insert([record])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const update${capitalize(table)} = async (id, updates) => {
  const { data, error } = await supabase
    .from('${table}')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const delete${capitalize(table)} = async (id) => {
  const { error } = await supabase
    .from('${table}')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};
`;

const servicesDir = path.join(__dirname, 'src', 'services');
if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

tables.forEach((table) => {
  const fileName = `${table}Service.ts`;
  const filePath = path.join(servicesDir, fileName);
  fs.writeFileSync(filePath, serviceTemplate(table));
  console.log(`Servicio generado: ${filePath}`);
});