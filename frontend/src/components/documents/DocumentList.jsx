// frontend/src/components/documents/DocumentList.jsx
import React, { useState, useEffect } from "react";
import { getAllDocuments } from "../../api/documentApi";
import DocumentItem from "./DocumentItem";
import DocumentUpload from "./DocumentUpload";
import { useAuth } from "../../context/AuthContext";
import { File, Filter, Plus } from "lucide-react";
import Loading from "../common/Loading";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Alert from "../common/Alert";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'contract', 'policy', 'training', 'guide', 'form'
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { user } = useAuth();

  // Check if user can upload documents (HR only)
  const canUpload = user.role === "hr";

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const fetchedDocuments = await getAllDocuments();
        setDocuments(fetchedDocuments);
        setError(null);
      } catch (err) {
        setError("Failed to load documents. Please try again later.");
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDocumentAdd = (newDocument) => {
    setDocuments([...documents, newDocument]);
    setShowUploadForm(false);
  };

  const handleDocumentDelete = (deletedDocumentId) => {
    setDocuments(documents.filter((doc) => doc.id !== deletedDocumentId));
  };

  // Filter documents by category
  const filteredDocuments = documents.filter((doc) => {
    if (filter === "all") return true;
    return doc.category === filter;
  });

  // Group documents by category
  const groupedDocuments = filteredDocuments.reduce((groups, doc) => {
    const category = doc.category || "other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(doc);
    return groups;
  }, {});

  if (loading) return <Loading message="Loading documents..." />;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <File className="h-5 w-5 mr-2 text-blue-500" />
          Documents & Resources
        </h2>

        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="appearance-none px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="contract">Contracts</option>
              <option value="policy">Policies</option>
              <option value="training">Training</option>
              <option value="guide">Guides</option>
              <option value="form">Forms</option>
            </select>
          </div>

          {canUpload && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setShowUploadForm(true)}
            >
              Upload Document
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error Loading Documents"
          message={error}
          className="m-4"
        />
      )}

      {Object.keys(groupedDocuments).length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <File className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p>No documents found</p>
          {filter !== "all" && (
            <p className="mt-1 text-sm">
              Try changing your filter or uploading new documents
            </p>
          )}
          {canUpload && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowUploadForm(true)}
            >
              Upload Your First Document
            </Button>
          )}
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {Object.entries(groupedDocuments).map(([category, docs]) => (
            <div key={category}>
              <h3 className="text-base font-medium text-gray-900 mb-3 capitalize">
                {category === "contract"
                  ? "Contracts"
                  : category === "policy"
                  ? "Policies"
                  : category === "training"
                  ? "Training Materials"
                  : category === "guide"
                  ? "Guides & Manuals"
                  : category === "form"
                  ? "Forms"
                  : "Other Documents"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc) => (
                  <DocumentItem
                    key={doc.id}
                    document={doc}
                    canUpload={canUpload}
                    onDelete={handleDocumentDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Form Modal */}
      <Modal
        isOpen={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        title="Upload Document"
        size="md"
      >
        <DocumentUpload
          onSubmit={handleDocumentAdd}
          onCancel={() => setShowUploadForm(false)}
        />
      </Modal>
    </div>
  );
};

export default DocumentList;
