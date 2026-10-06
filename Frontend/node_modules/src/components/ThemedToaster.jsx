import { Toaster } from 'react-hot-toast';

// Toast notifications styled with the theme CSS variables, so they follow
// light/dark mode. Shared by the public layout and the admin dashboard.
const ThemedToaster = () => (
  <Toaster
    position="bottom-right"
    toastOptions={{
      style: {
        background: 'rgb(var(--c-maroon-dark))',
        color: 'rgb(var(--c-cream))',
        border: '1px solid rgb(var(--c-maroon-light))',
      },
    }}
  />
);

export default ThemedToaster;
