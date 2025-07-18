import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FaFileInvoice, FaRegCalendarAlt, FaEuroSign, FaEye, FaFileDownload, FaSearch, FaChevronDown, FaFileAlt, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { quoteService, Quote as APIQuote } from '../services/quoteService';
import { useToast } from '../hooks/useToast';

// Interface pour les devis adaptée de l'API
interface Quote {
  id: number;
  quoteNumber: string;
  date: string;
  status: 'SENDED' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
  totalAmount: number;
  items: QuoteItem[];
  fileUrl?: string;
  commercial?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface QuoteItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

const MesDevis: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; quoteId: number | null }>({ 
    show: false, 
    quoteId: null 
  });
  
  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/connexion');
    }
  }, [isAuthenticated, navigate]);
  
  // Charger les devis depuis l'API
  useEffect(() => {
    const loadQuotes = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError('');
      
      try {
        const params = {
          page: currentPage,
          limit: 10,
          ...(selectedStatus !== 'all' && { status: selectedStatus as any }),
          ...(searchQuery && { s: searchQuery })
        };
        
        const response = await quoteService.getQuotesByClient(Number(user.id), params);
        
        // Transformer les données de l'API au format attendu par le composant
        const transformedQuotes: Quote[] = response.devis.map(apiQuote => ({
          id: apiQuote.id,
          quoteNumber: `DEV-${apiQuote.id.toString().padStart(6, '0')}`,
          date: apiQuote.createdAt,
          status: mapApiStatus(apiQuote.status),
          totalAmount: calculateTotalAmount(apiQuote.cart),
          fileUrl: apiQuote.fileUrl,
          commercial: apiQuote.commercial?.user ? {
            firstName: apiQuote.commercial.user.firstName,
            lastName: apiQuote.commercial.user.lastName,
            email: apiQuote.commercial.user.email
          } : undefined,
          items: apiQuote.cart.cartItems.map(item => ({
            id: item.id,
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.isInPromotion && item.product.promotionPrice 
              ? item.product.promotionPrice 
              : item.product.price,
            imageUrl: '/image-produit-defaut.jpeg' // Utiliser une image par défaut
          }))
        }));
        
        setQuotes(transformedQuotes);
        setTotalPages(response.meta.lastPage);
        setTotalQuotes(response.meta.total);
      } catch (err: any) {
        console.error('Erreur lors du chargement des devis:', err);
        setError(err.message || 'Impossible de charger vos devis');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuotes();
  }, [user?.id, currentPage, selectedStatus, searchQuery]);
  
  // Fonction pour mapper les statuts de l'API vers ceux de l'interface
  const mapApiStatus = (apiStatus: string): Quote['status'] => {
    const statusMap: Record<string, Quote['status']> = {
      'SENDED': 'SENDED',
      'CONSULTED': 'SENDED', // Map CONSULTED to SENDED
      'PROGRESS': 'PENDING', // Map PROGRESS to PENDING
      'EXPIRED': 'REJECTED', // Map EXPIRED to REJECTED
      'PENDING': 'PENDING',
      'ACCEPTED': 'ACCEPTED',
      'REJECTED': 'REJECTED'
    };
    return statusMap[apiStatus] || 'SENDED';
  };
  
  // Calculer le montant total du panier
  const calculateTotalAmount = (cart: any): number => {
    return cart.cartItems.reduce((total: number, item: any) => {
      const price = item.product.isInPromotion && item.product.promotionPrice 
        ? item.product.promotionPrice 
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

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
      case 'SENDED':
        return { label: 'Envoyé', color: 'bg-blue-100 text-blue-700' };
      case 'PENDING':
        return { label: 'En cours', color: 'bg-yellow-100 text-yellow-700' };
      case 'ACCEPTED':
        return { label: 'Accepté', color: 'bg-green-100 text-green-700' };
      case 'REJECTED':
        return { label: 'Refusé', color: 'bg-red-100 text-red-700' };
      default:
        return { label: 'Inconnu', color: 'bg-gray-100 text-gray-700' };
    }
  };

  // Gérer l'acceptation d'un devis
  const handleAcceptQuote = async (quoteId: number) => {
    try {
      await quoteService.updateQuoteStatus(quoteId, 'ACCEPTED');
      showToast('Devis accepté avec succès', 'success');
      // Recharger les devis
      setSelectedQuote(null);
      setCurrentPage(1);
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de l\'acceptation du devis', 'error');
    }
  };

  // Gérer le refus d'un devis
  const handleRejectQuote = async (quoteId: number) => {
    try {
      await quoteService.updateQuoteStatus(quoteId, 'REJECTED');
      showToast('Devis refusé', 'success');
      // Recharger les devis
      setSelectedQuote(null);
      setCurrentPage(1);
    } catch (error: any) {
      showToast(error.message || 'Erreur lors du refus du devis', 'error');
    }
  };

  // Gérer la suppression d'un devis
  const handleDeleteQuote = async (quoteId: number) => {
    try {
      await quoteService.deleteQuote(quoteId);
      showToast('Devis supprimé avec succès', 'success');
      
      // Fermer la modal de confirmation
      setDeleteConfirmation({ show: false, quoteId: null });
      
      // Si on était en train de voir le détail du devis supprimé, revenir à la liste
      if (selectedQuote?.id === quoteId) {
        setSelectedQuote(null);
      }
      
      // Recharger les devis
      const loadQuotes = async () => {
        if (!user?.id) return;
        
        try {
          const params = {
            page: currentPage,
            limit: 10,
            ...(selectedStatus !== 'all' && { status: selectedStatus as any }),
            ...(searchQuery && { s: searchQuery })
          };
          
          const response = await quoteService.getQuotesByClient(Number(user.id), params);
          
          // Transformer les données
          const transformedQuotes: Quote[] = response.devis.map(apiQuote => ({
            id: apiQuote.id,
            quoteNumber: `DEV-${apiQuote.id.toString().padStart(6, '0')}`,
            date: apiQuote.createdAt,
            status: mapApiStatus(apiQuote.status),
            totalAmount: calculateTotalAmount(apiQuote.cart),
            fileUrl: apiQuote.fileUrl,
            commercial: apiQuote.commercial?.user ? {
              firstName: apiQuote.commercial.user.firstName,
              lastName: apiQuote.commercial.user.lastName,
              email: apiQuote.commercial.user.email
            } : undefined,
            items: apiQuote.cart.cartItems.map(item => ({
              id: item.id,
              productId: item.product.id,
              productName: item.product.name,
              quantity: item.quantity,
              unitPrice: item.product.isInPromotion && item.product.promotionPrice 
                ? item.product.promotionPrice 
                : item.product.price,
              imageUrl: '/image-produit-defaut.jpeg'
            }))
          }));
          
          setQuotes(transformedQuotes);
          setTotalPages(response.meta.lastPage);
          setTotalQuotes(response.meta.total);
        } catch (err: any) {
          console.error('Erreur lors du rechargement des devis:', err);
        }
      };
      
      loadQuotes();
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la suppression du devis', 'error');
    }
  };

  // Télécharger un devis
  const handleDownloadQuote = async (quote: Quote) => {
    try {
      if (quote.fileUrl) {
        // Si on a une URL directe, l'ouvrir
        window.open(quote.fileUrl, '_blank');
      } else {
        // Sinon, utiliser l'endpoint de téléchargement
        const blob = await quoteService.downloadQuotePDF(quote.id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devis-${quote.quoteNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      showToast(error.message || 'Erreur lors du téléchargement du devis', 'error');
    }
  };

  // Filtrer les devis
  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus;
    return matchesStatus;
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
                  <option value="SENDED">Envoyé</option>
                  <option value="PENDING">En cours</option>
                  <option value="ACCEPTED">Accepté</option>
                  <option value="REJECTED">Refusé</option>
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
                    {(selectedQuote.status === 'SENDED' || selectedQuote.status === 'PENDING') && (
                      <>
                        <button 
                          onClick={() => handleAcceptQuote(selectedQuote.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center"
                        >
                          Accepter le devis
                        </button>
                        <button 
                          onClick={() => handleRejectQuote(selectedQuote.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center"
                        >
                          Refuser le devis
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleDownloadQuote(selectedQuote)}
                      className="px-4 py-2 bg-[#007FFF] text-white rounded-xl hover:bg-[#7CB9E8] transition-colors flex items-center justify-center"
                    >
                      <FaFileDownload className="mr-2" />
                      Télécharger le devis
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmation({ show: true, quoteId: selectedQuote.id })}
                      className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center justify-center"
                    >
                      <FaTrash className="mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Liste des devis en cartes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 px-4 sm:px-6 lg:px-8">
                    {filteredQuotes.map(quote => (
                    <div 
                      key={quote.id} 
                      className="relative overflow-hidden border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:scale-[1.02] group"
                    >
                      {/* Bande de statut colorée en haut */}
                      <div className={`absolute top-0 left-0 right-0 h-1 ${
                        quote.status === 'ACCEPTED' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        quote.status === 'SENDED' ? 'bg-gradient-to-r from-blue-300 to-blue-400' :
                        quote.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-300 to-yellow-400' :
                        quote.status === 'REJECTED' ? 'bg-gradient-to-r from-red-400 to-red-500' :
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
                            quote.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border border-green-200' :
                            quote.status === 'SENDED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            quote.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            quote.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              quote.status === 'ACCEPTED' ? 'bg-green-500' :
                              quote.status === 'SENDED' ? 'bg-blue-500' :
                              quote.status === 'PENDING' ? 'bg-yellow-500' :
                              quote.status === 'REJECTED' ? 'bg-red-500' :
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
                          
                          <div className={`grid ${(quote.status === 'SENDED' || quote.status === 'PENDING') ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                            {(quote.status === 'SENDED' || quote.status === 'PENDING') ? (
                              <>
                                <button
                                  onClick={() => handleAcceptQuote(quote.id)}
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
                                  onClick={() => handleRejectQuote(quote.id)}
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
                                onClick={() => handleDownloadQuote(quote)}
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
                          
                          {(quote.status === 'SENDED' || quote.status === 'PENDING') && (
                            <button
                              onClick={() => handleDownloadQuote(quote)}
                              className="group/btn relative w-full text-[#007FFF] border border-[#007FFF] rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#007FFF] hover:text-white transition-all duration-200 flex items-center justify-center overflow-hidden"
                            >
                              <div className="relative z-10 flex items-center justify-center">
                                <FaFileDownload className="mr-2 text-xs" />
                                Télécharger
                              </div>
                              <div className="absolute inset-0 bg-[#007FFF] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-200 z-0"></div>
                            </button>
                          )}
                          
                          {/* Bouton de suppression */}
                          <button
                            onClick={() => setDeleteConfirmation({ show: true, quoteId: quote.id })}
                            className="group/btn relative w-full text-gray-600 border border-gray-500 rounded-lg py-2 px-4 text-sm font-medium hover:bg-gray-500 hover:text-white transition-all duration-200 flex items-center justify-center overflow-hidden"
                          >
                            <div className="relative z-10 flex items-center justify-center">
                              <FaTrash className="mr-2 text-xs" />
                              Supprimer
                            </div>
                            <div className="absolute inset-0 bg-gray-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-200 z-0"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        Précédent
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-3 py-1 rounded-lg ${
                                currentPage === pageNumber
                                  ? 'bg-[#007FFF] text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de confirmation de suppression */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaTrash className="text-red-600 text-lg" />
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                Confirmer la suppression
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation({ show: false, quoteId: null })}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmation.quoteId) {
                    handleDeleteQuote(deleteConfirmation.quoteId);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <FaTrash className="mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MesDevis; 