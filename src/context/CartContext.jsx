import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([
    // Seed initial items exactly matching original demo content
    {
      id: 1,
      title: 'Cyber Odyssey 2077',
      platform: 'PS5',
      mode: 'rent',
      price: 12.00,
      originalPrice: 15.00,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
      quantity: 1,
      duration: '7 Days',
      dates: 'Oct 25 - Nov 1',
      deposit: 30.00,
    },
    {
      id: 2,
      title: 'PlayStation 5 Console',
      platform: '',
      mode: 'buy',
      price: 499.00,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80',
      quantity: 1,
      inStock: true,
      expressDelivery: true,
    },
  ]);

  const addToCart = (product) => {
    if (!product || !product.id) return;
    
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
          mode: product.mode || (product.rentPrice ? 'rent' : 'buy'),
          price: product.price || product.buyPrice || product.rentPrice || 0,
          deposit: product.deposit || (product.rentPrice ? 30.00 : 0),
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
