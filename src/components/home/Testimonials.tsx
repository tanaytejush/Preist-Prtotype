
import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "My spiritual consultation with the priest was truly life-changing. His wisdom and compassionate guidance helped me navigate a difficult period in my life.",
    name: "Sarah Johnson",
    title: "Community Member",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    quote: "The family blessing ceremony brought such peace and harmony to our home. We are deeply grateful for the priest's genuine care and spiritual support.",
    name: "Michael & Lisa Chen",
    title: "Devotees",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg"
  },
  {
    quote: "I've attended many spiritual retreats, but none have been as transformative as the meditation sessions led by this wonderful priest. His teachings resonate at a profound level.",
    name: "David Williams",
    title: "Spiritual Seeker",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg"
  },
  {
    quote: "The priest's ability to explain complex spiritual concepts in simple, practical terms has helped me integrate spiritual practices into my daily life with remarkable results.",
    name: "Priya Sharma",
    title: "Regular Attendee",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activeIndex]);
  
  const nextTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const prevTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  return (
    <div className="bg-gradient-to-b from-spiritual-cream to-spiritual-sand/50 py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-4xl text-spiritual-gold/20 animate-float">🕉️</div>
      <div className="absolute bottom-10 right-10 text-4xl text-spiritual-gold/20 animate-float" style={{ animationDelay: '2s' }}>☸️</div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-spiritual-brown font-sanskrit mb-4">Voices of Our Community</h2>
          <div className="flex items-center justify-center">
            <div className="h-px w-16 bg-spiritual-gold/50"></div>
            <MessageSquare className="mx-4 text-spiritual-gold h-6 w-6" />
            <div className="h-px w-16 bg-spiritual-gold/50"></div>
          </div>
          <p className="text-spiritual-brown/80 max-w-2xl mx-auto mt-4 text-lg">
            Hear from those whose lives have been touched by spiritual guidance and divine connection.
          </p>
        </div>
        
        <div className="card-3d max-w-4xl mx-auto relative bg-white/80 dark:bg-gray-800/50 rounded-xl shadow-xl p-8 border border-spiritual-gold/20">
          <Quote className="absolute text-spiritual-gold/20 h-24 w-24 -top-5 -left-5 transform -rotate-12" />
          
          <div className="relative h-[280px] sm:h-[220px] w-full overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`absolute top-0 left-0 right-0 transition-all duration-500 ${
                  index === activeIndex 
                    ? 'opacity-100 translate-x-0 z-10' 
                    : index < activeIndex 
                      ? 'opacity-0 -translate-x-full z-0' 
                      : 'opacity-0 translate-x-full z-0'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="h-20 w-20 rounded-full object-cover border-2 border-spiritual-gold/50 shadow-md"
                    />
                  </div>
                  <div>
                    <p className="text-spiritual-brown text-lg italic mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div>
                        <p className="font-semibold text-spiritual-brown">{testimonial.name}</p>
                        <p className="text-spiritual-brown/70 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === activeIndex ? 'bg-spiritual-gold' : 'bg-spiritual-gold/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-6 absolute -bottom-6 left-1/2 transform -translate-x-1/2 space-x-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white border border-spiritual-gold/30 text-spiritual-brown hover:bg-spiritual-gold/10 shadow-md transition-all"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white border border-spiritual-gold/30 text-spiritual-brown hover:bg-spiritual-gold/10 shadow-md transition-all"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
