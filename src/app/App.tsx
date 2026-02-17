
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/public/Index';
import About from '@/pages/public/About';
import Services from '@/pages/public/Services';
import Events from '@/pages/public/Events';
import Teachings from '@/pages/public/Teachings';
import Contact from '@/pages/public/Contact';
import Donate from '@/pages/public/Donate';
import Auth from '@/pages/auth/Auth';
import Profile from '@/pages/user/Profile';
import Admin from '@/pages/admin/Admin';
import NotFound from '@/pages/error/NotFound';
import Priests from '@/pages/priest/Priests';
import BookPriest from '@/pages/priest/BookPriest';
import PriestDashboard from '@/pages/priest/PriestDashboard';
import TrackBooking from '@/pages/priest/TrackBooking';

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
