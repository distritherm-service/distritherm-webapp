import React, { useState } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import * as favoriteService from '../../services/favoriteService';

const FavoritesDebug: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    favorites, 
    isLoading, 
    error, 
    favoritesCount, 
    addToFavorites, 
    removeFromFavorites,
    refreshFavorites,
    isFavorite 
  } = useFavorites();
  
  const [testProductId, setTestProductId] = useState<number>(1);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const runDebugTests = async () => {
    if (!isAuthenticated || !user) {
      setDebugInfo('Utilisateur non connecté');
      return;
    }

    const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
    let debugLog = '';

    try {
      // Test 1: Vérifier l'état actuel
      debugLog += `=== ÉTAT ACTUEL ===\n`;
      debugLog += `Utilisateur ID: ${userId} (type: ${typeof user.id})\n`;
      debugLog += `Favoris chargés: ${favorites.length}\n`;
      debugLog += `Compteur total: ${favoritesCount}\n`;
      debugLog += `En cours de chargement: ${isLoading}\n`;
      debugLog += `Erreur: ${error || 'Aucune'}\n\n`;

      // Test 2: Vérifier si le produit de test est en favori
      debugLog += `=== TEST VÉRIFICATION FAVORI ===\n`;
      try {
        const isFav = await favoriteService.checkFavorite(testProductId, userId);
        debugLog += `Produit ${testProductId} en favori: ${isFav.isFavorite}\n`;
        debugLog += `Réponse complète: ${JSON.stringify(isFav, null, 2)}\n\n`;
      } catch (error: any) {
        debugLog += `Erreur lors de la vérification: ${error.message}\n\n`;
      }

      // Test 3: Tenter d'ajouter le produit aux favoris
      debugLog += `=== TEST AJOUT FAVORI ===\n`;
      try {
        const result = await addToFavorites(testProductId);
        debugLog += `Résultat ajout: ${result}\n\n`;
      } catch (error: any) {
        debugLog += `Erreur lors de l'ajout: ${error.message}\n\n`;
      }

      // Test 4: Rafraîchir la liste
      debugLog += `=== TEST RAFRAÎCHISSEMENT ===\n`;
      try {
        await refreshFavorites();
        debugLog += `Rafraîchissement réussi\n`;
        debugLog += `Nouveau nombre de favoris: ${favorites.length}\n\n`;
      } catch (error: any) {
        debugLog += `Erreur lors du rafraîchissement: ${error.message}\n\n`;
      }

      // Test 5: Vérifier l'état local
      debugLog += `=== ÉTAT LOCAL ===\n`;
      debugLog += `Produit ${testProductId} en favori (local): ${isFavorite(testProductId)}\n`;
      debugLog += `IDs des favoris locaux: ${Array.from(favorites.map(f => f.id))}\n`;

    } catch (error: any) {
      debugLog += `Erreur générale: ${error.message}\n`;
    }

    setDebugInfo(debugLog);
  };

  const clearDebug = () => {
    setDebugInfo('');
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <h3 className="font-bold text-yellow-800">Débogage Favoris</h3>
        <p className="text-yellow-700">Vous devez être connecté pour tester les favoris</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <h3 className="font-bold text-gray-800 mb-4">Débogage Système Favoris</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ID Produit de test:
        </label>
        <input
          type="number"
          value={testProductId}
          onChange={(e) => setTestProductId(parseInt(e.target.value) || 1)}
          className="border border-gray-300 rounded px-3 py-2 w-32"
        />
      </div>

      <div className="mb-4 space-y-2">
        <button
          onClick={runDebugTests}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Test en cours...' : 'Lancer les tests'}
        </button>
        
        <button
          onClick={clearDebug}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
        >
          Effacer
        </button>
      </div>

      {debugInfo && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Résultats des tests:</h4>
          <pre className="bg-white border border-gray-300 rounded p-3 text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {debugInfo}
          </pre>
        </div>
      )}

      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">État actuel:</h4>
        <div className="bg-white border border-gray-300 rounded p-3 text-sm">
          <p><strong>Utilisateur:</strong> {user?.firstName} {user?.lastName} (ID: {user?.id})</p>
          <p><strong>Favoris chargés:</strong> {favorites.length}</p>
          <p><strong>Compteur total:</strong> {favoritesCount}</p>
          <p><strong>En cours de chargement:</strong> {isLoading ? 'Oui' : 'Non'}</p>
          <p><strong>Erreur:</strong> {error || 'Aucune'}</p>
          <p><strong>Produit {testProductId} en favori:</strong> {isFavorite(testProductId) ? 'Oui' : 'Non'}</p>
        </div>
      </div>
    </div>
  );
};

export default FavoritesDebug; 