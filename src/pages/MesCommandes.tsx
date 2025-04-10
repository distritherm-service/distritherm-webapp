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
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {selectedOrder ? (
                // Détail de la commande sélectionnée
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">
                      Commande #{selectedOrder.orderNumber}
                    </h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-600 hover:text-[#007FFF] inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Retour aux commandes
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Date de commande</h3>
                      <p className="flex items-center text-gray-800">
                        <FaCalendarAlt className="mr-2 text-[#007FFF]" />
                        {formatDate(selectedOrder.date)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Statut</h3>
                      <p className={`flex items-center ${getStatusInfo(selectedOrder.status).color}`}>
                        <FaCircle className="mr-2 h-2 w-2" />
                        {getStatusInfo(selectedOrder.status).label}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Articles</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
                    {/* En-tête de la liste des articles - visible uniquement sur desktop */}
                    <div className="hidden md:grid grid-cols-12 gap-2 bg-gray-100 p-4 text-sm text-gray-500">
                      <div className="col-span-6">Produit</div>
                      <div className="col-span-2 text-center">Prix unitaire</div>
                      <div className="col-span-2 text-center">Quantité</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                    
                    {/* Liste des articles */}
                    <div className="divide-y divide-gray-200">
                      {selectedOrder.items.map(item => (
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
                          {selectedOrder.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Adresse de livraison</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">{selectedOrder.shippingAddress.fullName}</p>
                        <p className="text-gray-600">{selectedOrder.shippingAddress.streetAddress}</p>
                        <p className="text-gray-600">
                          {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}
                        </p>
                        <p className="text-gray-600">{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Adresse de facturation</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">{selectedOrder.billingAddress.fullName}</p>
                        <p className="text-gray-600">{selectedOrder.billingAddress.streetAddress}</p>
                        <p className="text-gray-600">
                          {selectedOrder.billingAddress.postalCode} {selectedOrder.billingAddress.city}
                        </p>
                        <p className="text-gray-600">{selectedOrder.billingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:justify-end space-y-3 md:space-y-0 md:space-x-4">
                    <button className="px-4 py-2 bg-[#007FFF] text-white rounded-md hover:bg-[#7CB9E8] transition-colors flex items-center justify-center">
                      <FaDownload className="mr-2" />
                      Télécharger le devis
                    </button>
                    <button className="px-4 py-2 bg-[#007FFF] text-white rounded-md hover:bg-[#7CB9E8] transition-colors flex items-center justify-center">
                      <FaDownload className="mr-2" />
                      Télécharger la facture
                    </button>
                  </div>
                </div>
              ) : (
                // Liste des commandes en cartes
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="space-y-4">
                        {/* En-tête avec numéro et statut */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              Commande #{order.orderNumber}
                            </h3>
                            <div className="flex items-center mt-2 text-gray-600">
                              <FaRegCalendarAlt className="mr-2" />
                              <span className="text-sm">{formatDate(order.date)}</span>
                            </div>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {getStatusInfo(order.status).label}
                          </span>
                        </div>

                        {/* Informations sur les articles */}
                        <div className="flex items-center text-gray-600 bg-white/80 rounded-xl p-4">
                          <FaShoppingBag className="text-[#007FFF] mr-3" />
                          <span>Nombre d'articles : {order.items.length}</span>
                        </div>

                        {/* Prix total */}
                        <div className="flex items-center text-2xl font-bold text-gray-900">
                          <span className="text-[#007FFF] mr-2">€</span>
                          {order.totalAmount.toLocaleString('fr-FR', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>

                        {/* Boutons d'action */}
                        <div className="grid grid-cols-1 gap-3 pt-4">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="w-full bg-[#007FFF] text-white rounded-xl py-3 px-4 font-medium hover:bg-[#7CB9E8] transition-colors duration-200 flex items-center justify-center"
                          >
                            <FaEye className="mr-2" />
                            Voir détail
                          </button>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              className="w-full bg-white text-[#007FFF] border-2 border-[#007FFF] rounded-xl py-2.5 px-4 font-medium hover:bg-[#007FFF] hover:text-white transition-all duration-200 flex items-center justify-center"
                            >
                              <FaFileDownload className="mr-2" />
                              Devis
                            </button>
                            <button
                              className="w-full bg-white text-[#007FFF] border-2 border-[#007FFF] rounded-xl py-2.5 px-4 font-medium hover:bg-[#007FFF] hover:text-white transition-all duration-200 flex items-center justify-center"
                            >
                              <FaFileInvoice className="mr-2" />
                              Facture
                            </button>
                          </div>
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

export default MesCommandes; 