import React from 'react';

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isEditing: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  isEditing,
}) => (
  <div className="mb-3">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {isEditing ? (
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        rows={3}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
      />
    ) : (
      <p className="text-gray-900 p-2 rounded-md bg-gray-50 whitespace-pre-wrap min-h-[60px] text-sm">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </p>
    )}
  </div>
);

export default TextAreaField;
