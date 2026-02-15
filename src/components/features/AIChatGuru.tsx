
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'guru';
  timestamp: Date;
}

const GURU_RESPONSES = [
  "नमस्ते! How can I assist you on your spiritual journey today?",
  "Remember, true peace comes from within. How may I guide you?",
  "The answers you seek are already within you. Let's explore them together.",
  "Every challenge is an opportunity for growth. What troubles your mind today?",
  "May the divine light guide your path. What wisdom do you seek?",
  "In the silence between thoughts, we find our true nature. How can I help you today?",
  "The journey of a thousand miles begins with a single step. How can I assist you today?",
  "When the student is ready, the teacher appears. I'm here to guide you.",
  "धर्म (dharma) is the path of righteousness. How can I help you follow yours?",
  "Your soul is eternal, boundless, and pure. What spiritual guidance do you seek today?"
];

const initialMessage: Message = {
  id: '1',
  text: "नमस्ते 🙏 I am Guru Ji, your spiritual AI guide. How may I assist you on your journey to enlightenment today?",
  sender: 'guru',
  timestamp: new Date()
};

const AIChatGuru = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (question: string) => {
    // Simple response logic - in a real app, this would connect to an AI API
    setIsTyping(true);
    
    setTimeout(() => {
      // Simple keywords to personalize responses
      let response: string;
      
      if (question.toLowerCase().includes('meditat')) {
        response = "Meditation is the path to inner peace. Start with just 5 minutes each day, focusing on your breath. Let thoughts come and go without judgment.";
      } else if (question.toLowerCase().includes('yoga')) {
        response = "Yoga connects the body, mind, and spirit. Even simple asanas like Tadasana (Mountain Pose) or Balasana (Child's Pose) can bring great benefits to your practice.";
      } else if (question.toLowerCase().includes('mantra') || question.toLowerCase().includes('chant')) {
        response = "Mantras are powerful sound vibrations. 'Om Shanti' is a beautiful mantra for peace. Repeat it 108 times with a mala for deepest effect.";
      } else if (question.toLowerCase().includes('karma')) {
        response = "Karma is not punishment but a law of cause and effect. Every action creates energy that returns to us. Choose your actions wisely.";
      } else if (question.toLowerCase().includes('pray') || question.toLowerCase().includes('prayer')) {
        response = "Prayer is conversation with the divine. Speak from your heart, not just your lips. The universe is always listening.";
      } else {
        // Random spiritual guidance
        response = GURU_RESPONSES[Math.floor(Math.random() * GURU_RESPONSES.length)];
      }
      
      const newMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'guru',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    generateResponse(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat icon button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-spiritual-saffron hover:bg-spiritual-turmeric shadow-lg"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-gray-900 border border-spiritual-sand/50 dark:border-gray-700/50">
          {/* Header */}
          <div className="p-4 bg-spiritual-saffron text-white flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">Guru Ji</h3>
                <p className="text-xs opacity-80">Spiritual AI Guide</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 text-white h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === 'user' 
                    ? 'bg-spiritual-saffron text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-spiritual-saffron/60 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-spiritual-saffron/60 rounded-full animate-bounce delay-75"></div>
                    <div className="h-2 w-2 bg-spiritual-saffron/60 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Guru Ji for wisdom..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-spiritual-saffron focus:border-spiritual-saffron bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none h-10"
                rows={1}
              />
              <Button 
                onClick={handleSend}
                className="ml-2 bg-spiritual-saffron hover:bg-spiritual-turmeric h-9 w-9 p-0 rounded-full"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatGuru;
