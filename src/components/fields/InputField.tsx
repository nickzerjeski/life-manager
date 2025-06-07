import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  type?: string;
  sensitive?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  isEditing,
  type = 'text',
  sensitive = false,
}) => (
  <div className="mb-3">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
      />
    ) : (
      <p
        className={`text-gray-900 p-2 rounded-md bg-gray-50 min-h-[40px] text-sm ${
          sensitive ? 'font-mono blur-sm hover:blur-none transition-all' : ''
        }`}
      >
        {value || <span className="text-gray-400 italic">Nicht angegeben</span>}
      </p>
    )}
  </div>
);

export default InputField;
