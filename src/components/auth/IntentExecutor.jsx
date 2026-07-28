import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { errorToast } from '../../utils/toast';

export default function IntentExecutor() {
  const { isAuthenticated, pendingAction, clearPendingAction } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !pendingAction) {
      return;
    }

    // Immediately extract and clear pending action to prevent duplicate execution
    const currentAction = { ...pendingAction };
    clearPendingAction();

    const executeIntent = async () => {
      try {
        const { action, payload, redirectTo } = currentAction;

        if (action === 'ADD_TO_CART') {
          if (payload?.product) {
            await addToCart(payload.product, payload.quantity || 1);
          }
        } else if (action === 'ADD_TO_WISHLIST') {
          if (payload?.product) {
            await addToWishlist(payload.product);
          }
        } else if (action === 'BUY_NOW') {
          if (payload?.product) {
            await addToCart(payload.product, payload.quantity || 1);
          }
          navigate('/checkout', { replace: true });
          return;
        } else if (action === 'CHECKOUT') {
          navigate('/checkout', { replace: true });
          return;
        }

        if (redirectTo && typeof redirectTo === 'string' && redirectTo !== window.location.pathname) {
          navigate(redirectTo, { replace: true });
        }
      } catch (err) {
        console.error('[IntentExecutor] Error executing pending action:', err);
        errorToast(err.message || 'Could not complete pending action.');
      }
    };

    executeIntent();
  }, [isAuthenticated, pendingAction, clearPendingAction, addToCart, addToWishlist, navigate]);

  return null;
}
