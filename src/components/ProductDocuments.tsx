import React from 'react';
import { ProductDocument } from '../types/product';
import { FaFileDownload, FaFilePdf, FaFileAlt, FaCertificate } from 'react-icons/fa';

interface ProductDocumentsProps {
  documents: ProductDocument[];
}

const ProductDocuments: React.FC<ProductDocumentsProps> = ({ documents }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'fiche_technique':
        return <FaFileAlt className="w-6 h-6" />;
      case 'manuel':
        return <FaFilePdf className="w-6 h-6" />;
      case 'certification':
        return <FaCertificate className="w-6 h-6" />;
      default:
        return <FaFileDownload className="w-6 h-6" />;
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'fiche_technique':
        return 'Fiche technique';
      case 'manuel':
        return 'Manuel d\'utilisation';
      case 'certification':
        return 'Certification';
      default:
        return 'Document';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
            download
            className="flex items-center p-4 space-x-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 group"
          >
            <div className="text-gray-400 group-hover:text-teal-600 transition-colors duration-200">
              {getIcon(doc.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
              <p className="text-xs text-gray-500">{getDocumentLabel(doc.type)}</p>
            </div>
            <FaFileDownload className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors duration-200" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProductDocuments; 