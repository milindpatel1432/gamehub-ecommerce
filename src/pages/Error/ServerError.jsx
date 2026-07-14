import ErrorState from '../../components/ui/ErrorState';
import { ServerCrash } from 'lucide-react';

export default function ServerError() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="w-full bg-gaming-dark min-h-[75vh] flex items-center justify-center py-16 px-4">
      <ErrorState
        icon={ServerCrash}
        title="500 Server Error"
        description="Something went wrong on our headquarters networks. Please reload the console session."
        retryText="Reload Page"
        onRetry={handleRetry}
      />
    </div>
  );
}
