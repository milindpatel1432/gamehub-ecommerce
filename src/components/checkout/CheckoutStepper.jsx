import { Check } from 'lucide-react';

export default function CheckoutStepper({ currentStep = 1 }) {
  const steps = [
    { id: 1, name: 'Shipping Address' },
    { id: 2, name: 'Delivery' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Review' },
  ];

  return (
    <div className="w-full border-b border-gaming-border bg-gaming-black/40 py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6 sm:gap-16">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 pb-3 sm:pb-0 relative ${
                  isActive ? 'after:absolute after:bottom-[-21px] after:left-0 after:h-[2px] after:w-full after:bg-gaming-cyan sm:after:bottom-[-21px]' : ''
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-gaming font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gaming-border text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4 stroke-[3px]" /> : step.id}
                </div>

                {/* Step Name */}
                <span
                  className={`text-sm font-bold tracking-wide transition-colors ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                      ? 'text-green-500'
                      : 'text-slate-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
