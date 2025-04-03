import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../services/axiosConfig';
import { FaShoppingBag, FaCalendarAlt, FaEuroSign, FaCircle, FaInfoCircle, FaDownload } from 'react-icons/fa';

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

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/connexion');
    }
  }, [isAuthenticated, navigate]);

  // Charger les commandes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/orders');
        setOrders(response.data);
      } catch (error: any) {
        console.error('Erreur lors du chargement des commandes:', error);
        setError('Impossible de charger vos commandes. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // Simuler des commandes pour l'interface
  useEffect(() => {
    // Commandes fictives pour la démonstration
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
            imageUrl: 'https://via.placeholder.com/50'
          },
          {
            id: 'item2',
            productId: 'prod2',
            productName: 'Kit installation standard',
            quantity: 1,
            unitPrice: 250.00,
            imageUrl: 'https://via.placeholder.com/50'
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
            imageUrl: 'https://via.placeholder.com/50'
          },
          {
            id: 'item4',
            productId: 'prod4',
            productName: 'Thermostat intelligent',
            quantity: 1,
            unitPrice: 50.00,
            imageUrl: 'https://via.placeholder.com/50'
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
      case 'pending':
        return { label: 'En attente', color: 'text-yellow-500' };
      case 'processing':
        return { label: 'En cours de traitement', color: 'text-blue-500' };
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FaShoppingBag className="mr-3 text-teal-600" />
            Mes Commandes
          </h1>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
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
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Parcourir nos produits
              </button>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {selectedOrder ? (
                // Détail de la commande sélectionnée
                <div className="p-6">
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Commande #{selectedOrder.orderNumber}
                    </h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-600 hover:text-teal-600"
                    >
                      Retour aux commandes
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Date de commande</h3>
                      <p className="flex items-center text-gray-800">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {formatDate(selectedOrder.date)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Statut</h3>
                      <p className={`flex items-center ${getStatusInfo(selectedOrder.status).color}`}>
                        <FaCircle className="mr-2 h-2 w-2" />
                        {getStatusInfo(selectedOrder.status).label}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Articles</h3>
                  <div className="bg-gray-50 rounded-md overflow-hidden mb-6">
                    <div className="border-b border-gray-200 bg-gray-100 py-3 px-4 grid grid-cols-12 gap-2 text-sm text-gray-500">
                      <div className="col-span-6">Produit</div>
                      <div className="col-span-2 text-center">Prix unitaire</div>
                      <div className="col-span-2 text-center">Quantité</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                    
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="py-4 px-4 border-b border-gray-100 grid grid-cols-12 gap-2 items-center">
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
                    ))}
                    
                    <div className="py-4 px-4 grid grid-cols-12 gap-2 items-center bg-gray-50">
                      <div className="col-span-10 text-right font-bold text-gray-800">Total</div>
                      <div className="col-span-2 text-right font-bold text-gray-800">
                        {selectedOrder.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Adresse de livraison</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
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
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="font-medium text-gray-800">{selectedOrder.billingAddress.fullName}</p>
                        <p className="text-gray-600">{selectedOrder.billingAddress.streetAddress}</p>
                        <p className="text-gray-600">
                          {selectedOrder.billingAddress.postalCode} {selectedOrder.billingAddress.city}
                        </p>
                        <p className="text-gray-600">{selectedOrder.billingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center">
                      <FaDownload className="mr-2" />
                      Télécharger la facture
                    </button>
                  </div>
                </div>
              ) : (
                // Liste des commandes
                <div>
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commande
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center ${getStatusInfo(order.status).color}`}>
                              <FaCircle className="mr-1.5 h-2 w-2" />
                              {getStatusInfo(order.status).label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              Voir détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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