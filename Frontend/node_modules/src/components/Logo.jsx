import logoMark from '../assets/logo-mark.png';

// The "MP" monogram. The PNG is only a transparent shape (an alpha mask); the
// color comes from CSS (`bg-cream`), so it automatically follows light/dark
// theme and can change color on hover via the parent's `group` class.
const Logo = ({ className = 'h-8' }) => (
  <span
    role="img"
    aria-label="Maitri Patel logo"
    className={`block aspect-[792/390] bg-cream transition-colors duration-200 group-hover:bg-rose ${className}`}
    style={{
      WebkitMaskImage: `url(${logoMark})`,
      maskImage: `url(${logoMark})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'left center',
      maskPosition: 'left center',
    }}
  />
);

export default Logo;
