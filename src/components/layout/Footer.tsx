
import React from 'react';
import { Github, Mail, Twitter, Facebook, Instagram, Phone, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`bg-spiritual-cream dark:bg-gray-900 py-12 ${className} border-t border-spiritual-gold/10 dark:border-gray-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-spiritual-brown dark:text-gray-200 font-sanskrit">About Us</h3>
            <p className="text-spiritual-brown/70 dark:text-gray-400">
              We are dedicated to providing enriching spiritual guidance and fostering a community of seekers on their path to inner peace and spiritual growth.
            </p>
            <div className="flex flex-wrap space-x-4">
              <a href="#" className="text-spiritual-brown hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-spiritual-brown hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-spiritual-brown hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-spiritual-brown hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="mailto:info@spiritualcenter.com" className="text-spiritual-brown hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-spiritual-brown dark:text-gray-200 mb-4 font-sanskrit">Quick Links</h3>
            <div className="grid grid-cols-2">
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-spiritual-brown/70 hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-spiritual-brown/70 hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-spiritual-brown/70 hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-spiritual-brown/70 hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                    Events
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <Link to="/teachings" className="text-spiritual-brown/70 hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                    Teachings
                  </Link>
                </li>
                <li>
                  <Link to="/donate" className="text-spiritual-brown/70 hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                    Donate
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-spiritual-brown/70 hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="text-spiritual-brown/70 hover:text-spiritual-gold dark:text-gray-400 dark:hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-spiritual-brown dark:text-gray-200 mb-4 font-sanskrit">Contact Us</h3>
            <address className="not-italic space-y-2 text-spiritual-brown/70 dark:text-gray-400">
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>1234 Spiritual Lane, Serenity, CA 90210</span>
              </p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="mailto:info@spiritualcenter.com" className="hover:text-spiritual-gold dark:hover:text-white transition-colors">
                  info@spiritualcenter.com
                </a>
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="tel:+11234567890" className="hover:text-spiritual-gold dark:hover:text-white transition-colors">
                  (123) 456-7890
                </a>
              </p>
            </address>
            <div className="mt-4 pt-4 border-t border-spiritual-gold/10 dark:border-gray-700">
              <h4 className="font-sanskrit text-spiritual-brown dark:text-gray-300 mb-2">Hours</h4>
              <p className="text-spiritual-brown/70 dark:text-gray-400 text-sm">
                Monday - Friday: 9AM - 7PM<br />
                Weekends: 10AM - 5PM
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-spiritual-gold/10 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-spiritual-brown/60 dark:text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} Spiritual Center. All rights reserved.
          </p>
          <p className="text-center text-spiritual-brown/60 dark:text-gray-500 flex items-center text-sm">
            Made with <Heart className="h-3 w-3 mx-1 text-spiritual-gold" /> by Divine Guidance Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
