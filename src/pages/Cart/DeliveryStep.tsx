import React, { useState } from 'react';
import { FaTruck, FaClock, FaShippingFast, FaMapMarkerAlt } from 'react-icons/fa';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
  icon: React.ReactNode;
}

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

const DeliveryStep: React.FC = () => {
  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'standard',
      name: 'Livraison standard',
      description: 'Livraison à domicile par transporteur',
      price: 6.9,
      estimatedDelivery: '3 à 5 jours ouvrés',
      icon: <FaTruck className="text-blue-600 h-5 w-5" />
    },
    {
      id: 'express',
      name: 'Livraison express',
      description: 'Livraison le lendemain avant 13h',
      price: 12.9,
      estimatedDelivery: '1 jour ouvré',
      icon: <FaShippingFast className="text-blue-600 h-5 w-5" />
    },
    {
      id: 'pickup',
      name: 'Retrait en magasin',
      description: 'Gratuit, retirez votre commande en magasin',
      price: 0,
      estimatedDelivery: 'Dès que disponible',
      icon: <FaClock className="text-blue-600 h-5 w-5" />
    }
  ];

  const [selectedDelivery, setSelectedDelivery] = useState<string>('standard');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: ''
  });
  const [saveAddress, setSaveAddress] = useState(false);

  const handleDeliveryChange = (deliveryId: string) => {
    setSelectedDelivery(deliveryId);
  };

  const handleStoreChange = (store: string) => {
    setSelectedStore(store);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const getFormattedPrice = (price: number) => {
    return price.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
  };

  const isDeliveryToAddress = selectedDelivery === 'standard' || selectedDelivery === 'express';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Choisissez votre mode de livraison</h3>

        <div className="space-y-4">
          {deliveryOptions.map((option) => (
            <div 
              key={option.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedDelivery === option.id 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleDeliveryChange(option.id)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id={`delivery-${option.id}`}
                  name="delivery-option"
                  value={option.id}
                  checked={selectedDelivery === option.id}
                  onChange={() => handleDeliveryChange(option.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <label htmlFor={`delivery-${option.id}`} className="font-medium text-gray-900 flex items-center">
                      <span className="mr-2">{option.icon}</span>
                      {option.name}
                    </label>
                    <span className="font-medium text-gray-900">
                      {option.price === 0 ? 'Gratuit' : getFormattedPrice(option.price)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{option.description}</p>
                  <p className="text-gray-700 text-sm mt-1">
                    <span className="font-medium">Délai estimé :</span> {option.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Adresse de livraison ou choix du magasin */}
        <div className="mt-8">
          {isDeliveryToAddress ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse de livraison</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={address.firstName}
                      onChange={handleAddressChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={address.lastName}
                      onChange={handleAddressChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={address.address}
                    onChange={handleAddressChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleAddressChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="save-address"
                    type="checkbox"
                    checked={saveAddress}
                    onChange={() => setSaveAddress(!saveAddress)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="save-address" className="ml-2 block text-sm text-gray-700">
                    Sauvegarder cette adresse pour mes prochaines commandes
                  </label>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choisissez votre magasin</h3>
              
              <div className="space-y-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedStore === 'taverny' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleStoreChange('taverny')}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      id="store-taverny"
                      name="store-option"
                      value="taverny"
                      checked={selectedStore === 'taverny'}
                      onChange={() => handleStoreChange('taverny')}
                      className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <label htmlFor="store-taverny" className="font-medium text-gray-900 flex items-center cursor-pointer">
                        <FaMapMarkerAlt className="text-blue-600 h-4 w-4 mr-2" />
                        Distritherm Taverny
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        145 Rue d'Herblay, 95150 Taverny
                      </p>
                      <div className="mt-2 text-sm text-gray-800">
                        <p>
                          <span className="font-medium">Horaires :</span> Lun-Ven 8h-19h, Sam 9h-18h
                        </p>
                      </div>
                      <div className="mt-2">
                        <a
                          href="https://maps.google.com/?q=145+Rue+d'Herblay,+95150+Taverny"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          Voir l'itinéraire
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedStore === 'drancy' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleStoreChange('drancy')}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      id="store-drancy"
                      name="store-option"
                      value="drancy"
                      checked={selectedStore === 'drancy'}
                      onChange={() => handleStoreChange('drancy')}
                      className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <label htmlFor="store-drancy" className="font-medium text-gray-900 flex items-center cursor-pointer">
                        <FaMapMarkerAlt className="text-blue-600 h-4 w-4 mr-2" />
                        Distritherm Drancy
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        12 Rue Charles Gide, 93700 Drancy
                      </p>
                      <div className="mt-2 text-sm text-gray-800">
                        <p>
                          <span className="font-medium">Horaires :</span> Lun-Ven 8h-19h, Sam 9h-18h
                        </p>
                      </div>
                      <div className="mt-2">
                        <a
                          href="https://maps.google.com/?q=12+Rue+Charles+Gide,+93700+Drancy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          Voir l'itinéraire
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Informations importantes</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            {isDeliveryToAddress ? (
              <>
                <li>Les délais de livraison sont donnés à titre indicatif.</li>
                <li>La livraison s'effectue du lundi au vendredi, hors jours fériés.</li>
                <li>Un email de confirmation vous sera envoyé lorsque votre commande sera expédiée.</li>
                <li>Pour la livraison express, nous vous contacterons par téléphone pour confirmer.</li>
              </>
            ) : (
              <>
                <li>Votre commande sera disponible en magasin sous 24 à 48h.</li>
                <li>Un email vous sera envoyé dès que votre commande sera prête.</li>
                <li>Merci de vous munir d'une pièce d'identité pour le retrait.</li>
                <li>Votre commande sera gardée pendant 10 jours en magasin.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStep; 