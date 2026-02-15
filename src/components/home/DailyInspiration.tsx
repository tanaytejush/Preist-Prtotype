
import React, { useState } from 'react';
import { LinkIcon, Heart, BookOpen } from 'lucide-react';

const quotes = [
  {
    text: "The goal of meditation is not to control your thoughts, but to stop letting them control you.",
    source: "Ancient Wisdom",
    category: "Meditation"
  },
  {
    text: "In the attitude of silence the soul finds the path in a clearer light.",
    source: "Mahatma Gandhi",
    category: "Inner Peace"
  },
  {
    text: "Happiness is your nature. It is not wrong to desire it. What is wrong is seeking it outside when it is inside.",
    source: "Ramana Maharshi",
    category: "Happiness"
  },
  {
    text: "Detachment is not that you should own nothing, but that nothing should own you.",
    source: "Ali ibn Abi Talib",
    category: "Detachment"
  }
];

const DailyInspiration = () => {
  const [activeQuote, setActiveQuote] = useState(0);
  
  const nextQuote = () => {
    setActiveQuote((prev) => (prev + 1) % quotes.length);
  };
  
  const prevQuote = () => {
    setActiveQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };
  
  return (
    <div className="py-16 bg-spiritual-cream/30 dark:bg-gray-800/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground font-sanskrit mb-2">Daily Inspiration</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wisdom to guide your spiritual journey and daily life
          </p>
          <div className="mehndi-divider mx-auto max-w-xs"></div>
        </div>
        
        <div className="indian-card p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 opacity-10 dark:opacity-5">
            <img 
              src="https://cdn.pixabay.com/photo/2014/04/02/10/22/flower-303745_960_720.png" 
              alt="Decorative flower" 
              className="w-full h-full"
            />
          </div>
          
          <div className="relative z-10">
            <blockquote className="text-2xl text-foreground font-sanskrit mb-6 italic">
              "{quotes[activeQuote].text}"
            </blockquote>
            
            <div className="flex items-center justify-center mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-spiritual-saffron/10 text-spiritual-saffron text-sm">
                {quotes[activeQuote].category}
              </span>
            </div>
            
            <cite className="block text-muted-foreground">
              — {quotes[activeQuote].source}
            </cite>
            
            <div className="flex justify-center mt-8 gap-4">
              <button 
                onClick={prevQuote}
                className="p-2 rounded-full border border-spiritual-saffron/30 text-spiritual-saffron hover:bg-spiritual-saffron/10"
                aria-label="Previous quote"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={nextQuote}
                className="p-2 rounded-full border border-spiritual-saffron/30 text-spiritual-saffron hover:bg-spiritual-saffron/10"
                aria-label="Next quote"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mt-6 pt-6 border-t border-border">
            <button className="flex items-center text-muted-foreground hover:text-spiritual-saffron mr-6">
              <Heart className="h-4 w-4 mr-1" />
              <span>Like</span>
            </button>
            <button className="flex items-center text-muted-foreground hover:text-spiritual-saffron mr-6">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>Save</span>
            </button>
            <button className="flex items-center text-muted-foreground hover:text-spiritual-saffron">
              <LinkIcon className="h-4 w-4 mr-1" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyInspiration;
