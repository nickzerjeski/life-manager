import React from 'react';
import InputField from '../fields/InputField';

interface PersonalTabProps {
  client: any;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScopeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalTab: React.FC<PersonalTabProps> = ({ client, isEditing, onChange, onScopeChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
    <InputField label="Vorname" name="firstName" value={client.firstName} onChange={onChange} isEditing={isEditing} />
    <InputField label="Nachname" name="lastName" value={client.lastName} onChange={onChange} isEditing={isEditing} />
    <InputField label="Geburtsdatum" name="dob" value={client.dob} onChange={onChange} isEditing={isEditing} type="date" />
    <InputField label="Adresse" name="address" value={client.address} onChange={onChange} isEditing={isEditing} />
    <InputField label="Telefon" name="phone" value={client.phone} onChange={onChange} isEditing={isEditing} type="tel" />
    <InputField label="E-Mail" name="email" value={client.email} onChange={onChange} isEditing={isEditing} type="email" />
    <InputField
      label="Sozialversicherungsnummer"
      name="socialSecurityNumber"
      value={client.socialSecurityNumber}
      onChange={onChange}
      isEditing={isEditing}
      sensitive={true}
    />
    <InputField
      label="Steueridentifikationsnummer"
      name="taxId"
      value={client.taxId}
      onChange={onChange}
      isEditing={isEditing}
      sensitive={true}
    />
    <InputField label="Krankenkasse" name="healthInsurance" value={client.healthInsurance} onChange={onChange} isEditing={isEditing} />
    <InputField
      label="Versichertennummer (Krankenkasse)"
      name="insuranceNumber"
      value={client.insuranceNumber}
      onChange={onChange}
      isEditing={isEditing}
    />
    <InputField label="Rentenversicherungsnummer" name="pensionNumber" value={client.pensionNumber} onChange={onChange} isEditing={isEditing} />
    <InputField label="Betreuungsgericht" name="court" value={client.court} onChange={onChange} isEditing={isEditing} />
    <InputField label="Aktenzeichen" name="caseNumber" value={client.caseNumber} onChange={onChange} isEditing={isEditing} />
    <div className="mb-3 md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Aufgabenkreise der Betreuung</label>
      {isEditing ? (
        <input
          type="text"
          id="betreuungScope"
          name="betreuungScope"
          value={client.betreuungScope?.join(', ') || ''}
          onChange={onScopeChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          placeholder="z.B. Vermögenssorge, Gesundheitssorge (Komma-getrennt)"
        />
      ) : (
        <p className="text-gray-900 p-2 rounded-md bg-gray-50 min-h-[40px] text-sm">
          {client.betreuungScope?.join(', ') || <span className="text-gray-400 italic">Nicht angegeben</span>}
        </p>
      )}
    </div>
  </div>
);

export default PersonalTab;
