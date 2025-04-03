import React, { useState } from 'react';
import { FaCreditCard, FaLock, FaApplePay, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

const ConfirmationStep: React.FC = () => {
  const { cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [saveCard, setSaveCard] = useState<boolean>(false);
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo({
      ...cardInfo,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Traitement du paiement
    alert('Paiement traité avec succès !');
  };

  const totalTTC = cart.reduce((sum, item) => sum + (item.price || item.priceTTC) * item.quantity, 0);
  const livraison = 6.90;
  const totalWithShipping = totalTTC + livraison;

  // Calcul du prix HT (Prix TTC / 1.2 pour une TVA à 20%)
  const totalHT = totalTTC / 1.2;
  const TVA = totalTTC - totalHT;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="mb-5 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-4">Récapitulatif de la commande</h3>
        
        <div className="border-t border-b border-gray-200 py-3 sm:py-4 mb-4">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-3 sm:mb-4 text-sm sm:text-base">
              <div className="flex-1">
                <span className="font-medium">{item.quantity}x</span> {item.name}
              </div>
              <div className="text-right font-medium">
                {(item.price || item.priceTTC).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-gray-600">Sous-total HT:</span>
            <span>{totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">TVA (20%):</span>
            <span>{TVA.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Livraison:</span>
            <span>{livraison.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
          </div>
          <div className="flex justify-between font-bold text-base sm:text-lg pt-2 sm:pt-3 border-t border-gray-200">
            <span>Total:</span>
            <span>{totalWithShipping.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-5 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-4">Méthode de paiement</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
          <button
            type="button"
            className={`flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4 border rounded-md ${
              paymentMethod === 'card' 
                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                : 'border-gray-300 text-gray-700 hover:border-blue-300'
            }`}
            onClick={() => handlePaymentMethodChange('card')}
          >
            <FaCreditCard className="mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Carte bancaire</span>
          </button>
          
          <button
            type="button"
            className={`flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4 border rounded-md ${
              paymentMethod === 'virement' 
                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                : 'border-gray-300 text-gray-700 hover:border-blue-300'
            }`}
            onClick={() => handlePaymentMethodChange('virement')}
          >
            <FaUniversity className="mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Virement</span>
          </button>
          
          <button
            type="button"
            className={`flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4 border rounded-md ${
              paymentMethod === 'acompte' 
                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                : 'border-gray-300 text-gray-700 hover:border-blue-300'
            }`}
            onClick={() => handlePaymentMethodChange('acompte')}
          >
            <FaMoneyBillWave className="mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Acompte</span>
          </button>
          
          <button
            type="button"
            className={`flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4 border rounded-md ${
              paymentMethod === 'applepay' 
                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                : 'border-gray-300 text-gray-700 hover:border-blue-300'
            }`}
            onClick={() => handlePaymentMethodChange('applepay')}
          >
            <FaApplePay className="mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Apple Pay</span>
          </button>
        </div>
        
        {paymentMethod === 'card' && (
          <form className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de carte
              </label>
              <input
                type="text"
                id="cardNumber"
                name="number"
                placeholder="1234 5678 9012 3456"
                value={cardInfo.number}
                onChange={handleCardInfoChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom sur la carte
              </label>
              <input
                type="text"
                id="cardName"
                name="name"
                placeholder="John Doe"
                value={cardInfo.name}
                onChange={handleCardInfoChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'expiration
                </label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="expiry"
                  placeholder="MM/AA"
                  value={cardInfo.expiry}
                  onChange={handleCardInfoChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  id="cardCVC"
                  name="cvc"
                  placeholder="123"
                  value={cardInfo.cvc}
                  onChange={handleCardInfoChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="saveCard"
                type="checkbox"
                checked={saveCard}
                onChange={() => setSaveCard(!saveCard)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                Enregistrer cette carte pour mes prochains achats
              </label>
            </div>
          </form>
        )}
        
        {paymentMethod === 'virement' && (
          <div className="mt-3 p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Informations pour le virement bancaire</h4>
            <p className="text-sm text-blue-700 mb-3">Veuillez effectuer votre virement aux coordonnées suivantes:</p>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-blue-800 font-medium">IBAN:</span>
                <span className="col-span-2">FR76 1234 5678 9012 3456 7890 123</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-blue-800 font-medium">BIC:</span>
                <span className="col-span-2">ABCDEFGHIJK</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-blue-800 font-medium">Titulaire:</span>
                <span className="col-span-2">DISTRITHERM SAS</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-blue-800 font-medium">Banque:</span>
                <span className="col-span-2">Crédit Mutuel</span>
              </div>
              <p className="mt-2 font-medium">Référence à indiquer: Votre nom + numéro de commande</p>
            </div>
          </div>
        )}
        
        {paymentMethod === 'acompte' && (
          <div className="mt-3 p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Paiement par acompte</h4>
            <p className="text-sm text-blue-700 mb-3">Versez 30% maintenant et le reste à la livraison:</p>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-blue-800 font-medium">Acompte (30%):</span>
                <span className="col-span-2 font-medium">{(totalWithShipping * 0.3).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-blue-800 font-medium">Solde à régler:</span>
                <span className="col-span-2">{(totalWithShipping * 0.7).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <p className="mt-2">Vous serez contacté par notre service client pour finaliser les modalités de paiement du solde.</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-5 sm:mb-6">
        <div className="flex items-center mb-4">
          <input
            id="termsAccepted"
            type="checkbox"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
            J'accepte les <a href="#" className="text-blue-600 hover:underline">conditions générales de vente</a>
          </label>
        </div>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!termsAccepted}
          className={`w-full flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium rounded-md ${
            termsAccepted
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FaLock className="mr-2" />
          Confirmer et payer
        </button>
        
        <p className="mt-3 text-xs sm:text-sm text-gray-500 text-center">
          Vos informations de paiement sont sécurisées. Nous n'enregistrons pas les détails de votre carte.
        </p>
      </div>
    </div>
  );
};

export default ConfirmationStep; 