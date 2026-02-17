
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Hero from '../../components/home/Hero';
import DailyInspiration from '../../components/home/DailyInspiration';
import ServicesPreview from '../../components/home/ServicesPreview';
import Testimonials from '../../components/home/Testimonials';
import DonatePreview from '../../components/home/DonatePreview';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const Index = () => {
  // Add smooth scrolling effect
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Simple parallax effect for scroll sections with improved performance
  useEffect(() => {
    const handleScroll = () => {
      const scrollSections = document.querySelectorAll('.scroll-section');
      const scrollY = window.scrollY;
      
      scrollSections.forEach((section, index) => {
        const sectionElement = section as HTMLElement;
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
          // Reduced the effect for better visual appearance and to avoid footer issues
          const speed = index % 2 === 0 ? 0.01 : -0.01;
          sectionElement.style.transform = `translateY(${scrollY * speed}px)`;
        });
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-secondary/30">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <section className="scroll-section relative z-10">
          <DailyInspiration />
        </section>
        
        {/* Priest Booking Section - Moved to top */}
        <section className="scroll-section relative z-10 py-16 bg-amber-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-spiritual-brown mb-4">Connect with Our Priests</h2>
              <p className="text-lg text-spiritual-brown/80 mb-8">
                Book personalized services with our experienced priests for home pujas, ceremonies, 
                consultations, and spiritual guidance.
              </p>
              <Link to="/priests">
                <Button className="bg-spiritual-gold hover:bg-spiritual-gold/90 text-white">
                  <Users className="mr-2 h-4 w-4" />
                  Browse Our Priests
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="scroll-section relative z-10">
          <ServicesPreview />
        </section>
        <section className="scroll-section relative z-10">
          <Testimonials />
        </section>
        <section className="scroll-section relative z-10 pb-16">
          <DonatePreview />
        </section>
        
        {/* Increased spacer to ensure footer visibility */}
        <div className="h-24"></div>
      </main>
      <Footer className="relative z-20" />
    </div>
  );
};

export default Index;
