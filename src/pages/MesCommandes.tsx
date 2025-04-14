import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingBag, FaCalendarAlt, FaEuroSign, FaCircle, FaInfoCircle, FaDownload, FaRegCalendarAlt, FaEye, FaFileDownload, FaFileInvoice, FaChevronDown, FaSearch as FaSearchIcon, FaSearch } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

// Interface pour les commandes
interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

interface Address {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

const MesCommandes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
    // Simulation d'un petit délai de chargement pour l'expérience utilisateur
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'CMD-2023-001',
          date: '2023-03-15T10:30:00Z',
          status: 'delivered',
          totalAmount: 1250.99,
          items: [
            {
              id: 'item1',
              productId: 'prod1',
              productName: 'Pompe à chaleur AIRWELL',
              quantity: 1,
              unitPrice: 999.99,
              imageUrl: '/climatisation.jpeg'
            },
            {
              id: 'item2',
              productId: 'prod2',
              productName: 'Kit installation standard',
              quantity: 1,
              unitPrice: 250.00,
              imageUrl: '/chauffage.jpeg'
            }
          ],
          shippingAddress: {
            fullName: 'Jean Dupont',
            streetAddress: '15 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          },
          billingAddress: {
            fullName: 'Jean Dupont',
            streetAddress: '15 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          }
        },
        {
          id: '2',
          orderNumber: 'CMD-2023-042',
          date: '2023-04-20T14:15:00Z',
          status: 'processing',
          totalAmount: 549.50,
          items: [
            {
              id: 'item3',
              productId: 'prod3',
              productName: 'Radiateur connecté ACOVA',
              quantity: 2,
              unitPrice: 249.75,
              imageUrl: '/chauffage.jpeg'
            },
            {
              id: 'item4',
              productId: 'prod4',
              productName: 'Thermostat intelligent',
              quantity: 1,
              unitPrice: 50.00,
              imageUrl: '/climatisation.jpeg'
            }
          ],
          shippingAddress: {
            fullName: 'Jean Dupont',
            streetAddress: '15 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          },
          billingAddress: {
            fullName: 'Jean Dupont',
            streetAddress: '15 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          }
        },
        {
          id: '3',
          orderNumber: 'CMD-2023-078',
          date: '2023-06-05T09:45:00Z',
          status: 'shipped',
          totalAmount: 1899.99,
          items: [
            {
              id: 'item5',
              productId: 'prod5',
              productName: 'Climatiseur réversible DAIKIN',
              quantity: 1,
              unitPrice: 1599.99,
              imageUrl: '/climatisation.jpeg'
            },
            {
              id: 'item6',
              productId: 'prod6',
              productName: 'Installation premium',
              quantity: 1,
              unitPrice: 300.00,
              imageUrl: '/chauffage.jpeg'
            }
          ],
          shippingAddress: {
            fullName: 'Marie Martin',
            streetAddress: '28 Avenue des Champs-Élysées',
            city: 'Paris',
            postalCode: '75008',
            country: 'France'
          },
          billingAddress: {
            fullName: 'Marie Martin',
            streetAddress: '28 Avenue des Champs-Élysées',
            city: 'Paris',
            postalCode: '75008',
            country: 'France'
          }
        },
        {
          id: '4',
          orderNumber: 'CMD-2023-096',
          date: '2023-07-12T16:20:00Z',
          status: 'delivered',
          totalAmount: 799.99,
          items: [
            {
              id: 'item7',
              productId: 'prod7',
              productName: 'Chauffe-eau thermodynamique',
              quantity: 1,
              unitPrice: 799.99,
              imageUrl: '/chauffage.jpeg'
            }
          ],
          shippingAddress: {
            fullName: 'Pierre Dubois',
            streetAddress: '45 Rue du Commerce',
            city: 'Lyon',
            postalCode: '69002',
            country: 'France'
          },
          billingAddress: {
            fullName: 'Pierre Dubois',
            streetAddress: '45 Rue du Commerce',
            city: 'Lyon',
            postalCode: '69002',
            country: 'France'
          }
        },
        {
          id: '5',
          orderNumber: 'CMD-2023-125',
          date: '2023-08-28T11:05:00Z',
          status: 'processing',
          totalAmount: 2499.99,
          items: [
            {
              id: 'item8',
              productId: 'prod8',
              productName: 'Pompe à chaleur Air/Eau',
              quantity: 1,
              unitPrice: 2199.99,
              imageUrl: '/chauffage.jpeg'
            },
            {
              id: 'item9',
              productId: 'prod9',
              productName: 'Kit de raccordement premium',
              quantity: 1,
              unitPrice: 300.00,
              imageUrl: '/climatisation.jpeg'
            }
          ],
          shippingAddress: {
            fullName: 'Sophie Bernard',
            streetAddress: '12 Boulevard Victor Hugo',
            city: 'Nice',
            postalCode: '06000',
            country: 'France'
          },
          billingAddress: {
            fullName: 'Sophie Bernard',
            streetAddress: '12 Boulevard Victor Hugo',
            city: 'Nice',
            postalCode: '06000',
            country: 'France'
          }
        },
        {
          id: '6',
          orderNumber: 'CMD-2023-156',
          date: '2023-09-15T14:30:00Z',
          status: 'cancelled',
          totalAmount: 349.99,
          items: [
            {
              id: 'item10',
              productId: 'prod10',
              productName: 'Radiateur électrique intelligent',
              quantity: 1,
              unitPrice: 349.99,
              imageUrl: '/chauffage.jpeg'
            }
          ],
          shippingAddress: {
            fullName: 'Lucas Petit',
            streetAddress: '8 Rue de la République',
            city: 'Marseille',
            postalCode: '13001',
            country: 'France'
          },
          billingAddress: {
            fullName: 'Lucas Petit',
            streetAddress: '8 Rue de la République',
            city: 'Marseille',
            postalCode: '13001',
            country: 'France'
          }
        },
        {
          id: '7',
          orderNumber: 'CMD-2023-189',
          date: '2023-10-02T09:15:00Z',
          status: 'shipped',
          totalAmount: 1799.99,
          items: [
            {
              id: 'item11',
              productId: 'prod11',
              productName: 'Climatiseur mobile DELONGHI',
              quantity: 2,
              unitPrice: 899.99,
              imageUrl: '/climatisation.jpeg'
            }
          ],
          shippingAddress: {
            fullName: 'Emma Roux',
            streetAddress: '25 Avenue Jean Jaurès',
            city: 'Toulouse',
            postalCode: '31000',
            country: 'France'
          },
          billingAddress: {
            fullName: 'Emma Roux',
            streetAddress: '25 Avenue Jean Jaurès',
            city: 'Toulouse',
            postalCode: '31000',
            country: 'France'
          }
        },
        {
          id: '8',
          orderNumber: 'CMD-2023-201',
          date: '2023-10-20T15:45:00Z',
          status: 'processing',
          totalAmount: 3299.99,
          items: [
            {
              id: 'item12',
              productId: 'prod12',
              productName: 'Système de climatisation complet',
              quantity: 1,
              unitPrice: 2799.99,
              imageUrl: '/climatisation.jpeg'
            },
            {
              id: 'item13',
              productId: 'prod13',
              productName: 'Installation et mise en service',
              quantity: 1,
              unitPrice: 500.00,
              imageUrl: '/chauffage.jpeg'
            }
          ],
          shippingAddress: {
            fullName: 'Thomas Moreau',
            streetAddress: '56 Rue Nationale',
            city: 'Bordeaux',
            postalCode: '33000',
            country: 'France'
          },
          billingAddress: {
            fullName: 'Thomas Moreau',
            streetAddress: '56 Rue Nationale',
            city: 'Bordeaux',
            postalCode: '33000',
            country: 'France'
          }
        }
      ];

      setOrders(mockOrders);
      setLoading(false);
    }, 1000); // Délai d'une seconde pour simuler le chargement
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
  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return { label: 'En cours', color: 'text-blue-500' };
      case 'shipped':
        return { label: 'Expédiée', color: 'text-indigo-500' };
      case 'delivered':
        return { label: 'Livrée', color: 'text-green-500' };
      case 'cancelled':
        return { label: 'Annulée', color: 'text-red-500' };
      default:
        return { label: 'Inconnu', color: 'text-gray-500' };
    }
  };

  // Afficher le détail d'une commande
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  // Filtrer les commandes en fonction de la recherche et du statut
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaShoppingBag className="mr-3 text-[#007FFF]" />
              Mes Commandes
            </h1>
          </div>

          {/* Filtres */}
          {!selectedOrder && !loading && orders.length > 0 && (
            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une commande..."
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
                  <option value="delivered">Livrée</option>
                  <option value="processing">En cours</option>
                  <option value="shipped">Expédiée</option>
                  <option value="cancelled">Annulée</option>
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
                <FaInfoCircle className="mr-2" />
                {error}
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center shadow-sm">
              <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
              <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande.</p>
              <button
                onClick={() => navigate('/nos-produits')}
                className="px-4 py-2 bg-[#007FFF] text-white rounded-md hover:bg-[#7CB9E8] transition-colors"
              >
                Parcourir nos produits
              </button>
            </div>
          ) : (
            // Liste des commandes en cartes
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 px-4 sm:px-6 lg:px-8">
              {filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  className="relative overflow-hidden border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:scale-[1.02] group"
                >
                  {/* Bande de statut colorée en haut */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    order.status === 'delivered' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                    order.status === 'processing' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                    order.status === 'shipped' ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' :
                    order.status === 'cancelled' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                    'bg-gradient-to-r from-gray-300 to-gray-400'
                  }`}></div>
                  
                  <div className="p-5 space-y-4">
                    {/* En-tête avec numéro et statut */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <h3 className="text-base font-bold text-gray-800 group-hover:text-[#007FFF] transition-colors">
                          Commande #{order.orderNumber}
                        </h3>
                        <div className="flex items-center mt-1 text-gray-500">
                          <FaRegCalendarAlt className="mr-1 text-[#007FFF] text-xs" />
                          <span className="text-xs">{formatDate(order.date)}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                        order.status === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        order.status === 'shipped' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          order.status === 'delivered' ? 'bg-green-500' :
                          order.status === 'processing' ? 'bg-blue-500' :
                          order.status === 'shipped' ? 'bg-indigo-500' :
                          order.status === 'cancelled' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}></span>
                        {getStatusInfo(order.status).label}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Informations sur les articles */}
                      <div className="flex items-center justify-between rounded-lg p-3 bg-gray-50/80 backdrop-blur-sm">
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-md bg-[#007FFF]/10 mr-2">
                            <FaShoppingBag className="text-[#007FFF] text-xs" />
                          </div>
                          <span className="text-xs font-medium text-gray-600">Articles</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{order.items.length}</span>
                      </div>

                      {/* Prix total */}
                      <div className="flex items-center justify-between p-3 bg-[#007FFF]/5 rounded-lg">
                        <span className="text-xs font-medium text-gray-600">Total</span>
                        <div className="flex items-center text-sm font-bold text-gray-800">
                          <span className="text-[#007FFF] mr-1 text-xs">€</span>
                          {order.totalAmount.toLocaleString('fr-FR', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="w-full bg-[#007FFF] text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#0066CC] transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow group-hover:shadow-md"
                      >
                        <FaEye className="mr-2 text-xs" />
                        Voir détail
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="group/btn relative w-full text-[#007FFF] border border-[#007FFF] rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#007FFF] hover:text-white transition-all duration-200 flex items-center justify-center overflow-hidden"
                        >
                          <div className="relative z-10 flex items-center justify-center">
                            <FaFileDownload className="mr-2 text-xs" />
                            Devis
                          </div>
                          <div className="absolute inset-0 bg-[#007FFF] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-200 z-0"></div>
                        </button>
                        <button
                          className="group/btn relative w-full text-[#007FFF] border border-[#007FFF] rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#007FFF] hover:text-white transition-all duration-200 flex items-center justify-center overflow-hidden"
                        >
                          <div className="relative z-10 flex items-center justify-center">
                            <FaFileInvoice className="mr-2 text-xs" />
                            Facture
                          </div>
                          <div className="absolute inset-0 bg-[#007FFF] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-200 z-0"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MesCommandes; 