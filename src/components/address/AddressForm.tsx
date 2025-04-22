import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
} from '@mui/material';
import { GridProps } from '@mui/material';
import { styled } from '@mui/material/styles';

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

interface AddressFormProps {
  onSubmit: (data: Omit<Address, 'id'>) => void;
  onCancel: () => void;
  initialData?: Address | null;
  isFacturationType?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isFacturationType = false,
}) => {
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    isDefault: false,
    isFacturation: isFacturationType,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        street: initialData.street,
        city: initialData.city,
        postalCode: initialData.postalCode,
        country: initialData.country,
        isDefault: initialData.isDefault,
        isFacturation: initialData.isFacturation,
      });
    } else {
      // Réinitialiser le formulaire avec les valeurs par défaut
      setFormData({
        street: '',
        city: '',
        postalCode: '',
        country: 'France',
        isDefault: false,
        isFacturation: isFacturationType,
      });
    }
  }, [initialData, isFacturationType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Préparer les données exactement comme l'API les attend
    const dataToSubmit: Omit<Address, 'id'> = {
      street: formData.street.trim(),
      city: formData.city.trim(),
      postalCode: formData.postalCode.trim(),
      country: formData.country.trim() || 'France',
      isDefault: formData.isDefault && !isFacturationType, // false pour les adresses de facturation
      isFacturation: isFacturationType // true pour les adresses de facturation, false pour les adresses de livraison
    };

    console.log('Données soumises:', dataToSubmit); // Pour le débogage
    onSubmit(dataToSubmit);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 3,
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Modifier l\'adresse' : isFacturationType ? 'Nouvelle adresse de facturation' : 'Nouvelle adresse de livraison'}
      </Typography>
      <StyledGrid container spacing={2}>
        <StyledGrid item xs={12}>
          <TextField
            required
            fullWidth
            label="Rue"
            name="street"
            value={formData.street}
            onChange={handleChange}
          />
        </StyledGrid>
        <StyledGrid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Ville"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </StyledGrid>
        <StyledGrid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Code postal"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </StyledGrid>
        <StyledGrid item xs={12}>
          <TextField
            required
            fullWidth
            label="Pays"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </StyledGrid>
        {!isFacturationType && (
          <StyledGrid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDefault}
                  onChange={handleChange}
                  name="isDefault"
                />
              }
              label="Définir comme adresse de livraison par défaut"
            />
          </StyledGrid>
        )}
      </StyledGrid>
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Annuler
        </Button>
      </Box>
    </Box>
  );
};

export default AddressForm; 