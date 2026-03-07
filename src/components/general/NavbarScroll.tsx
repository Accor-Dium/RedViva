import { useState, useEffect } from 'react';

export default function NavbarScroll() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (hasScrolled) {
        navbar.classList.add('bg-black/50', 'backdrop-blur-md');
        navbar.classList.remove('bg-transparent');
      } else {
        navbar.classList.remove('bg-black/50', 'backdrop-blur-md');
        navbar.classList.add('bg-transparent');
      }
    }
  }, [hasScrolled]);

  return null;
}
