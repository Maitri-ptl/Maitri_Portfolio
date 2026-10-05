import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Mail, MailOpen, Reply, Trash2 } from 'lucide-react';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const iconButton =
  'flex items-center gap-2 rounded-pill border border-maroon-light px-4 py-2 text-sm text-cream transition-colors hover:border-rose hover:text-rose';

// The "Messages" tab: everything submitted through the contact form. Opening
// a message marks it as read automatically; it can be marked unread again,
// replied to by email, or deleted.
const MessagesPanel = ({ messages, status, onToggleRead, onDelete }) => {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('all');

  const visible = messages.filter((m) => (filter === 'unread' ? !m.read : true));

  const handleOpen = (message) => {
    const isOpening = openId !== message._id;
    setOpenId(isOpening ? message._id : null);
    if (isOpening && !message.read) onToggleRead(message, true, { silent: true });
  };

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {[
          { id: 'all', label: `All (${messages.length})` },
          { id: 'unread', label: `Unread (${messages.filter((m) => !m.read).length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`rounded-pill border px-4 py-1.5 text-sm transition-colors ${
              filter === tab.id
                ? 'border-rose bg-rose text-maroon-dark'
                : 'border-maroon-light text-body hover:border-rose hover:text-rose'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorMessage message="Couldn't load messages." />}

      {status === 'success' && (
        <ul className="flex flex-col gap-3">
          {messages.length === 0 && (
            <li className="py-8 text-center text-body">
              No messages yet — they&apos;ll show up here when someone uses the contact form.
            </li>
          )}
          {messages.length > 0 && visible.length === 0 && (
            <li className="py-8 text-center text-body">You&apos;re all caught up — no unread messages.</li>
          )}

          {visible.map((message) => {
            const isOpen = openId === message._id;
            return (
              <li
                key={message._id}
                className="overflow-hidden rounded-card border border-maroon-light bg-maroon-dark bg-card-sheen"
              >
                <button
                  type="button"
                  onClick={() => handleOpen(message)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <span className={`flex-none ${message.read ? 'text-body' : 'text-rose'}`}>
                    {message.read ? <MailOpen size={20} /> : <Mail size={20} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`truncate ${message.read ? 'text-cream' : 'font-semibold text-cream'}`}>
                        {message.name}
                      </span>
                      {!message.read && <span className="h-2 w-2 flex-none rounded-full bg-rose" aria-label="Unread" />}
                    </span>
                    <span className="block truncate text-sm text-body">{message.message}</span>
                  </span>
                  <span className="hidden flex-none text-xs text-body sm:block">{formatDate(message.createdAt)}</span>
                  <ChevronDown size={18} className={`flex-none text-body transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-maroon-light p-4 sm:px-6">
                        <p className="text-sm text-body">
                          <a href={`mailto:${message.email}`} className="text-rose hover:underline">
                            {message.email}
                          </a>
                          <span className="sm:hidden"> · {formatDate(message.createdAt)}</span>
                        </p>
                        <p className="mt-3 whitespace-pre-wrap break-words text-cream">{message.message}</p>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <a
                            href={`mailto:${message.email}?subject=${encodeURIComponent('Re: Your message on my portfolio')}`}
                            className={iconButton}
                          >
                            <Reply size={16} /> Reply
                          </a>
                          <button type="button" onClick={() => onToggleRead(message, !message.read)} className={iconButton}>
                            {message.read ? <Mail size={16} /> : <MailOpen size={16} />}
                            Mark as {message.read ? 'unread' : 'read'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(message)}
                            className={`${iconButton} hover:!border-red-500 hover:!text-red-600 dark:hover:!border-red-400 dark:hover:!text-red-400`}
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MessagesPanel;
