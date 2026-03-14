import { CheckCircle, Clock, Truck, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderStatus } from '../../backend';

interface OrderStatusIndicatorProps {
  status: OrderStatus;
}

const STATUS_CONFIG = {
  [OrderStatus.confirmed]: {
    label: 'Confirmed',
    icon: CheckCircle,
    step: 1,
  },
  [OrderStatus.preparing]: {
    label: 'Preparing',
    icon: Clock,
    step: 2,
  },
  [OrderStatus.outForDelivery]: {
    label: 'Out for Delivery',
    icon: Truck,
    step: 3,
  },
  [OrderStatus.delivered]: {
    label: 'Delivered',
    icon: Package,
    step: 4,
  },
};

const ALL_STEPS = [
  OrderStatus.confirmed,
  OrderStatus.preparing,
  OrderStatus.outForDelivery,
  OrderStatus.delivered,
];

export default function OrderStatusIndicator({ status }: OrderStatusIndicatorProps) {
  const currentStep = STATUS_CONFIG[status].step;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {ALL_STEPS.map((stepStatus, index) => {
          const config = STATUS_CONFIG[stepStatus];
          const Icon = config.icon;
          const isActive = config.step <= currentStep;
          const isCurrent = config.step === currentStep;

          return (
            <div key={stepStatus} className="flex-1 flex flex-col items-center relative">
              {index > 0 && (
                <div
                  className={cn(
                    'absolute top-5 right-1/2 w-full h-0.5 -z-10',
                    isActive ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  isCurrent && 'ring-4 ring-primary/20'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p
                className={cn(
                  'text-xs text-center font-medium',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {config.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
