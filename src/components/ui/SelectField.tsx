import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, error, options, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      {...props}
      className={`input-field w-full ${error ? 'border-red-500' : ''}`}
    >
      <option value="">Selecciona una opción</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
  </div>
);

export default SelectField; 