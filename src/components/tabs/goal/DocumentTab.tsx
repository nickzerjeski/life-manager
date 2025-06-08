import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { formatDate } from '../../helpers';

interface DocumentTabProps {
  client: any;
  isEditing: boolean;
}

const DocumentTab: React.FC<DocumentTabProps> = ({ client, isEditing }) => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold mb-2 text-gray-700">Dokumente</h4>
    <p className="text-sm text-blue-700 bg-blue-100 p-3 rounded-md border border-blue-300">
      <strong>Hinweis:</strong> Dokumenten-Upload und -Verwaltung erfordern eine Backend-Integration für die Dateispeicherung.
    </p>
    {isEditing && (
      <div className="mb-4 p-4 border border-dashed border-gray-300 rounded-md text-center">
        <p className="text-gray-500 mb-2 text-sm">Dokument hochladen (Funktion nicht implementiert)</p>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-3 rounded">
          Datei auswählen...
        </button>
      </div>
    )}
    {client.documents?.length > 0 ? (
      <ul className="space-y-2">
        {client.documents.map((doc: any) => (
          <li
            key={doc.id}
            className="p-3 border border-gray-200 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50"
          >
            <div className="flex items-center space-x-2 flex-grow min-w-0">
              <FileText size={18} className="text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate" title={doc.name}>{doc.name}</p>
                <p className="text-xs text-gray-600">Typ: {doc.type} | Hochgeladen: {formatDate(doc.uploadDate)}</p>
              </div>
            </div>
            <div className="flex space-x-2 flex-shrink-0 self-end sm:self-center">
              <button className="text-blue-600 hover:text-blue-800 p-1" title="Herunterladen (nicht implementiert)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </button>
              {isEditing && (
                <button className="text-red-600 hover:text-red-800 p-1" title="Löschen (nicht implementiert)">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic text-sm">Keine Dokumente erfasst.</p>
    )}
  </div>
);

export default DocumentTab;
