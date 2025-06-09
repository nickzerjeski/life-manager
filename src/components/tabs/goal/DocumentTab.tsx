import React, { useEffect, useState } from 'react'
import { FileText, Trash2 } from 'lucide-react'
import { Goal } from '@/models/Goal'
import { Document } from '@/models/Document'
import { DocumentHandler } from '@/models/DocumentHandler'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatDate } from '../../helpers'

interface DocumentTabProps {
  goal: Goal
  isEditing: boolean
}

const DocumentTab: React.FC<DocumentTabProps> = ({ goal, isEditing }) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const handler = React.useMemo(() => DocumentHandler.getInstance(), [])

  const loadDocuments = React.useCallback(() => {
    handler
      .getDocumentsForGoal(goal.id)
      .then(setDocuments)
      .catch(console.error)
  }, [goal.id, handler])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    const doc = new Document(0, goal.id, name, type, new Date())
    try {
      const created = await handler.createDocument(doc)
      await handler.uploadDocument(created.id, file)
      setName('')
      setType('')
      setFile(null)
      loadDocuments()
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await handler.deleteDocument(id)
      loadDocuments()
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err)
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold mb-2 text-gray-700">Documents</h4>
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded p-4 text-gray-800 space-y-2"
        >
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            className="text-sm"
          />
          <Input
            value={type}
            onChange={e => setType(e.target.value)}
            placeholder="Type"
            className="text-sm"
          />
          <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded"
          >
            Upload
          </Button>
        </form>
      )}
      {documents.length > 0 ? (
        <ul className="space-y-2">
          {documents.map(doc => (
            <li
              key={doc.id}
              className="bg-white shadow rounded p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-gray-800"
            >
              <div className="flex items-center space-x-2 flex-grow min-w-0">
                <FileText size={18} className="text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" title={doc.name}>
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Type: {doc.type} | Uploaded:{' '}
                    {formatDate(doc.uploadDate.toISOString())}
                  </p>
                </div>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-600 hover:text-red-800 p-1 self-end sm:self-center"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">No documents recorded.</p>
      )}
    </div>
  )
}

export default DocumentTab
