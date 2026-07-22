import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import AuthModal from './components/auth/AuthModal';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/profile');

  return (
    <div className="flex flex-col min-h-screen bg-gaming-dark text-slate-200 antialiased font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      {/* Global Auth Popup Modal */}
      <AuthModal />

      {/* Render Navbar only when not on admin or dashboard routes */}
      {!hideLayout && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-grow">
        <AppRoutes />
      </main>

      {/* Render Footer only when not on admin or dashboard routes */}
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <AppContent />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
