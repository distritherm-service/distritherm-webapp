import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaStar } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { addressService } from '../../services/addressService';
import { toast } from 'react-toastify';

interface Address {
  id?: number;
  street: string;
  city: string;
  postalCode: number;
  country: string;
  isDefault: boolean;
  isFacturation: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: Omit<Address, 'id'>) => Promise<void>;
  address?: Address;
  isFacturation: boolean;
}

const AddressModal: React.FC<AddressModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  address, 
  isFacturation 
}) => {
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    street: '',
    city: '',
    postalCode: 75000,
    country: 'France',
    isDefault: false,
    isFacturation: isFacturation
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        street: '',
        city: '',
        postalCode: 75000,
        country: 'France',
        isDefault: false,
        isFacturation: isFacturation
      });
    }
  }, [address, isFacturation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        isFacturation: isFacturation
      };
      console.log('Données à soumettre:', dataToSubmit);
      await onSubmit(dataToSubmit);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement de l\'adresse');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          {address ? 'Modifier l\'adresse' : isFacturation ? 'Nouvelle adresse de facturation' : 'Nouvelle adresse de livraison'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rue</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Code postal</label>
            <input
              type="number"
              min="1000"
              max="99999"
              value={formData.postalCode}
              onChange={(e) => setFormData(prev => ({ ...prev, postalCode: parseInt(e.target.value) || 75000 }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pays</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          {!isFacturation && (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Définir comme adresse de livraison par défaut
                </span>
              </label>
            </div>
          )}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {address ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddressForm: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();
  const [isFacturationType, setIsFacturationType] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await addressService.getUserAddresses(user!.id);
      setAddresses(response);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des adresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = (isFacturation: boolean) => {
    setIsFacturationType(isFacturation);
    setSelectedAddress(undefined);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setIsFacturationType(address.isFacturation);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const address = addresses.find(addr => addr.id === addressId);
      if (!address) return;

      await addressService.deleteAddress(user!.id, addressId, address.isFacturation);
      toast.success('Adresse supprimée avec succès');
      loadAddresses();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression de l\'adresse');
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      await addressService.setDefaultAddress(user!.id, addressId);
      toast.success('Adresse définie comme adresse par défaut');
      loadAddresses();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la définition de l\'adresse par défaut');
    }
  };

  const handleSubmitAddress = async (addressData: Omit<Address, 'id'>) => {
    try {
      if (selectedAddress?.id) {
        await addressService.updateAddress(user!.id, selectedAddress.id, addressData);
        toast.success('Adresse mise à jour avec succès');
      } else {
        await addressService.createAddress(user!.id, addressData);
        toast.success('Adresse ajoutée avec succès');
      }
      loadAddresses();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement de l\'adresse');
    }
  };

  const renderAddressCard = (address: Address) => (
    <div key={address.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">{address.street}</p>
          <p className="text-gray-600">{address.postalCode} {address.city}</p>
          <p className="text-gray-600">{address.country}</p>
          {address.isDefault && (
            <span className="text-sm text-teal-600 mt-1 flex items-center">
              <FaStar className="h-4 w-4 mr-1" />
              Adresse par défaut
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditAddress(address)}
            className="text-blue-600 hover:text-blue-800"
            title="Modifier l'adresse"
          >
            <FaEdit className="h-5 w-5" />
          </button>
          {!address.isFacturation && !address.isDefault && (
            <button
              onClick={() => handleDeleteAddress(address.id!)}
              className="text-red-600 hover:text-red-800"
              title="Supprimer l'adresse"
            >
              <FaTrash className="h-5 w-5" />
            </button>
          )}
          {!address.isFacturation && !address.isDefault && (
            <button
              onClick={() => handleSetDefault(address.id!)}
              className="text-yellow-600 hover:text-yellow-800"
              title="Définir comme adresse par défaut"
            >
              <FaStar className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const deliveryAddresses = addresses.filter(addr => !addr.isFacturation);
  const billingAddresses = addresses.filter(addr => addr.isFacturation);

  console.log('Adresses de livraison:', deliveryAddresses);
  console.log('Adresses de facturation:', billingAddresses);

  return (
    <div className="space-y-8">
      {/* Section Adresses de livraison */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Adresses de livraison</h2>
          <button
            onClick={() => handleAddAddress(false)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaPlus className="h-4 w-4 mr-2" />
            Ajouter une adresse
          </button>
        </div>
        {deliveryAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryAddresses.map(renderAddressCard)}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
            Aucune adresse de livraison enregistrée
          </div>
        )}
      </div>

      {/* Section Adresses de facturation */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Adresses de facturation</h2>
          <button
            onClick={() => handleAddAddress(true)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaPlus className="h-4 w-4 mr-2" />
            Ajouter une adresse
          </button>
        </div>
        {billingAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {billingAddresses.map(renderAddressCard)}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
            Aucune adresse de facturation enregistrée
          </div>
        )}
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitAddress}
        address={selectedAddress}
        isFacturation={isFacturationType}
      />
    </div>
  );
};

export default AddressForm; 