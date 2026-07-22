import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, CreditCard, ShieldCheck, XCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { successToast, errorToast, infoToast } from '../../utils/toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePaymentRetry = async () => {
    setIsPaying(true);
    try {
      const scriptLoaded = await paymentService.loadRazorpayScript();
      if (!scriptLoaded) {
        errorToast('Razorpay payment gateway failed to load. Please try again.');
        return;
      }

      const paymentOrder = await paymentService.createPaymentOrder(order.id);
      if (!paymentOrder.success || !paymentOrder.data) {
        errorToast('Failed to initialize payment gateway.');
        return;
      }

      const { keyId, amount, currency, id: rzpOrderId } = paymentOrder.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'GameHub Gaming Marketplace',
        description: 'Retry Order Payment',
        order_id: rzpOrderId,
        handler: async (paymentResponse) => {
          try {
            setIsPaying(true);
            const verifyPayload = {
              orderId: order.id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature
            };
            const verification = await paymentService.verifyPayment(verifyPayload);
            if (verification.success && verification.data) {
              successToast('Payment processed successfully!');
              setOrder(verification.data);
            } else {
              errorToast('Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            errorToast(err.message || 'Signature verification failed.');
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            infoToast('Payment checkout closed.');
          }
        },
        prefill: {
          name: order.shippingAddress.name,
          contact: order.shippingAddress.phone
        },
        theme: {
          color: '#00e5ff'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      errorToast(err.message || 'Payment initialization failed.');
    } finally {
      setIsPaying(false);
    }
  };

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getOrderDetails(id);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError('Order details not found.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching order details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.');
    if (!confirmCancel) return;

    setIsCancelling(true);
    try {
      const res = await orderService.cancelOrder(id);
      if (res.success && res.data) {
        setOrder(res.data);
        successToast('Order cancelled successfully.');
      } else {
        errorToast(res.message || 'Failed to cancel order.');
      }
    } catch (err) {
      console.error(err);
      errorToast(err.message || 'An error occurred while cancelling the order.');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center bg-gaming-dark text-gaming-cyan">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full bg-gaming-dark py-20 px-4 min-h-[75vh]">
        <ErrorState
          title="Failed to Load Invoice"
          description={error || 'Order details not found.'}
          onRetry={fetchOrderDetails}
        />
      </div>
    );
  }

  const shippingCost = order.deliveryMethod?.price || 0;

  return (
    <div className="w-full bg-gaming-dark py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh] text-slate-200">
      <div className="mx-auto max-w-4xl space-y-8 text-left">
        
        {/* Back Link & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-gaming-cyan transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <span className="text-xs text-slate-500 uppercase font-semibold">
            Invoice ID: #{order.id.slice(-12).toUpperCase()}
          </span>
        </div>

        {/* Invoice Top header */}
        <div className="glass-card rounded-3xl border border-gaming-border bg-gaming-card/45 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] uppercase font-bold tracking-wider rounded-full px-3 py-1 border ${
                order.status === 'Delivered'
                  ? 'bg-green-500/10 text-green-400 border-green-500/25'
                  : order.status === 'Cancelled'
                  ? 'bg-red-500/10 text-red-400 border-red-500/25'
                  : order.status === 'Shipped'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                  : 'bg-gaming-cyan/10 text-gaming-cyan border-gaming-cyan/25'
              }`}>
                {order.status}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider rounded-full px-3 py-1 border ${
                order.paymentStatus === 'paid'
                  ? 'bg-green-500/10 text-green-400 border-green-500/25'
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25'
              }`}>
                Payment: {order.paymentStatus}
              </span>
            </div>
            <h1 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              Order Details
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Placed on {formatDate(order.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {order.paymentStatus === 'pending' && order.status !== 'Cancelled' && (
              <button
                onClick={handlePaymentRetry}
                disabled={isPaying}
                className="h-12 px-6 rounded-xl bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                Pay Now
              </button>
            )}

            {order.status === 'Processing' && (
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling || isPaying}
                className="h-12 px-6 rounded-xl border border-red-500/35 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Info Grid (Address, Delivery details) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address details */}
          <div className="glass-card rounded-3xl border border-gaming-border bg-gaming-card/35 p-6 space-y-4">
            <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2 pb-2 border-b border-gaming-border/60">
              <MapPin className="h-4.5 w-4.5 text-gaming-cyan" />
              Shipping Destination
            </h3>
            <div className="text-sm text-slate-300 space-y-1">
              <p className="font-bold text-white text-base">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postal}</p>
              <p className="text-xs text-slate-500 pt-2 font-semibold">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Delivery & Payment details */}
          <div className="glass-card rounded-3xl border border-gaming-border bg-gaming-card/35 p-6 space-y-4">
            <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2 pb-2 border-b border-gaming-border/60">
              <CreditCard className="h-4.5 w-4.5 text-gaming-cyan" />
              Method & Services
            </h3>
            <div className="text-sm text-slate-300 space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Shipping Method</p>
                <p className="font-bold text-white mt-0.5">{order.deliveryMethod?.name || 'Standard Shipping'}</p>
                <p className="text-xs text-slate-400">
                  {shippingCost === 0 ? 'Free Shipping' : `₹${shippingCost.toFixed(2)} Delivery Cost`}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Payment Method</p>
                <p className="font-bold text-white mt-0.5 uppercase">{order.paymentMethod} Payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered items summary details */}
        <div className="glass-card rounded-3xl border border-gaming-border bg-gaming-card/35 p-6 md:p-8 space-y-6">
          <h3 className="font-gaming text-base font-bold text-white tracking-wider pb-3 border-b border-gaming-border/60">
            Items Stack
          </h3>

          <div className="divide-y divide-gaming-border/30">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gaming-black/25 flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-snug">{item.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                      {item.platform && (
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gaming-cyan bg-gaming-black/60 border border-gaming-cyan/25 rounded px-1.5 py-0.5">
                          {item.platform}
                        </span>
                      )}
                      <span className="capitalize font-semibold text-slate-400">{item.mode} Mode</span>
                      {item.mode === 'rent' && (
                        <>
                          <span>&bull;</span>
                          <span className="text-slate-400 font-semibold">{item.duration} Duration</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-10 text-right">
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <p>Price: <span className="text-white font-bold">₹{item.price.toFixed(2)}</span></p>
                    <p>Qty: <span className="text-white font-bold">{item.quantity}</span></p>
                    {item.deposit > 0 && <p>Deposit: <span className="text-gaming-cyan font-bold">₹{item.deposit.toFixed(2)}</span></p>}
                  </div>
                  <span className="font-gaming text-sm font-bold text-gaming-cyan">
                    ₹{((item.price + (item.deposit || 0)) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout invoice price calculations */}
          <div className="border-t border-gaming-border/60 pt-6 space-y-3.5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-white">₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping cost</span>
              <span className="font-bold text-white">
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-bold text-white">₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gaming-border/60 pt-4 text-base font-bold text-white">
              <span className="font-gaming uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-gaming-cyan" />
                Grand Total
              </span>
              <span className="font-gaming text-gaming-cyan text-xl tracking-wide">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
