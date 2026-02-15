
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Events from '@/pages/Events';
import Teachings from '@/pages/Teachings';
import Contact from '@/pages/Contact';
import Donate from '@/pages/Donate';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import Priests from '@/pages/Priests';
import BookPriest from '@/pages/BookPriest';
import PriestDashboard from '@/pages/PriestDashboard';
import TrackBooking from '@/pages/TrackBooking';

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Reduce retries to avoid error loops
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/events" element={<Events />} />
              <Route path="/teachings" element={<Teachings />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/priests" element={<Priests />} />
              <Route path="/book-priest/:id" element={<BookPriest />} />
              <Route path="/priest-dashboard" element={<PriestDashboard />} />
              <Route path="/track-booking/:id" element={<TrackBooking />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
