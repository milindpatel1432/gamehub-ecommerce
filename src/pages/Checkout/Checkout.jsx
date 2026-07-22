import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';
import AddressSection from '../../components/checkout/AddressSection';
import DeliverySection from '../../components/checkout/DeliverySection';
import PaymentSection from '../../components/checkout/PaymentSection';
import OrderSummarySidebar from '../../components/checkout/OrderSummarySidebar';
import { useCart } from '../../context/CartContext';
import { successToast, errorToast, infoToast } from '../../utils/toast';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // Checkout states
  const [address, setAddress] = useState({
    name: 'Marcus Thorne',
    street: '123 Neon Street, Sky-Tower 4',
    city: 'New City',
    postal: '10001',
    phone: '+1 (555) 000-1234',
  });
  const [delivery, setDelivery] = useState({
    id: 'std',
    name: 'Standard Shipping',
    price: 0,
  });
  const [payment, setPayment] = useState({
    type: 'card',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = async () => {
    if (isSubmitting) return;

    if (step === 4) {
      if (!isAgreed) {
        setTermsError(true);
        return;
      }
      
      setIsSubmitting(true);
      console.log('[Checkout] Step 4 Place Order triggered.');
      console.log(`[Checkout] Current cart items count: ${cartItems.length}`, cartItems);

      try {
        const payload = {
          shippingAddress: {
            name: address.name,
            street: address.street,
            city: address.city,
            postal: address.postal,
            phone: address.phone
          },
          paymentMethod: payment.type || 'card',
          deliveryMethod: {
            name: delivery.name,
            price: delivery.price
          },
          items: cartItems.map((item) => ({
            product: item.productId || item.id,
            quantity: item.quantity,
            price: item.price,
            mode: item.mode,
            duration: item.duration,
            deposit: item.deposit
          }))
        };

        console.log('[Checkout] Submitting order payload to backend:', payload);
        const response = await orderService.createOrder(payload);
        console.log('[Checkout] Backend createOrder response:', response);

        if (response.success && response.data) {
          const createdOrder = response.data;
          console.log(`[Checkout] Order #${createdOrder.id} created on backend successfully.`);

          // Handle COD (Cash on Delivery)
          if (payment.type === 'cod') {
            successToast('Order placed successfully!');
            await clearCart(true);
            navigate('/order-success', {
              state: {
                orderId: createdOrder.id,
                orderItems: createdOrder.items,
                subtotal: createdOrder.subtotal,
                tax: createdOrder.tax,
                total: createdOrder.total,
                deliveryMethod: createdOrder.deliveryMethod
              },
            });
            return;
          }

          // Handle Online Payment (Razorpay)
          console.log('[Checkout] Initializing online payment gateway...');
          const scriptLoaded = await paymentService.loadRazorpayScript();
          if (!scriptLoaded) {
            errorToast('Razorpay payment gateway failed to load. Order created with pending payment.');
            await clearCart(true);
            navigate('/orders');
            return;
          }

          const paymentOrder = await paymentService.createPaymentOrder(createdOrder.id);
          if (!paymentOrder.success || !paymentOrder.data) {
            errorToast('Failed to initialize payment order. You can try paying later from My Orders.');
            await clearCart(true);
            navigate('/orders');
            return;
          }

          const { keyId, amount, currency, id: rzpOrderId } = paymentOrder.data;

          const options = {
            key: keyId,
            amount: amount,
            currency: currency,
            name: 'GameHub Gaming Marketplace',
            description: 'Order Checkout Payment',
            order_id: rzpOrderId,
            handler: async (paymentResponse) => {
              try {
                setIsSubmitting(true);
                console.log('[Checkout] Payment captured by Razorpay. Verifying signature...');
                const verifyPayload = {
                  orderId: createdOrder.id,
                  razorpayOrderId: paymentResponse.razorpay_order_id,
                  razorpayPaymentId: paymentResponse.razorpay_payment_id,
                  razorpaySignature: paymentResponse.razorpay_signature
                };
                const verification = await paymentService.verifyPayment(verifyPayload);
                if (verification.success) {
                  console.log('[Checkout] Payment verification success! Clearing cart now...');
                  successToast('Payment processed successfully!');
                  await clearCart(true);
                  navigate('/order-success', {
                    state: {
                      orderId: createdOrder.id,
                      orderItems: createdOrder.items,
                      subtotal: createdOrder.subtotal,
                      tax: createdOrder.tax,
                      total: createdOrder.total,
                      deliveryMethod: createdOrder.deliveryMethod
                    },
                  });
                } else {
                  console.error('[Checkout] Payment verification failed!');
                  errorToast('Payment signature verification failed.');
                  navigate('/orders');
                }
              } catch (err) {
                console.error('[Checkout] Verification exception:', err);
                errorToast(err.message || 'Payment verification failed.');
                navigate('/orders');
              } finally {
                setIsSubmitting(false);
              }
            },
            modal: {
              ondismiss: () => {
                console.log('[Checkout] Razorpay payment modal dismissed by user.');
                infoToast('Payment checkout closed. You can complete this order payment in My Orders.');
                navigate('/orders');
              }
            },
            prefill: {
              name: address.name,
              contact: address.phone
            },
            theme: {
              color: '#00e5ff'
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          console.error('[Checkout] createOrder returned unsuccessful:', response);
          errorToast(response.message || 'Failed to place order.');
        }
      } catch (err) {
        console.error('[Checkout] Exception during handleNextStep:', err);
        errorToast(err.response?.data?.message || err.message || 'An error occurred while creating your order.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="w-full bg-gaming-dark min-h-screen text-slate-200">
      
      {/* Checkout Progress Stepper */}
      {step <= 4 && <CheckoutStepper currentStep={step} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {step <= 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Main column - Step Forms */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Stepper Breadcrumb / Navigation helper */}
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-semibold">
                <button
                  disabled={step === 1}
                  onClick={handlePrevStep}
                  className="hover:text-gaming-cyan transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  &larr; Back
                </button>
                <span>Step {step} of 4</span>
              </div>

              {/* Steps panels */}
              <div className="bg-gaming-card/10 rounded-3xl border border-gaming-border p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {step === 1 && (
                      <AddressSection onAddressSelect={setAddress} />
                    )}

                    {step === 2 && (
                      <DeliverySection onDeliverySelect={setDelivery} />
                    )}

                    {step === 3 && (
                      <PaymentSection onPaymentSelect={setPayment} />
                    )}

                    {step === 4 && (
                      <div className="text-left space-y-8">
                        <h3 className="font-gaming text-lg font-bold text-white tracking-wider pb-4 border-b border-gaming-border/60">
                          Review & Confirm Order
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          {/* Shipping address recap */}
                          <div className="p-5 rounded-2xl border border-gaming-border bg-gaming-card/30 space-y-2">
                            <h4 className="font-gaming text-xs font-bold text-gaming-cyan uppercase tracking-wider">
                              Shipping Address
                            </h4>
                            <div className="text-slate-300">
                              <p className="font-bold text-white">{address.name}</p>
                              <p>{address.street}</p>
                              <p>{address.city}, {address.postal}</p>
                              <p className="text-xs text-slate-500 mt-2">Phone: {address.phone}</p>
                            </div>
                          </div>

                          {/* Shipping Speed + Payment recap */}
                          <div className="flex flex-col gap-6">
                            {/* Shipping speed */}
                            <div className="p-5 rounded-2xl border border-gaming-border bg-gaming-card/30 space-y-2">
                              <h4 className="font-gaming text-xs font-bold text-gaming-cyan uppercase tracking-wider">
                                Shipping Method
                              </h4>
                              <p className="text-slate-300 font-bold">{delivery.name}</p>
                              <p className="text-xs text-slate-500">
                                {delivery.price === 0 ? 'Free Shipping' : `₹${delivery.price.toFixed(2)} Fee`}
                              </p>
                            </div>

                            {/* Payment recap */}
                            <div className="p-5 rounded-2xl border border-gaming-border bg-gaming-card/30 space-y-2">
                              <h4 className="font-gaming text-xs font-bold text-gaming-cyan uppercase tracking-wider">
                                Payment Method
                              </h4>
                              <p className="text-slate-300 font-bold uppercase">{payment.type} Payment</p>
                            </div>
                          </div>
                        </div>

                        {/* Terms and Conditions checkbox */}
                        <div className="space-y-3 pt-4 border-t border-gaming-border/60">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isAgreed}
                              onChange={(e) => {
                                setIsAgreed(e.target.checked);
                                setTermsError(false);
                              }}
                              className="h-5 w-5 mt-0.5 rounded border-gaming-border bg-gaming-black text-gaming-cyan focus:ring-0 cursor-pointer"
                            />
                            <span className="text-xs sm:text-sm text-slate-400 leading-normal">
                              I agree to the <Link to="#" className="text-gaming-cyan hover:underline">Terms of Service</Link>, <Link to="#" className="text-gaming-cyan hover:underline">Privacy Policy</Link>, and the rental return guidelines.
                            </span>
                          </label>
                          
                          {termsError && (
                            <p className="text-xs text-red-500 font-semibold uppercase tracking-wider animate-pulse">
                              You must agree to the Terms and Conditions before placing your order.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

            {/* Right column - Summary panel */}
            <div className="lg:col-span-4 w-full">
              <OrderSummarySidebar
                currentStep={step}
                deliveryMethod={delivery}
                onNextStep={handleNextStep}
              />
            </div>

          </div>
        ) : (
          /* Confirmation Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto rounded-3xl border border-gaming-border bg-gaming-card/40 p-8 md:p-12 text-center space-y-8 shadow-[0_0_30px_rgba(34,197,94,0.15)]"
          >
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
              <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
                Order Confirmed!
              </h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                Thank you for your order.
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
              Thank you for shopping at GameHub. Your gaming adventure starts soon! A receipt and tracking summary are sent to your email address.
            </p>

            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-gaming-cyan text-gaming-black hover:text-white hover:bg-gaming-accent font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.35)] transition-all duration-300 cursor-pointer"
              >
                Continue to Home
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
