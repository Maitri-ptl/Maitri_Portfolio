import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Small themed confirmation modal (replaces the browser's window.confirm,
// which ignores the site theme). Closes on Escape or a backdrop click.
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  isBusy = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-maroon-dark/70 px-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-card border border-maroon-light bg-maroon p-6 shadow-lift"
          >
            <h2 id="confirm-title" className="font-display text-xl text-cream">
              {title}
            </h2>
            <p className="mt-2 text-sm text-body">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-pill border border-maroon-light px-5 py-2 text-sm font-semibold text-cream transition-colors hover:border-rose hover:text-rose"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isBusy}
                className="rounded-pill bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isBusy ? 'Deleting...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
