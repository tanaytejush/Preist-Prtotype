
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Home, Flower, CloudSun } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ServicesAPI, Service } from '@/services/supabase/supabaseUtils';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, any> = {
  "✨": Sparkles,
  "🏠": Home,
  "🌸": Flower,
  "☀️": CloudSun,
  // Add more mappings as needed for other emoji icons
};

const ServicesPreview = () => {
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['servicesPreview'],
    queryFn: async () => {
      const allServices = await ServicesAPI.getAll();
      
      // If we have services from the database, transform them for display
      if (allServices.length > 0) {
        // Take 4 services for preview
        return allServices.slice(0, 4).map((service, index) => ({
          ...service,
          featured: index === 0, // Make the first one featured
        }));
      }
      
      // Mock data as fallback (make sure featured property is included)
      return [
        {
          id: "1",
          title: "Spiritual Consultation",
          description: "One-on-one guidance for your spiritual journey and personal challenges.",
          duration: "60 minutes",
          price: "₹999",
          icon: "✨",
          featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2",
          title: "Sacred Rituals",
          description: "Traditional ceremonies for healing, spiritual cleansing and life events.",
          duration: "90 minutes",
          price: "₹2,499",
          icon: "🌸",
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "3",
          title: "Family Blessings",
          description: "Special prayers and rituals to bring harmony and prosperity to your home.",
          duration: "60 minutes",
          price: "₹1,499",
          icon: "🏠",
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "4",
          title: "Yoga & Meditation",
          description: "Learn ancient meditation techniques for inner peace and spiritual growth.",
          duration: "60 minutes",
          price: "₹799",
          icon: "☀️",
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Helper function to get the icon component
  const getIconComponent = (iconString: string) => {
    if (iconMap[iconString]) {
      return iconMap[iconString];
    }
    // Default icon if no mapping found
    return Sparkles;
  };

  return (
    <div className="py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-16 -left-16 w-48 h-48 opacity-10 dark:opacity-5 rotate-12 animate-float">
        <img 
          src="https://cdn.pixabay.com/photo/2014/03/24/17/15/ornament-295293_960_720.png" 
          alt="Decorative paisley" 
          className="w-full h-full"
        />
      </div>
      <div className="absolute -bottom-16 -right-16 w-48 h-48 opacity-10 dark:opacity-5 -rotate-12 animate-float">
        <img 
          src="https://cdn.pixabay.com/photo/2014/03/24/17/15/ornament-295293_960_720.png" 
          alt="Decorative paisley" 
          className="w-full h-full"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-spiritual-saffron text-sm uppercase tracking-wider font-medium mb-2 inline-block">Our Offerings</span>
          <h2 className="text-3xl font-bold text-foreground font-sanskrit mb-2 sacred-heading">Divine Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our range of spiritual services designed to support your journey toward inner peace, 
            balance, and connection with the divine.
          </p>
          <div className="mehndi-divider mx-auto max-w-xs animate-glow"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon);
            
            return (
              <div 
                key={service.id} 
                className={`${service.featured ? 'featured-card transform scale-105 z-10' : 'indian-card'} p-6 flex flex-col h-full card-3d animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {service.featured && (
                  <div className="absolute top-0 right-0 bg-spiritual-gold text-white text-xs px-3 py-1 font-medium">
                    Popular
                  </div>
                )}
                <div className={`${service.featured ? 'bg-spiritual-gold/20' : 'bg-spiritual-saffron/10'} dark:bg-spiritual-saffron/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                  <IconComponent className={`h-6 w-6 ${service.featured ? 'text-spiritual-gold' : 'text-spiritual-saffron'}`} />
                </div>
                <h3 className="text-xl font-sanskrit text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{service.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-foreground">{service.price}</span>
                  <Link to="/services" className="indian-link">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="spiritual" asChild className="hover:-translate-y-1 transition-transform duration-300">
            <Link to="/services">View All Services</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            * All services available online and in-person in Delhi, Mumbai, Bangalore, and other major cities
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesPreview;
