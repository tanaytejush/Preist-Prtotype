
import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Smartphone, Landmark, Heart, Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DonatePreview = () => {
  return (
    <div className="relative py-20">
      {/* Background with improved overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618202133208-2907bebba9e1')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-gradient-to-r from-spiritual-peacock/70 to-spiritual-saffron/50 backdrop-blur-sm"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">🙏</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '3s' }}>✨</div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-sanskrit mb-4">Support Our Temple</h2>
          <div className="flex items-center justify-center">
            <div className="h-px w-16 bg-white/50"></div>
            <Heart className="mx-4 text-white h-6 w-6 animate-pulse" />
            <div className="h-px w-16 bg-white/50"></div>
          </div>
          <p className="text-white/90 max-w-2xl mx-auto mt-4 text-lg">
            Your generous contribution (दान) helps us continue providing spiritual guidance, 
            maintain our sacred spaces, and support community programs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card-3d indian-card bg-white/90 dark:bg-gray-800/60 text-center p-6 flex flex-col h-full justify-between">
            <div>
              <div className="rounded-full bg-spiritual-saffron/10 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Gift className="text-spiritual-saffron text-2xl" />
              </div>
              <h3 className="font-sanskrit text-xl text-foreground mb-2">Light a Diya</h3>
              <p className="text-muted-foreground mb-4">
                Offer a virtual lamp as a symbol of your prayer or intention.
              </p>
              <p className="font-medium text-foreground mb-6">₹251</p>
            </div>
            <Button variant="spiritual" size="sm" asChild className="transition-all hover:scale-105">
              <Link to="/donate">Offer Now</Link>
            </Button>
          </div>
          
          <div className="card-3d indian-card bg-white/90 dark:bg-gray-800/60 text-center p-6 transform scale-105 border-2 border-spiritual-turmeric/50 dark:border-spiritual-turmeric/30 flex flex-col h-full justify-between shadow-lg">
            <div className="absolute top-0 right-0 bg-spiritual-turmeric text-white text-xs px-3 py-1 font-medium rounded-bl-lg rounded-tr-xl">Popular</div>
            <div>
              <div className="rounded-full bg-spiritual-turmeric/10 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Star className="text-spiritual-turmeric text-2xl" />
              </div>
              <h3 className="font-sanskrit text-xl text-foreground mb-2">Monthly Seva</h3>
              <p className="text-muted-foreground mb-4">
                Become a monthly supporter and receive special blessings in your name.
              </p>
              <p className="font-medium text-foreground mb-6">₹1,108/month</p>
            </div>
            <Button size="sm" asChild className="transition-all hover:scale-105 bg-spiritual-turmeric hover:bg-spiritual-turmeric/90 text-white">
              <Link to="/donate">Subscribe</Link>
            </Button>
          </div>
          
          <div className="card-3d indian-card bg-white/90 dark:bg-gray-800/60 text-center p-6 flex flex-col h-full justify-between">
            <div>
              <div className="rounded-full bg-spiritual-saffron/10 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Heart className="text-spiritual-saffron text-2xl" />
              </div>
              <h3 className="font-sanskrit text-xl text-foreground mb-2">Temple Offering</h3>
              <p className="text-muted-foreground mb-4">
                Contribute to the maintenance and beautification of our sacred space.
              </p>
              <p className="font-medium text-foreground mb-6">₹2,100</p>
            </div>
            <Button variant="spiritual" size="sm" asChild className="transition-all hover:scale-105">
              <Link to="/donate">Donate</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="indian-glass p-8 max-w-2xl mx-auto rounded-2xl backdrop-blur-md">
            <h3 className="text-white font-sanskrit text-xl mb-6">Payment Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-3d flex flex-col items-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-md hover:shadow-lg transition-all">
                <CreditCard className="h-8 w-8 text-white mb-3" />
                <p className="text-white text-sm font-medium">Credit/Debit Card</p>
              </div>
              <div className="card-3d flex flex-col items-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-md hover:shadow-lg transition-all">
                <Smartphone className="h-8 w-8 text-white mb-3" />
                <p className="text-white text-sm font-medium">UPI/PhonePe/GPay</p>
              </div>
              <div className="card-3d flex flex-col items-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-md hover:shadow-lg transition-all">
                <Landmark className="h-8 w-8 text-white mb-3" />
                <p className="text-white text-sm font-medium">Bank Transfer</p>
              </div>
            </div>
            <div className="mt-6 p-3 bg-white/20 rounded-lg inline-block">
              <p className="text-white text-sm">All donations eligible for tax benefits under Section 80G</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePreview;
