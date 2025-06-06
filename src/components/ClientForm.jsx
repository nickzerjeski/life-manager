import React, { useState } from 'react';
import InputField from './fields/InputField';
import TextAreaField from './fields/TextAreaField';

const ClientForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || {
      firstName: '',
      lastName: '',
      dob: '',
      address: '',
      phone: '',
      email: '',
      betreuungScope: [],
      court: '',
      caseNumber: '',
      socialSecurityNumber: '',
      taxId: '',
      healthInsurance: '',
      insuranceNumber: '',
      pensionNumber: '',
      bankAccounts: [],
      income: [],
      expenses: [],
      doctors: [],
      tasks: [],
      documents: []
    }
  );
  const isEditMode = !!initialData?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScopeChange = (e) => {
    const scopes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, betreuungScope: scopes }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-md font-semibold text-gray-600 border-b pb-1 mb-3">Persönliche Daten</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0">
        <InputField label="Vorname" name="firstName" value={formData.firstName} onChange={handleChange} isEditing={true} />
        <InputField label="Nachname" name="lastName" value={formData.lastName} onChange={handleChange} isEditing={true} />
        <InputField label="Geburtsdatum" name="dob" value={formData.dob} onChange={handleChange} isEditing={true} type="date" />
        <InputField label="Adresse" name="address" value={formData.address} onChange={handleChange} isEditing={true} />
        <InputField label="Telefon" name="phone" value={formData.phone} onChange={handleChange} isEditing={true} type="tel" />
        <InputField label="E-Mail" name="email" value={formData.email} onChange={handleChange} isEditing={true} type="email" />
      </div>

      <h4 className="text-md font-semibold text-gray-600 border-b pb-1 mb-3 mt-4">Rechtliche Betreuung</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0">
        <InputField label="Betreuungsgericht" name="court" value={formData.court} onChange={handleChange} isEditing={true} />
        <InputField label="Aktenzeichen" name="caseNumber" value={formData.caseNumber} onChange={handleChange} isEditing={true} />
        <div className="md:col-span-2">
          <label htmlFor="betreuungScopeForm" className="block text-sm font-medium text-gray-700 mb-1">Aufgabenkreise (Komma-getrennt)</label>
          <input
            type="text"
            id="betreuungScopeForm"
            name="betreuungScope"
            value={formData.betreuungScope?.join(', ') || ''}
            onChange={handleScopeChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder="z.B. Vermögenssorge, Gesundheitssorge"
          />
        </div>
      </div>

      <h4 className="text-md font-semibold text-gray-600 border-b pb-1 mb-3 mt-4">Identifikation & Versicherung</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0">
        <InputField label="Sozialversicherungsnummer" name="socialSecurityNumber" value={formData.socialSecurityNumber} onChange={handleChange} isEditing={true} />
        <InputField label="Steueridentifikationsnummer" name="taxId" value={formData.taxId} onChange={handleChange} isEditing={true} />
        <InputField label="Krankenkasse" name="healthInsurance" value={formData.healthInsurance} onChange={handleChange} isEditing={true} />
        <InputField label="Versichertennummer (Krankenkasse)" name="insuranceNumber" value={formData.insuranceNumber} onChange={handleChange} isEditing={true} />
        <InputField label="Rentenversicherungsnummer" name="pensionNumber" value={formData.pensionNumber} onChange={handleChange} isEditing={true} />
      </div>

      <div className="flex justify-end space-x-3 pt-5 border-t mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
        >
          {isEditMode ? 'Änderungen speichern' : 'Klienten hinzufügen'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
