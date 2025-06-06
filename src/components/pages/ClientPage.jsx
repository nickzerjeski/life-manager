'use client';
import { useState } from 'react';
import Modal from '@/components/Modal';
import ClientListView from '@/components/ClientListView';
import ClientDetailView from '@/components/ClientDetailView';
import ClientForm from '@/components/ClientForm';

export default function ClientPage({ clients, setClients }) {
  /* ---------- local state ---------- */
  const [selected, setSelected] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');

  /* ---------- CRUD helpers ---------- */
  const addClient = data => {
    const newClient = {
      ...data,
      id: Date.now().toString(),
      bankAccounts: data.bankAccounts || [],
      income: data.income || [],
      expenses: data.expenses || [],
      doctors: data.doctors || [],
      tasks: data.tasks || [],
      documents: data.documents || [],
    };
    setClients(prev => [...prev, newClient]);
    setIsAdding(false);
  };

  const saveClient = updated =>
    setClients(prev => prev.map(c => (c.id === updated.id ? updated : c)));

  const deleteClient = id => {
    setClients(prev => prev.filter(c => c.id !== id));
    setSelected(null);
  };

  /* ---------- filter ---------- */
  const filtered = clients.filter(c =>
    `${c.firstName} ${c.lastName} ${c.address} ${c.caseNumber}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  /* ---------- UI ---------- */
  return (
    <section className="bg-white p-4 sm:p-6 rounded-lg shadow border">
      {selected ? (
        <ClientDetailView
          client={selected}
          onBack={() => setSelected(null)}
          onSaveChanges={saveClient}
          onDeleteClient={deleteClient}
        />
      ) : !isAdding ? (
        <ClientListView
          clients={filtered}
          onSelectClient={setSelected}
          onAddClient={() => setIsAdding(true)}
          searchTerm={search}
          setSearchTerm={setSearch}
        />
      ) : null}

      <Modal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title="Neuen Klienten hinzufügen"
      >
        <ClientForm onSubmit={addClient} onCancel={() => setIsAdding(false)} />
      </Modal>
    </section>
  );
}
