import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingBag, FaCalendarAlt, FaEuroSign, FaCircle, FaInfoCircle, FaDownload, FaRegCalendarAlt, FaEye, FaFileDownload, FaFileInvoice, FaChevronDown, FaSearch as FaSearchIcon, FaSearch } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';
import { getAllOrders, getOrderById } from '../services/orderService';
import { Order, OrderStatus } from '../types/order';
import { toast } from 'react-hot-toast';

// Interface pour les détails d'affichage des commandes
interface OrderDisplayItem {
  id: number;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  totalAmount: number;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    imageUrl?: string;
  }[];
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
  factureFileUrl: string;
}

const MesCommandes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDisplayItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    limit: 5,
    lastPage: 1
  });

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/connexion');
    }
  }, [isAuthenticated, navigate]);

  // Fonction pour charger les commandes depuis l'API
  const fetchOrdersPage = useCallback(async (page: number, limit: number) => {
    if (!isAuthenticated) {
      console.error('Utilisateur non authentifié - Redirection vers la page de connexion');
      toast.error('Vous devez être connecté pour accéder à vos commandes');
      navigate('/connexion');
      return;
    }
    
    try {
      console.log(`Chargement des commandes - page ${page}, limit ${limit}`);
      setLoading(true);
      setError(''); // Réinitialiser les erreurs précédentes
      
      const response = await getAllOrders(page, limit);
      console.log('Réponse API des commandes:', response);
      
      if (!response || !response.orders) {
        throw new Error('Format de réponse incorrect');
      }
      
      // Transformer les données pour l'affichage
      const formattedOrders: OrderDisplayItem[] = response.orders.map(order => ({
        id: order.id,
        orderNumber: `CMD-${String(order.id).padStart(3, '0')}`,
        date: order.createdAt,
        status: order.status,
        totalAmount: 0, // À calculer à partir des produits du panier si disponible
        items: [], // À remplir si les détails du panier sont disponibles
        shippingAddress: {
          fullName: "Adresse de livraison",
          streetAddress: "Détails non disponibles",
          city: "",
          postalCode: "",
          country: "France"
        },
        billingAddress: {
          fullName: "Adresse de facturation",
          streetAddress: "Détails non disponibles",
          city: "",
          postalCode: "",
          country: "France"
        },
        factureFileUrl: order.factureFileUrl
      }));
      
      setOrders(formattedOrders);
      
      // Mettre à jour les métadonnées de pagination
      const meta = {
        total: response.meta.total,
        page: response.meta.page,
        limit: response.meta.limit,
        lastPage: response.meta.lastPage
      };
      
      console.log('Métadonnées de pagination:', meta);
      setPaginationMeta(meta);
      setTotalPages(meta.lastPage);
      setCurrentPage(meta.page);
      setLoading(false);
    } catch (err: any) {
      console.error('Erreur de chargement des commandes:', err);
      
      // Message d'erreur personnalisé selon le type d'erreur
      let errorMessage = 'Une erreur est survenue lors du chargement des commandes';
      
      if (err.message === 'Vous devez être connecté pour accéder à vos commandes') {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        // Déconnexion et redirection
        setTimeout(() => {
          navigate('/connexion');
        }, 1500);
      } else if (err.response && err.response.status === 401) {
        errorMessage = 'Vous n\'êtes pas autorisé à accéder à ces informations';
      } else if (err.response && err.response.status === 403) {
        errorMessage = 'Accès refusé à cette ressource';
      } else if (err.response && err.response.status === 404) {
        errorMessage = 'Aucune commande trouvée';
      } else if (!navigator.onLine) {
        errorMessage = 'Vous êtes hors ligne. Vérifiez votre connexion internet.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  }, [isAuthenticated, navigate]);

  // Charger les commandes réelles depuis l'API
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrdersPage(currentPage, itemsPerPage);
    }
  }, [isAuthenticated, currentPage, itemsPerPage, fetchOrdersPage]);

  // Fonction pour récupérer les détails d'une commande
  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoading(true);
      const response = await getOrderById(orderId);
      const order = response.order;
      
      // Enrichir avec les détails manquants
      const detailedOrder: OrderDisplayItem = {
        id: order.id,
        orderNumber: `CMD-${String(order.id).padStart(3, '0')}`,
        date: order.createdAt,
        status: order.status,
        totalAmount: 0, // À calculer
        items: [], // À remplir si disponible
        shippingAddress: {
          fullName: "Adresse de livraison",
          streetAddress: "Détails non disponibles",
          city: "",
          postalCode: "",
          country: "France"
        },
        billingAddress: {
          fullName: "Adresse de facturation",
          streetAddress: "Détails non disponibles",
          city: "",
          postalCode: "",
          country: "France"
        },
        factureFileUrl: order.factureFileUrl
      };
      
      setSelectedOrder(detailedOrder);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du chargement des détails de la commande');
      toast.error('Impossible de charger les détails de la commande');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { color: string; label: string }> = {
      'PENDING': { color: 'bg-yellow-500', label: 'En attente' },
      'PROCESSING': { color: 'bg-blue-500', label: 'En traitement' },
      'SHIPPED': { color: 'bg-indigo-500', label: 'Expédiée' },
      'DELIVERED': { color: 'bg-green-500', label: 'Livrée' },
      'CANCELLED': { color: 'bg-red-500', label: 'Annulée' }
    };

    return statusMap[status] || { color: 'bg-gray-500', label: 'Statut inconnu' };
  };

  const handleViewOrder = (order: OrderDisplayItem) => {
    fetchOrderDetails(order.id);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Gestion de la pagination
  const handlePageChange = useCallback((page: number) => {
    console.log(`Changement de page: ${page}`);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [currentPage]);

  if (loading && orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Rechercher une commande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="PROCESSING">En traitement</option>
                <option value="SHIPPED">Expédiée</option>
                <option value="DELIVERED">Livrée</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl text-gray-300 mb-4">
              <FaShoppingBag className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Aucune commande trouvée</h3>
            <p className="text-gray-500">
              {searchQuery || selectedStatus !== 'all'
                ? "Aucune commande ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore passé de commande."}
            </p>
          </div>
        ) : (
          <>
            {/* Liste des commandes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Facture
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => {
                      const { color, label } = getStatusInfo(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} text-white`}>
                              {label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {order.factureFileUrl ? (
                              <a
                                href={order.factureFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-800 flex items-center justify-end"
                              >
                                <FaFileInvoice className="mr-1" />
                                Facture
                              </a>
                            ) : (
                              <span className="text-gray-400">Non disponible</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="text-teal-600 hover:text-teal-800 flex items-center justify-end"
                            >
                              <FaEye className="mr-1" />
                              Détails
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-md">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{filteredOrders.length}</span> commande(s) sur <span className="font-medium">{paginationMeta.total}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="sr-only">Précédent</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === currentPage
                            ? 'z-10 bg-teal-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="sr-only">Suivant</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal des détails de commande */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Détails de la commande</h2>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <FaShoppingBag className="mr-2 text-teal-600" />
                      Informations de commande
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Numéro de commande:</span>
                        <span className="ml-2">{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Date:</span>
                        <span className="ml-2">{formatDate(selectedOrder.date)}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Statut:</span>
                        <span className="ml-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.status).color} text-white`}>
                            {getStatusInfo(selectedOrder.status).label}
                          </span>
                        </span>
                      </div>
                      {selectedOrder.factureFileUrl && (
                        <div className="mt-4">
                          <a
                            href={selectedOrder.factureFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            <FaFileDownload className="mr-2" />
                            Télécharger la facture
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <FaRegCalendarAlt className="mr-2 text-teal-600" />
                      Adresses
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-1">Adresse de livraison:</h4>
                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.fullName}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.streetAddress}</p>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Adresse de facturation:</h4>
                        <p className="text-sm text-gray-600">{selectedOrder.billingAddress.fullName}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.billingAddress.streetAddress}</p>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.billingAddress.postalCode} {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FaShoppingBag className="mr-2 text-teal-600" />
                  Produits commandés
                </h3>
                
                {selectedOrder.items.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500">Détails des produits non disponibles</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produit
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prix unitaire
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantité
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {item.imageUrl && (
                                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                                    <img className="h-10 w-10 rounded-md object-cover" src={item.imageUrl} alt={item.productName} />
                                  </div>
                                )}
                                <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                              {item.unitPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {(item.unitPrice * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                            Total
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                            {selectedOrder.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MesCommandes; 