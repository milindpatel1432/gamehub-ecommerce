import { createContext, useContext, useState, useEffect } from 'react';
import { successToast, infoToast, errorToast } from '../utils/toast';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await wishlistService.getWishlist();
      if (res.success && res.data) {
        setWishlistItems(res.data);
      } else {
        setError('Failed to fetch wishlist from server.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading wishlist.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const addToWishlist = async (product) => {
    if (!product || !product.id) return;
    
    if (!isAuthenticated) {
      errorToast('Please sign in to add items to your wishlist.');
      return;
    }

    if (wishlistItems.some((item) => item.id === product.id)) {
      infoToast(`${product.title} is already in your wishlist.`);
      return;
    }

    try {
      const res = await wishlistService.addToWishlist(product.id);
      if (res.success && res.data) {
        setWishlistItems(res.data);
        successToast(`${product.title} added to Wishlist!`);
      } else {
        errorToast('Failed to add item to wishlist.');
      }
    } catch (err) {
      console.error(err);
      errorToast(err.message || 'Error adding item to wishlist.');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      if (res.success && res.data) {
        setWishlistItems(res.data);
        infoToast('Item removed from Wishlist.');
      } else {
        errorToast('Failed to remove item.');
      }
    } catch (err) {
      console.error(err);
      errorToast(err.message || 'Error removing item.');
    }
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    infoToast('Wishlist cleared.');
  };

  const moveToCart = async (productId, options = {}) => {
    if (!isAuthenticated) return;
    try {
      const res = await wishlistService.moveToCart(productId, options);
      if (res.success && res.data) {
        setWishlistItems(res.data);
      }
    } catch (err) {
      console.error(err);
      errorToast(err.message || 'Error moving item to cart.');
      throw err; // throw error so handleMoveToCart in page knows it failed
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        error,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        clearWishlist,
        fetchWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
