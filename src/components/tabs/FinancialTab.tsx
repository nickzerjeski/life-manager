import React from 'react';
import { formatCurrency } from '../helpers';

interface FinancialTabProps {
  client: any;
  isEditing: boolean;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ client, isEditing }) => (
  <div className="space-y-6">
    <div>
      <h4 className="text-lg font-semibold mb-2 text-gray-700">Bankkonten</h4>
      {isEditing && <p className="text-sm text-yellow-700 italic mb-2">Bearbeitung von Bankkonten ist in diesem Prototyp nicht implementiert.</p>}
      {client.bankAccounts?.length > 0 ? (
        <div className="space-y-3">
          {client.bankAccounts.map((acc: any) => (
            <div key={acc.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm">
              <p><strong>Bank:</strong> {acc.bankName}</p>
              <p><strong>IBAN:</strong> <span className="font-mono blur-sm hover:blur-none transition-all">{acc.iban}</span></p>
              <p><strong>BIC:</strong> {acc.bic}</p>
              <p><strong>Saldo:</strong> {formatCurrency(acc.balance)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">Keine Bankkonten erfasst.</p>
      )}
      {isEditing && <button className="mt-2 text-sm text-blue-600 hover:underline">+ Konto hinzufügen (nicht implementiert)</button>}
    </div>

    <div>
      <h4 className="text-lg font-semibold mb-2 text-gray-700">Einkünfte</h4>
      {isEditing && <p className="text-sm text-yellow-700 italic mb-2">Bearbeitung von Einkünften ist in diesem Prototyp nicht implementiert.</p>}
      {client.income?.length > 0 ? (
        <ul className="list-disc list-inside space-y-1 text-sm">
          {client.income.map((inc: any) => (
            <li key={inc.id}>{inc.source}: {formatCurrency(inc.amount)} ({inc.frequency})</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">Keine Einkünfte erfasst.</p>
      )}
      {isEditing && <button className="mt-2 text-sm text-blue-600 hover:underline">+ Einkunft hinzufügen (nicht implementiert)</button>}
    </div>

    <div>
      <h4 className="text-lg font-semibold mb-2 text-gray-700">Regelmäßige Ausgaben</h4>
      {isEditing && <p className="text-sm text-yellow-700 italic mb-2">Bearbeitung von Ausgaben ist in diesem Prototyp nicht implementiert.</p>}
      {client.expenses?.length > 0 ? (
        <ul className="list-disc list-inside space-y-1 text-sm">
          {client.expenses.map((exp: any) => (
            <li key={exp.id}>{exp.category}: {formatCurrency(exp.amount)} ({exp.frequency})</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">Keine regelmäßigen Ausgaben erfasst.</p>
      )}
      {isEditing && <button className="mt-2 text-sm text-blue-600 hover:underline">+ Ausgabe hinzufügen (nicht implementiert)</button>}
    </div>
  </div>
);

export default FinancialTab;
