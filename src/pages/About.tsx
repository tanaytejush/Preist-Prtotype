
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="relative py-16 bg-spiritual-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-spiritual-brown font-sanskrit mb-4">About Our Priest</h1>
              <p className="text-spiritual-brown/80 max-w-3xl mx-auto">
                A journey of devotion, learning, and service to the spiritual community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="spiritual-card">
                <img 
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
                  alt="Portrait of our priest in meditation" 
                  className="w-full h-auto rounded-lg mb-6"
                />
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1582562124811-c09040d0a901" 
                    alt="Priest conducting a ceremony" 
                    className="w-full h-auto rounded-lg"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
                    alt="Priest with devotees" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-sanskrit text-spiritual-brown">A Spiritual Journey</h2>
                <p className="text-spiritual-brown/80">
                  From a very young age, our priest demonstrated a profound connection to the spiritual realm. 
                  Born into a family with deep religious roots, he began his formal spiritual education at the age of eight, 
                  studying ancient texts and learning traditional rituals under the guidance of respected spiritual masters.
                </p>
                
                <p className="text-spiritual-brown/80">
                  After completing his formal studies, he embarked on a journey of self-discovery, spending several years in 
                  deep meditation and contemplation in the Himalayan mountains. This period of intense spiritual practice 
                  transformed his understanding and allowed him to connect with divine wisdom in a profound way.
                </p>
                
                <h2 className="text-2xl font-sanskrit text-spiritual-brown">Educational Background</h2>
                <ul className="list-disc pl-5 text-spiritual-brown/80 space-y-2">
                  <li>Master's degree in Vedic Studies from the University of Spiritual Sciences</li>
                  <li>Advanced certification in Sanskrit and Ancient Texts</li>
                  <li>Specialized training in meditation techniques and energy healing</li>
                  <li>Studied comparative religion and philosophy</li>
                </ul>
                
                <h2 className="text-2xl font-sanskrit text-spiritual-brown">Our Mission</h2>
                <p className="text-spiritual-brown/80">
                  Today, our priest is dedicated to sharing the timeless wisdom and practices that have transformed his own life. 
                  He believes that spirituality should be accessible to all and strives to present complex spiritual concepts in 
                  practical, understandable ways that can be integrated into modern life.
                </p>
                
                <p className="text-spiritual-brown/80">
                  His mission is to help individuals connect with their inner divinity, find peace amidst life's challenges, 
                  and create harmonious relationships with themselves, others, and the universe.
                </p>
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-2xl font-sanskrit text-spiritual-brown text-center mb-8">Words from Our Community</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="spiritual-card">
                  <p className="text-spiritual-brown/80 italic mb-4">
                    "The priest's guidance helped me navigate the most difficult period of my life with grace and inner strength. 
                    His wisdom continues to be a guiding light in my spiritual journey."
                  </p>
                  <p className="text-right text-spiritual-brown font-medium">- Maria Santos</p>
                </div>
                
                <div className="spiritual-card">
                  <p className="text-spiritual-brown/80 italic mb-4">
                    "I've attended many spiritual workshops, but none have been as transformative as those led by our priest. 
                    His ability to explain complex concepts in simple terms has changed my perspective on life."
                  </p>
                  <p className="text-right text-spiritual-brown font-medium">- James Peterson</p>
                </div>
                
                <div className="spiritual-card">
                  <p className="text-spiritual-brown/80 italic mb-4">
                    "The family blessing ceremony conducted by the priest brought such harmony to our home. His genuine care 
                    and spiritual insight have made a lasting impact on our entire family."
                  </p>
                  <p className="text-right text-spiritual-brown font-medium">- The Kumar Family</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
