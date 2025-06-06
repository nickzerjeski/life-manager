import React from 'react';
import { Plus, Search } from 'lucide-react';
import ClientCard from './ClientCard';

const ClientListView = ({ clients, onSelectClient, onAddClient, searchTerm, setSearchTerm }) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
      <h1 className="text-2xl font-bold text-gray-800">Klientenübersicht</h1>
      <button
        onClick={onAddClient}
        className="flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
      >
        <Plus size={18} className="mr-2" />
        Neuen Klienten hinzufügen
      </button>
    </div>
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Klienten suchen (Name, Adresse, Aktenzeichen)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.length > 0 ? (
        clients.map(client => (
          <ClientCard key={client.id} client={client} onSelectClient={onSelectClient} />
        ))
      ) : (
        <p className="text-gray-500 col-span-full text-center py-10">Keine Klienten gefunden.</p>
      )}
    </div>
  </div>
);

export default ClientListView;
