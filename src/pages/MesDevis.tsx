import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FaFileInvoice, FaRegCalendarAlt, FaEuroSign, FaEye, FaFileDownload, FaSearch, FaChevronDown, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Interface pour les devis
interface Quote {
  id: string;
  quoteNumber: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  totalAmount: number;
  items: QuoteItem[];
}

interface QuoteItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

const MesDevis: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/connexion');
    }
  }, [isAuthenticated, navigate]);

  // Charger les données fictives
  useEffect(() => {
    setTimeout(() => {
      const mockQuotes: Quote[] = [
        {
          id: '1',
          quoteNumber: 'DEV-2024-001',
          date: '2024-03-15T10:30:00Z',
          status: 'pending',
          totalAmount: 2500.99,
          items: [
            {
              id: 'item1',
              productId: 'prod1',
              productName: 'Pompe à chaleur AIRWELL',
              quantity: 1,
              unitPrice: 2000.99,
              imageUrl: '/climatisation.jpeg'
            },
            {
              id: 'item2',
              productId: 'prod2',
              productName: 'Installation standard',
              quantity: 1,
              unitPrice: 500.00,
              imageUrl: '/installation.jpeg'
            }
          ]
        },
        {
          id: '2',
          quoteNumber: 'DEV-2024-002',
          date: '2024-03-18T14:45:00Z',
          status: 'accepted',
          totalAmount: 1899.99,
          items: [
            {
              id: 'item3',
              productId: 'prod3',
              productName: 'Climatiseur réversible DAIKIN',
              quantity: 1,
              unitPrice: 1599.99,
              imageUrl: '/climatisation.jpeg'
            },
            {
              id: 'item4',
              productId: 'prod4',
              productName: 'Kit installation premium',
              quantity: 1,
              unitPrice: 300.00,
              imageUrl: '/installation.jpeg'
            }
          ]
        },
        {
          id: '3',
          quoteNumber: 'DEV-2024-003',
          date: '2024-03-20T09:15:00Z',
          status: 'rejected',
          totalAmount: 799.99,
          items: [
            {
              id: 'item5',
              productId: 'prod5',
              productName: 'Radiateur connecté ACOVA',
              quantity: 1,
              unitPrice: 799.99,
              imageUrl: '/chauffage.jpeg'
            }
          ]
        },
        {
          id: '4',
          quoteNumber: 'DEV-2024-004',
          date: '2024-03-22T11:30:00Z',
          status: 'pending',
          totalAmount: 3299.99,
          items: [
            {
              id: 'item6',
              productId: 'prod6',
              productName: 'Système de climatisation complet',
              quantity: 1,
              unitPrice: 2799.99,
              imageUrl: '/climatisation.jpeg'
            },
            {
              id: 'item7',
              productId: 'prod7',
              productName: 'Installation et mise en service',
              quantity: 1,
              unitPrice: 500.00,
              imageUrl: '/installation.jpeg'
            }
          ]
        },
        {
          id: '5',
          quoteNumber: 'DEV-2024-005',
          date: '2024-03-25T16:20:00Z',
          status: 'expired',
          totalAmount: 1499.99,
          items: [
            {
              id: 'item8',
              productId: 'prod8',
              productName: 'Chauffe-eau thermodynamique',
              quantity: 1,
              unitPrice: 1499.99,
              imageUrl: '/chauffage.jpeg'
            }
          ]
        },
        {
          id: '6',
          quoteNumber: 'DEV-2024-006',
          date: '2024-03-27T13:45:00Z',
          status: 'accepted',
          totalAmount: 2199.99,
          items: [
            {
              id: 'item9',
              productId: 'prod9',
              productName: 'Pompe à chaleur Air/Eau',
              quantity: 1,
              unitPrice: 1899.99,
              imageUrl: '/chauffage.jpeg'
            },
            {
              id: 'item10',
              productId: 'prod10',
              productName: 'Kit de raccordement premium',
              quantity: 1,
              unitPrice: 300.00,
              imageUrl: '/installation.jpeg'
            }
          ]
        },
        {
          id: '7',
          quoteNumber: 'DEV-2024-007',
          date: '2024-03-29T10:00:00Z',
          status: 'pending',
          totalAmount: 999.99,
          items: [
            {
              id: 'item11',
              productId: 'prod11',
              productName: 'Radiateur électrique intelligent',
              quantity: 2,
              unitPrice: 499.99,
              imageUrl: '/chauffage.jpeg'
            }
          ]
        },
        {
          id: '8',
          quoteNumber: 'DEV-2024-008',
          date: '2024-03-30T15:30:00Z',
          status: 'pending',
          totalAmount: 4499.99,
          items: [
            {
              id: 'item12',
              productId: 'prod12',
              productName: 'Climatisation multi-split MITSUBISHI',
              quantity: 1,
              unitPrice: 3999.99,
              imageUrl: '/climatisation.jpeg'
            },
            {
              id: 'item13',
              productId: 'prod13',
              productName: 'Installation complète multi-split',
              quantity: 1,
              unitPrice: 500.00,
              imageUrl: '/installation.jpeg'
            }
          ]
        }
      ];

      setQuotes(mockQuotes);
      setLoading(false);
    }, 1000);
  }, []);

  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Traduction et couleur du statut
  const getStatusInfo = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' };
      case 'accepted':
        return { label: 'Accepté', color: 'bg-green-100 text-green-700' };
      case 'rejected':
        return { label: 'Refusé', color: 'bg-red-100 text-red-700' };
      case 'expired':
        return { label: 'Expiré', color: 'bg-gray-100 text-gray-700' };
      default:
        return { label: 'Inconnu', color: 'bg-gray-100 text-gray-700' };
    }
  };

  // Filtrer les devis
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaFileInvoice className="mr-3 text-[#007FFF]" />
              Mes Devis
            </h1>
          </div>

          {/* Filtres */}
          {!selectedQuote && !loading && quotes.length > 0 && (
            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un devis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007FFF] focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="relative min-w-[200px]">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007FFF] focus:border-transparent appearance-none transition-colors bg-white/80 backdrop-blur-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Accepté</option>
                  <option value="rejected">Refusé</option>
                  <option value="expired">Expiré</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007FFF]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <p className="flex items-center">
                <FaFileInvoice className="mr-2" />
                {error}
              </p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center shadow-sm">
              <FaFileInvoice className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devis</h3>
              <p className="text-gray-600 mb-6">Vous n'avez pas encore reçu de devis.</p>
              <button
                onClick={() => navigate('/nos-produits')}
                className="px-4 py-2 bg-[#007FFF] text-white rounded-md hover:bg-[#7CB9E8] transition-colors"
              >
                Parcourir nos produits
              </button>
            </div>
          ) : (
            <div className="">
              {selectedQuote ? (
                // Détail du devis sélectionné
                <div className="p-4 md:p-6 bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">
                      Devis #{selectedQuote.quoteNumber}
                    </h2>
                    <button
                      onClick={() => setSelectedQuote(null)}
                      className="text-gray-600 hover:text-[#007FFF] inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Retour aux devis
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Date du devis</h3>
                      <p className="flex items-center text-gray-800">
                        <FaRegCalendarAlt className="mr-2 text-[#007FFF]" />
                        {formatDate(selectedQuote.date)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Statut</h3>
                      <p className={`flex items-center ${getStatusInfo(selectedQuote.status).color}`}>
                        <FaFileInvoice className="mr-2" />
                        {getStatusInfo(selectedQuote.status).label}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
                    <div className="hidden md:grid grid-cols-12 gap-2 bg-gray-100 p-4 text-sm text-gray-500">
                      <div className="col-span-6">Produit</div>
                      <div className="col-span-2 text-center">Prix unitaire</div>
                      <div className="col-span-2 text-center">Quantité</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {selectedQuote.items.map(item => (
                        <div key={item.id} className="p-4">
                          {/* Version mobile */}
                          <div className="md:hidden space-y-2">
                            <div className="flex items-center">
                              {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.productName} className="h-16 w-16 object-cover rounded mr-3" />
                              )}
                              <div>
                                <h4 className="font-medium text-gray-800">{item.productName}</h4>
                                <p className="text-sm text-gray-500">
                                  Prix unitaire: {item.unitPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </p>
                                <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                <p className="text-sm font-medium text-gray-800">
                                  Total: {(item.unitPrice * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Version desktop */}
                          <div className="hidden md:grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-6 flex items-center">
                              {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.productName} className="h-10 w-10 mr-3 object-cover rounded" />
                              )}
                              <span className="font-medium text-gray-800">{item.productName}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              {item.unitPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </div>
                            <div className="col-span-2 text-center">{item.quantity}</div>
                            <div className="col-span-2 text-right font-medium">
                              {(item.unitPrice * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="font-bold text-gray-800">
                          {selectedQuote.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-end space-y-3 md:space-y-0 md:space-x-4">
                    {selectedQuote.status === 'pending' && (
                      <>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center">
                          Accepter le devis
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center">
                          Refuser le devis
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 bg-[#007FFF] text-white rounded-xl hover:bg-[#7CB9E8] transition-colors flex items-center justify-center">
                      <FaFileDownload className="mr-2" />
                      Télécharger le devis
                    </button>
                  </div>
                </div>
              ) : (
                // Liste des devis en cartes
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 px-4 sm:px-6 lg:px-8">
                  {filteredQuotes.map(quote => (
                    <div 
                      key={quote.id} 
                      className="relative overflow-hidden border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:scale-[1.02] group"
                    >
                      {/* Bande de statut colorée en haut */}
                      <div className={`absolute top-0 left-0 right-0 h-1 ${
                        quote.status === 'accepted' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        quote.status === 'pending' ? 'bg-gradient-to-r from-yellow-300 to-yellow-400' :
                        quote.status === 'rejected' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                        'bg-gradient-to-r from-gray-300 to-gray-400'
                      }`}></div>
                      
                      <div className="p-5 space-y-4">
                        {/* En-tête avec numéro et statut */}
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <h3 className="text-base font-bold text-gray-800 group-hover:text-[#007FFF] transition-colors">
                              Devis #{quote.quoteNumber}
                            </h3>
                            <div className="flex items-center mt-1 text-gray-500">
                              <FaRegCalendarAlt className="mr-1 text-[#007FFF] text-xs" />
                              <span className="text-xs">{formatDate(quote.date)}</span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                            quote.status === 'accepted' ? 'bg-green-50 text-green-700 border border-green-200' :
                            quote.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            quote.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              quote.status === 'accepted' ? 'bg-green-500' :
                              quote.status === 'pending' ? 'bg-yellow-500' :
                              quote.status === 'rejected' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`}></span>
                            {getStatusInfo(quote.status).label}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Informations sur les articles */}
                          <div className="flex items-center justify-between rounded-lg p-3 bg-gray-50/80 backdrop-blur-sm">
                            <div className="flex items-center">
                              <div className="p-1.5 rounded-md bg-[#007FFF]/10 mr-2">
                                <FaFileAlt className="text-[#007FFF] text-xs" />
                              </div>
                              <span className="text-xs font-medium text-gray-600">Articles</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">{quote.items.length}</span>
                          </div>

                          {/* Prix total */}
                          <div className="flex items-center justify-between p-3 bg-[#007FFF]/5 rounded-lg">
                            <span className="text-xs font-medium text-gray-600">Total</span>
                            <div className="flex items-center text-sm font-bold text-gray-800">
                              <span className="text-[#007FFF] mr-1 text-xs">€</span>
                              {quote.totalAmount.toLocaleString('fr-FR', { 
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          <button
                            onClick={() => setSelectedQuote(quote)}
                            className="w-full bg-[#007FFF] text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#0066CC] transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow group-hover:shadow-md"
                          >
                            <FaEye className="mr-2 text-xs" />
                            Voir détail
                          </button>
                          
                          <div className={`grid ${quote.status === 'pending' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                            {quote.status === 'pending' ? (
                              <>
                                <button
                                  className="group/btn relative w-full text-green-600 border border-green-500 rounded-lg py-2 px-4 text-sm font-medium hover:bg-green-500 hover:text-white transition-all duration-200 flex items-center justify-center overflow-hidden"
                                >
                                  <div className="relative z-10 flex items-center justify-center">
                                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Accepter
                                  </div>
                                  <div className="absolute inset-0 bg-green-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-200 z-0"></div>
                                </button>
                                <button
                                  className="group/btn relative w-full text-red-600 border border-red-500 rounded-lg py-2 px-4 text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center overflow-hidden"
                                >
                                  <div className="relative z-10 flex items-center justify-center">
                                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Refuser
                                  </div>
                                  <div className="absolute inset-0 bg-red-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-200 z-0"></div>
                                </button>
                              </>
                            ) : (
                              <button
                                className="group/btn relative w-full text-[#007FFF] border border-[#007FFF] rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#007FFF] hover:text-white transition-all duration-200 flex items-center justify-center overflow-hidden"
                              >
                                <div className="relative z-10 flex items-center justify-center">
                                  <FaFileDownload className="mr-2 text-xs" />
                                  Télécharger
                                </div>
                                <div className="absolute inset-0 bg-[#007FFF] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-200 z-0"></div>
                              </button>
                            )}
                          </div>
                          
                          {quote.status === 'pending' && (
                            <button
                              className="group/btn relative w-full text-[#007FFF] border border-[#007FFF] rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#007FFF] hover:text-white transition-all duration-200 flex items-center justify-center overflow-hidden"
                            >
                              <div className="relative z-10 flex items-center justify-center">
                                <FaFileDownload className="mr-2 text-xs" />
                                Télécharger
                              </div>
                              <div className="absolute inset-0 bg-[#007FFF] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-200 z-0"></div>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MesDevis; 