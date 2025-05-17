// frontend/src/pages/Resources.jsx
import React from "react";
import DocumentList from "../components/documents/DocumentList";
import { FileBox } from "lucide-react";

const Resources = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <FileBox className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Resources</h1>
        </div>
        <p className="text-gray-600">
          Access and download important documents, guides, and training
          materials.
        </p>
      </div>

      <DocumentList />
    </div>
  );
};

export default Resources;
