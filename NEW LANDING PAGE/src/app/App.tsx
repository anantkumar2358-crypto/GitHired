import { ThemeProvider } from './components/ThemeProvider';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Features } from './components/Features';
import { FloatingCards } from './components/FloatingCards';
import { CallToAction } from './components/CallToAction';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors duration-500">
        <AnimatedBackground />
        
        <div className="relative z-10">
          <Navigation />
          <Hero />
          <Stats />
          <Features />
          <FloatingCards />
          <CallToAction />
        </div>
      </div>
    </ThemeProvider>
  );
}