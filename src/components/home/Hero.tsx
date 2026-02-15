
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mandalaBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current || !contentRef.current || !mandalaBgRef.current) return;
      
      const scrollY = window.scrollY;
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
        // Parallax effect - background moves slower than foreground
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
        // Content moves up slightly for depth effect
        contentRef.current.style.transform = `translateY(${-scrollY * 0.1}px)`;
        // Rotate mandala background
        mandalaBgRef.current.style.transform = `rotate(${scrollY * 0.02}deg)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-[90vh] overflow-hidden parallax-container">
      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-spiritual-gold/20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out, pulse ${Math.random() * 3 + 2}s infinite alternate ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Mandala background element */}
      <div
        ref={mandalaBgRef}
        className="absolute top-10 right-10 w-[600px] h-[600px] opacity-10 dark:opacity-5 pointer-events-none animate-float"
        aria-hidden="true"
      >
        <img
          src="https://cdn.pixabay.com/photo/2017/03/16/21/29/mandala-2150144_960_720.png"
          alt=""
          className="w-full h-full"
        />
      </div>

      {/* Decorative Om symbols with enhanced animation */}
      <div className="om-symbol top-[20%] left-[10%] text-3xl text-spiritual-gold/60 animate-float" aria-hidden="true">🕉️</div>
      <div className="om-symbol top-[40%] right-[15%] text-3xl text-spiritual-gold/60" style={{ animationDelay: "2s" }} aria-hidden="true">🕉️</div>
      <div className="om-symbol bottom-[30%] left-[20%] text-3xl text-spiritual-gold/60" style={{ animationDelay: "4s" }} aria-hidden="true">🕉️</div>
      
      <div 
        ref={parallaxRef}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618257121238-8fd16d802a99')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-spiritual-peacock/30 to-black/50 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <div 
          ref={contentRef}
          className="indian-glass p-8 md:p-12 max-w-xl card-3d animate-fade-in backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-spiritual-saffron/20 text-spiritual-saffron text-sm mb-4 flex items-center">
            <Sparkles className="h-3 w-3 mr-1" /> आत्मिक मार्गदर्शन (Spiritual Guidance)
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-sanskrit leading-tight indian-gradient-text animate-glow">
            Find Inner Peace & Divine Connection
          </h1>
          <p className="text-white/90 mb-8 text-lg">
            Discover authentic spiritual teachings, sacred rituals, and compassionate guidance for your journey toward enlightenment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="spiritual"
              className="hover:-translate-y-1 transition-all group"
              asChild
            >
              <Link to="/services">
                Book a Consultation
                <ArrowRight className="inline-block ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <div className="relative">
              <Link to="/about">
                <Button variant="outline" className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:-translate-y-1 transition-all duration-300">
                  Learn More
                </Button>
              </Link>
              <span className="absolute -top-1 -right-1 bg-spiritual-turmeric text-white text-[10px] px-2 py-0.5 rounded-full font-medium animate-pulse">Popular</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Hero;
