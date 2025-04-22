import axiosInstance from './axiosConfig';

interface Address {
  id?: number;
  street: string;
  city: string;
  postalCode: number;
  country: string;
  isDefault: boolean;
  isFacturation: boolean;
}

class AddressService {
  // Récupérer toutes les adresses d'un utilisateur
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const response = await axiosInstance.get(`/addresses/users/${userId}`);
      return response.data.addresses;
    } catch (error) {
      console.error('Erreur lors de la récupération des adresses:', error);
      throw error;
    }
  }

  // Créer une nouvelle adresse
  async createAddress(userId: string, addressData: Omit<Address, 'id'>): Promise<Address> {
    try {
      // S'assurer que le code postal est un nombre
      const apiData = {
        ...addressData,
        postalCode: parseInt(addressData.postalCode.toString(), 10)
      };

      console.log('Création d\'adresse - Données envoyées:', apiData);
      
      const response = await axiosInstance.post(`/addresses/users/${userId}`, apiData);
      return response.data.address;
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'adresse:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Mettre à jour une adresse
  async updateAddress(userId: string, addressId: number, addressData: Partial<Address>): Promise<Address> {
    try {
      const apiData = {
        ...addressData,
        ...(addressData.postalCode && { 
          postalCode: parseInt(addressData.postalCode.toString(), 10) 
        })
      };

      console.log('Mise à jour d\'adresse - Données envoyées:', apiData);

      const response = await axiosInstance.put(`/addresses/users/${userId}/${addressId}`, apiData);
      return response.data.address;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'adresse:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Définir une adresse comme adresse par défaut
  async setDefaultAddress(userId: string, addressId: number): Promise<Address> {
    try {
      console.log('Définition d\'adresse par défaut:', addressId);
      
      const response = await axiosInstance.patch(`/addresses/users/${userId}/${addressId}/default`);
      return response.data.address;
    } catch (error: any) {
      console.error('Erreur lors de la définition de l\'adresse par défaut:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Supprimer une adresse
  async deleteAddress(userId: string, addressId: number, isFacturation: boolean): Promise<void> {
    try {
      // Vérifier d'abord si l'adresse peut être supprimée
      const addresses = await this.getUserAddresses(userId);
      
      // Filtrer les adresses du même type
      const sameTypeAddresses = addresses.filter(addr => addr.isFacturation === isFacturation);
      
      // Vérifier si c'est la seule adresse de ce type
      if (sameTypeAddresses.length <= 1) {
        throw new Error(
          isFacturation 
            ? 'Impossible de supprimer la seule adresse de facturation'
            : 'Impossible de supprimer la seule adresse de livraison'
        );
      }

      // Vérifier si l'adresse est par défaut
      const addressToDelete = addresses.find(addr => addr.id === addressId);
      if (addressToDelete?.isDefault) {
        throw new Error('Impossible de supprimer une adresse par défaut');
      }

      console.log('Suppression d\'adresse:', addressId);
      
      await axiosInstance.delete(`/addresses/users/${userId}/${addressId}`);
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'adresse:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export const addressService = new AddressService(); 