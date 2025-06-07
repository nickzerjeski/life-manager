import React from 'react';

interface HealthTabProps {
  client: any;
  isEditing: boolean;
}

const HealthTab: React.FC<HealthTabProps> = ({ client, isEditing }) => (
  <div className="space-y-6">
    <p className="text-sm text-red-700 bg-red-100 p-3 rounded-md border border-red-300">
      <strong>Achtung:</strong> Gesundheitsdaten sind besonders sensibel (DSGVO Art. 9). Die Speicherung und Verarbeitung erfordert höchste Sicherheitsstandards und eine klare Rechtsgrundlage. Diese Darstellung ist nur ein Beispiel.
    </p>
    <div>
      <h4 className="text-lg font-semibold mb-2 text-gray-700">Ärzte</h4>
      {isEditing && <p className="text-sm text-yellow-700 italic mb-2">Bearbeitung von Ärzten ist in diesem Prototyp nicht implementiert.</p>}
      {client.doctors?.length > 0 ? (
        <div className="space-y-3">
          {client.doctors.map((doc: any) => (
            <div key={doc.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm">
              <p><strong>Name:</strong> {doc.name}</p>
              <p><strong>Fachrichtung:</strong> {doc.specialty}</p>
              <p><strong>Telefon:</strong> {doc.phone}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">Keine Ärzte erfasst.</p>
      )}
      {isEditing && <button className="mt-2 text-sm text-blue-600 hover:underline">+ Arzt hinzufügen (nicht implementiert)</button>}
    </div>
  </div>
);

export default HealthTab;
