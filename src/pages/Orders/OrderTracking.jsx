import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PackageCheck,
  Truck,
  MapPin,
  Clock,
  ArrowLeft,
  Download,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  PhoneCall,
  Calendar,
  CreditCard,
  Navigation,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import DeliveryMap from '../../components/orders/DeliveryMap';
import toast from 'react-hot-toast';

export default function OrderTracking() {
  const { id, orderId } = useParams();
  const targetId = id || orderId;
  const navigate = useNavigate();

  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTracking() {
      if (!targetId) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getOrderTracking(targetId);
        if (res.success && res.data) {
          setTracking(res.data);
        } else {
          setError(res.message || 'Tracking information is currently unavailable.');
        }
      } catch (err) {
        console.error('Failed to load tracking data:', err);
        setError(err?.message || err?.originalError?.response?.data?.message || 'Tracking information is currently unavailable.');
      } finally {
        setLoading(false);
      }
    }
    fetchTracking();
  }, [targetId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060914] pt-24 pb-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center animate-spin">
            <Truck className="h-7 w-7 text-cyan-400" />
          </div>
          <p className="text-sm font-bold text-slate-300 tracking-wider">Locating Package Stream...</p>
        </div>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="min-h-screen bg-[#060914] pt-24 pb-16 px-4 sm:px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full rounded-3xl bg-[#0b0f1d]/90 border border-slate-800 p-8 text-center shadow-2xl"
        >
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <PackageCheck className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">Tracking Unavailable</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'Tracking information is currently unavailable for this order.'}</p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  const {
    orderStatus,
    paymentMethod,
    createdAt,
    estimatedDelivery,
    shippingAddress,
    items = [],
    warehouseLocation,
    customerLocation,
    currentVehicleLocation,
    distanceRemaining,
    deliveryPartner,
    trackingHistory = [],
  } = tracking;

  const firstItem = items[0] || {};
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const estDateFormatted = new Date(estimatedDelivery).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handleDownloadInvoice = () => {
    toast.success('Downloading official VAT Invoice PDF...');
    window.print();
  };

  const handleNeedHelp = () => {
    toast('GameHub 24/7 Priority Support Desk: +1 (800) 555-GAME', {
      icon: '🎧',
      duration: 5000,
    });
  };

  const handleReturnOrder = () => {
    toast.success('Return request initiated! Courier collection scheduled within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-[#060914] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Order Details</span>
        </button>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400">
          Order #{targetId?.slice(-8).toUpperCase()}
        </span>
      </div>

      {/* Page Title */}
      <div className="mb-8 text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Truck className="h-7 w-7 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
          <span>Live Order Tracking</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time GPS telemetry and delivery progress</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Summary, Progress Bar, Map, Metrics */}
        <div className="lg:col-span-2 space-y-8 text-left">
          {/* 1. Order Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-[#0b0f1d]/90 border border-slate-800/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          >
            <div className="flex items-center gap-4">
              <img
                src={firstItem.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80'}
                alt={firstItem.title}
                className="h-20 w-20 rounded-2xl object-cover border border-slate-700 bg-slate-900 flex-shrink-0 shadow-md"
              />
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg line-clamp-1">{firstItem.title || 'Gaming Gear'}</h3>
                {items.length > 1 && (
                  <p className="text-xs text-cyan-400 font-bold mt-0.5">+ {items.length - 1} additional item(s)</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>Ordered: {formattedDate}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-slate-500" />
                    <span className="capitalize">{paymentMethod}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800 flex sm:flex-col justify-between items-center sm:items-end gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Estimated Arrival</span>
                <p className="text-sm font-extrabold text-cyan-400">{estDateFormatted}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                orderStatus === 'Delivered'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              }`}>
                {orderStatus}
              </span>
            </div>
          </motion.div>

          {/* 2. Delivery Progress Timeline Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-[#0b0f1d]/90 border border-slate-800/90 p-6 backdrop-blur-xl shadow-xl"
          >
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <PackageCheck className="h-4.5 w-4.5 text-cyan-400" />
              <span>Delivery Status Stepper</span>
            </h3>

            {/* Stepper Steps Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative">
              {trackingHistory.map((step, idx) => {
                const isCompleted = step.completed;
                const isCurrent = orderStatus.toLowerCase().includes(step.stepKey) || (isCompleted && !trackingHistory[idx + 1]?.completed);

                return (
                  <div key={step.stepKey || idx} className="flex flex-col items-center text-center group">
                    <div
                      className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? isCurrent
                            ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/30 shadow-[0_0_20px_rgba(0,229,255,0.8)] scale-110'
                            : 'bg-blue-600 text-white border border-blue-400/60'
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <span className={`text-[11px] font-bold mt-2.5 line-clamp-1 ${isCompleted ? 'text-slate-200' : 'text-slate-600'}`}>
                      {step.title}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5">
                      {isCompleted ? new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* 3. Interactive Delivery Map */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Navigation className="h-4.5 w-4.5 text-cyan-400" />
                <span>Live Route Telemetry</span>
              </h3>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>GPS Signal Active</span>
              </span>
            </div>

            <DeliveryMap
              warehouse={warehouseLocation}
              customer={customerLocation}
              truck={currentVehicleLocation}
              className="h-96 w-full rounded-3xl"
            />
          </motion.div>

          {/* 4. Live Delivery Information Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <div className="p-4 rounded-2xl bg-[#0b0f1d]/90 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Status</span>
              <p className="text-sm font-extrabold text-white mt-1 line-clamp-1">{orderStatus}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b0f1d]/90 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Distance Remaining</span>
              <p className="text-sm font-extrabold text-cyan-400 mt-1">{distanceRemaining}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b0f1d]/90 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estimated Arrival</span>
              <p className="text-sm font-extrabold text-emerald-400 mt-1">{estDateFormatted}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b0f1d]/90 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Last Telemetry</span>
              <p className="text-sm font-extrabold text-slate-300 mt-1">Just Now</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column (1 Col): Partner, Address, Detailed Timeline, Actions */}
        <div className="space-y-8 text-left">
          {/* 5. Delivery Partner Card */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl bg-[#0b0f1d]/90 border border-slate-800/90 p-6 backdrop-blur-xl shadow-xl"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Assigned Delivery Agent</span>
              <span className="text-emerald-400 font-extrabold">⭐ {deliveryPartner?.rating || 4.9}</span>
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={deliveryPartner?.avatar}
                alt={deliveryPartner?.name}
                className="h-14 w-14 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-white text-base truncate">{deliveryPartner?.name}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{deliveryPartner?.vehicleNumber}</p>
                <p className="text-[10px] text-cyan-400 font-semibold mt-1">GameHub Express Logistics</p>
              </div>
            </div>

            <a
              href={`tel:${deliveryPartner?.phone}`}
              className="mt-5 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Agent ({deliveryPartner?.phone})</span>
            </a>
          </motion.div>

          {/* 6. Delivery Address Card */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-[#0b0f1d]/90 border border-slate-800/90 p-6 backdrop-blur-xl shadow-xl"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>Shipping Destination</span>
            </h3>
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-extrabold text-white text-sm">{shippingAddress?.name || 'Valued Customer'}</p>
              <p>{shippingAddress?.street}</p>
              <p>{shippingAddress?.city}, {shippingAddress?.postal}</p>
              <p className="text-slate-400 pt-1 font-mono">Phone: {shippingAddress?.phone}</p>
            </div>
          </motion.div>

          {/* 7. Detailed Tracking Log Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-[#0b0f1d]/90 border border-slate-800/90 p-6 backdrop-blur-xl shadow-xl"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>Detailed Telemetry Log</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {trackingHistory.map((log, idx) => (
                <div key={idx} className="relative group">
                  <span
                    className={`absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full border-2 ${
                      log.completed
                        ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.8)]'
                        : 'bg-slate-950 border-slate-700'
                    }`}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-extrabold ${log.completed ? 'text-white' : 'text-slate-500'}`}>{log.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {log.completed ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{log.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 8. Order Actions */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <button
              onClick={handleDownloadInvoice}
              className="w-full py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              <span>Download VAT Invoice</span>
            </button>

            <button
              onClick={handleNeedHelp}
              className="w-full py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <HelpCircle className="h-4 w-4 text-blue-400" />
              <span>Need Help with Order</span>
            </button>

            {orderStatus === 'Delivered' && (
              <button
                onClick={handleReturnOrder}
                className="w-full py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RotateCcw className="h-4 w-4 text-amber-400" />
                <span>Return Order</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
