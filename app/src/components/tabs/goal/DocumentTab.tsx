import React, { useEffect, useState } from 'react'
import { FileText, Trash2, Upload } from 'lucide-react'
import { Goal } from '@shared/models/Goal'
import { Document } from '@shared/models/Document'
import { DocumentHandler } from '@shared/models/DocumentHandler'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Modal from '@/components/ui/modal'

interface DocumentTabProps {
  goal: Goal
  isEditing: boolean
}

const DocumentTab: React.FC<DocumentTabProps> = ({ goal, isEditing }) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [activeDoc, setActiveDoc] = useState<Document | null>(null)
  const [activeContent, setActiveContent] = useState<string | null>(null)
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
    try {
      await handler.uploadDocument(`${goal.id}/${file.name}`, file)
      setFile(null)
      loadDocuments()
      setShowUpload(false)
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await handler.deleteDocument(id)
      loadDocuments()
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err)
    }
  }

  const handleOpen = async (doc: Document) => {
    try {
      const result = await handler.getDocument(doc.id)
      setActiveDoc(doc)
      setActiveContent(result.content)
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err)
    }
  }

  const closeModal = () => {
    setActiveDoc(null)
    setActiveContent(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Documents</h4>
        <button
          type="button"
          onClick={() => setShowUpload(s => !s)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
        >
          <Upload size={16} className="mr-1 sm:mr-2" /> Upload Document
        </button>
      </div>
      {showUpload && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded p-4 text-gray-800 space-y-2"
        >
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
              onClick={() => handleOpen(doc)}
              className="bg-white shadow rounded p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-gray-800 cursor-pointer"
            >
              <div className="flex items-center space-x-2 flex-grow min-w-0">
                <FileText size={18} className="text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" title={doc.name}>
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Type: {doc.type} | Uploaded:{' '}
                    {doc.uploadDate.toISOString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(doc.id)}
                className="text-red-600 hover:text-red-800 p-1 self-end sm:self-center"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">No documents recorded.</p>
      )}
      {activeDoc && (
        <Modal isOpen={!!activeDoc} onClose={closeModal} title={activeDoc.name}>
          {activeDoc.type === 'pdf' && activeContent ? (
            <iframe
              src={`data:application/pdf;base64,${activeContent}`}
              className="w-full h-[80vh]"
            />
          ) : activeDoc.type === 'txt' && activeContent ? (
            <pre className="whitespace-pre-wrap text-sm">{activeContent}</pre>
          ) : (
            <p className="text-sm">Preview not available.</p>
          )}
        </Modal>
      )}
    </div>
  )
}

export default DocumentTab
