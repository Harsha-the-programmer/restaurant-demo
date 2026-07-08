import { useEffect, useState, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Experience from './components/Experience';
import Gallery from './components/Gallery';
import Reservation from './components/Reservation';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import { GlobalCanvas } from './components/GlobalCanvas';
import { LoadingScreen } from './components/LoadingScreen';
import { DeviceCapabilities, HeroFallback } from './components/DeviceCapabilities';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <DeviceCapabilities />
      <GlobalCanvas />
      <Suspense fallback={<LoadingScreen />}>
        {!isLoaded && <LoadingScreen />}
        <Cursor />
        <Navbar />
        <main style={{ paddingTop: 'var(--nav-height)' }}>
          <Hero fallback={<HeroFallback />} />
          <About />
          <Menu />
          <Experience />
          <Gallery />
          <Reservation />
        </main>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;