import React from 'react';
import Layout from '../components/Layout';

const APropos: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">À propos de Distritherm Service</h1>
        <div className="prose max-w-none">
          {/* Le contenu de la page À propos sera ajouté ultérieurement */}
        </div>
      </div>
    </Layout>
  );
};

export default APropos; 