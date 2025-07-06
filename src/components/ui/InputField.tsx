import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      className={`input-field w-full ${error ? 'border-red-500' : ''}`}
    />
    {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
  </div>
);

export default InputField; 