import React from 'react';
import InputField from '../../fields/InputField';

interface OverviewTabProps {
  client: any;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScopeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ client, isEditing, onChange, onScopeChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
    <InputField label="First Name" name="firstName" value={client.firstName} onChange={onChange} isEditing={isEditing} />
    <InputField label="Last Name" name="lastName" value={client.lastName} onChange={onChange} isEditing={isEditing} />
    <InputField label="Date of Birth" name="dob" value={client.dob} onChange={onChange} isEditing={isEditing} type="date" />
    <InputField label="Address" name="address" value={client.address} onChange={onChange} isEditing={isEditing} />
    <InputField label="Phone" name="phone" value={client.phone} onChange={onChange} isEditing={isEditing} type="tel" />
    <InputField label="Email" name="email" value={client.email} onChange={onChange} isEditing={isEditing} type="email" />
    <InputField
      label="Social Security Number"
      name="socialSecurityNumber"
      value={client.socialSecurityNumber}
      onChange={onChange}
      isEditing={isEditing}
      sensitive={true}
    />
    <InputField
      label="Tax Identification Number"
      name="taxId"
      value={client.taxId}
      onChange={onChange}
      isEditing={isEditing}
      sensitive={true}
    />
    <InputField label="Health Insurance" name="healthInsurance" value={client.healthInsurance} onChange={onChange} isEditing={isEditing} />
    <InputField
      label="Insurance Number"
      name="insuranceNumber"
      value={client.insuranceNumber}
      onChange={onChange}
      isEditing={isEditing}
    />
    <InputField label="Pension Number" name="pensionNumber" value={client.pensionNumber} onChange={onChange} isEditing={isEditing} />
    <InputField label="Guardianship Court" name="court" value={client.court} onChange={onChange} isEditing={isEditing} />
    <InputField label="Case Number" name="caseNumber" value={client.caseNumber} onChange={onChange} isEditing={isEditing} />
    <div className="mb-3 md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Scope of Care</label>
      {isEditing ? (
        <input
          type="text"
          id="careScope"
          name="careScope"
          value={client.careScope?.join(', ') || ''}
          onChange={onScopeChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          placeholder="e.g. asset management, health care (comma-separated)"
        />
      ) : (
        <p className="text-gray-900 p-2 rounded-md bg-gray-50 min-h-[40px] text-sm">
          {client.careScope?.join(', ') || <span className="text-gray-400 italic">Not provided</span>}
        </p>
      )}
    </div>
  </div>
);

export default OverviewTab;
