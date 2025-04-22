import React, { useState, useEffect } from 'react';
import { addressService } from '../../services/addressService';
import { useAuth } from '../../contexts/AuthContext';
import AddressForm from '../profile/AddressForm';
import { Button, Card, Typography, Box, Grid, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { GridProps } from '@mui/material';

const StyledGrid = styled(Grid)<GridProps>(() => ({
  '&.MuiGrid-item': {
    // Styles spécifiques pour les items de la grille si nécessaire
  }
}));

interface Address {
  id?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isFacturation: boolean;
}

const AddressManager: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddingFacturation, setIsAddingFacturation] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      if (user?.id) {
        const userAddresses = await addressService.getUserAddresses(user.id);
        setAddresses(userAddresses);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des adresses:', error);
    }
  };

  const handleAddAddress = async (addressData: Omit<Address, 'id'>) => {
    try {
      if (user?.id) {
        await addressService.createAddress(user.id, addressData);
        await loadAddresses();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', error);
    }
  };

  const handleUpdateAddress = async (addressData: Partial<Address>) => {
    try {
      if (user?.id && editingAddress?.id) {
        await addressService.updateAddress(user.id, editingAddress.id, addressData);
        await loadAddresses();
        setEditingAddress(null);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'adresse:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      if (user?.id) {
        await addressService.deleteAddress(user.id, addressId);
        await loadAddresses();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'adresse:', error);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      if (user?.id) {
        await addressService.setDefaultAddress(user.id, addressId);
        await loadAddresses();
      }
    } catch (error) {
      console.error('Erreur lors de la définition de l\'adresse par défaut:', error);
    }
  };

  const renderAddressCard = (address: Address) => (
    <Card sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body1">
          {address.street}, {address.postalCode} {address.city}, {address.country}
          {address.isDefault && (
            <Typography component="span" color="primary" sx={{ ml: 1 }}>
              (Par défaut)
            </Typography>
          )}
        </Typography>
        <Box>
          <IconButton onClick={() => setEditingAddress(address)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteAddress(address.id!)} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <StyledGrid container spacing={4}>
        {/* Section des adresses de livraison */}
        <StyledGrid item xs={12} md={6} component="div">
          <Typography variant="h6" gutterBottom>
            Adresses de livraison
          </Typography>
          {addresses
            .filter(address => !address.isFacturation)
            .map(address => (
              <Box key={address.id}>
                {renderAddressCard(address)}
              </Box>
            ))}
          <Button
            variant="contained"
            onClick={() => {
              setShowAddForm(true);
              setEditingAddress(null);
              setIsAddingFacturation(false);
            }}
            sx={{ mt: 2 }}
          >
            Ajouter une adresse de livraison
          </Button>
        </StyledGrid>

        {/* Section des adresses de facturation */}
        <StyledGrid item xs={12} md={6} component="div">
          <Typography variant="h6" gutterBottom>
            Adresses de facturation
          </Typography>
          {addresses
            .filter(address => address.isFacturation)
            .map(address => (
              <Box key={address.id}>
                {renderAddressCard(address)}
              </Box>
            ))}
          <Button
            variant="contained"
            onClick={() => {
              setShowAddForm(true);
              setEditingAddress(null);
              setIsAddingFacturation(true);
            }}
            sx={{ mt: 2 }}
          >
            Ajouter une adresse de facturation
          </Button>
        </StyledGrid>
      </StyledGrid>

      {(showAddForm || editingAddress) && (
        <AddressForm
          onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
          onCancel={() => {
            setShowAddForm(false);
            setEditingAddress(null);
          }}
          initialData={editingAddress}
          isFacturationType={editingAddress ? editingAddress.isFacturation : isAddingFacturation}
        />
      )}
    </Box>
  );
};

export default AddressManager; 