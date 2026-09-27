import { AlertCircle } from 'lucide-react';

// Friendly inline error state shown when an API call fails, instead of
// leaving a blank/broken section.
const ErrorMessage = ({ message = 'Something went wrong. Please try again later.' }) => {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center text-body">
      <AlertCircle className="text-rose" size={32} />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
