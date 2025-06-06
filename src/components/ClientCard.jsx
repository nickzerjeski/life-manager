import React from 'react';
import { User } from 'lucide-react';
import { formatDate } from './helpers';

const ClientCard = ({ client, onSelectClient }) => (
  <div
    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
    onClick={() => onSelectClient(client)}
  >
    <div className="flex items-center space-x-3">
      <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
        <User className="text-blue-600" size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {client.firstName} {client.lastName}
        </h3>
        <p className="text-sm text-gray-500">
          Geb.: {formatDate(client.dob)}
        </p>
        <p className="text-sm text-gray-500 truncate">{client.address}</p>
      </div>
    </div>
  </div>
);

export default ClientCard;
