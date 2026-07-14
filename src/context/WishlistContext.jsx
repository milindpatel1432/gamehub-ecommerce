import { createContext, useContext, useState } from 'react';
import { successToast, infoToast } from '../utils/toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToWishlist = (product) => {
    if (!product || !product.id) return;
    if (wishlistItems.some((item) => item.id === product.id)) return;
    setWishlistItems((prev) => [...prev, product]);
    successToast(`${product.title} added to Wishlist!`);
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (item) {
        infoToast(`${item.title} removed from Wishlist.`);
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    infoToast('Wishlist cleared.');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        clearWishlist,
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
