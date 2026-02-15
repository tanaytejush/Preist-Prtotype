
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Calendar, User, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TeachingsAPI, Teaching } from '@/api/supabaseUtils';

// Teaching images mapping
const teachingImages = [
  "https://images.unsplash.com/photo-1581974944026-5d6ed762f617?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605369179590-014a88d4560e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1000&auto=format&fit=crop"
];

const Teachings = () => {
  const [selectedTeaching, setSelectedTeaching] = useState<Teaching | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: teachings = [], isLoading, error } = useQuery({
    queryKey: ['teachings'],
    queryFn: async () => {
      const data = await TeachingsAPI.getAll();
      
      // If no teachings, return mock data with images
      if (data.length === 0) {
        return [
          {
            id: "1",
            title: "Understanding the Bhagavad Gita",
            author: "Swami Vivekananda",
            date: "2023-10-15",
            description: "An exploration of the profound wisdom in the Bhagavad Gita and its application in modern life.",
            category: "Scripture",
            content: "The Bhagavad Gita, often referred to as the Gita, is a 700-verse Hindu scripture that is part of the epic Mahabharata. This ancient text contains a conversation between Pandava prince Arjuna and his guide and charioteer Krishna on a variety of philosophical issues.\n\nThe Bhagavad Gita presents a synthesis of Hindu ideas about dharma, theistic bhakti, and the yogic ideals of moksha. The text covers various topics, addressing the questions about life, philosophy, and spirituality.\n\nIn this teaching, we'll explore how the wisdom of the Gita can be applied to modern challenges and personal growth. The dialogue between Krishna and Arjuna provides insights into duty, righteousness, and the nature of the self that remain relevant today.",
            imageUrl: teachingImages[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "2",
            title: "The Practice of Mindfulness Meditation",
            author: "Dr. Acharya Shanti",
            date: "2023-09-28",
            description: "Learn the fundamental techniques of mindfulness meditation and its benefits for mental clarity and emotional balance.",
            category: "Practices",
            content: "Mindfulness meditation is a mental training practice that involves focusing your mind on your experiences (like your own breathing, bodily sensations, thoughts, or feelings) in the present moment, without judgment.\n\nThis practice has roots in Buddhist meditation principles but has evolved into a secular practice that is now widely used for stress reduction, pain management, and overall mental health improvement.\n\nIn this teaching, we will explore various mindfulness techniques that you can incorporate into your daily life, including breath awareness, body scan meditation, and mindful walking.\n\nRegular mindfulness practice has been scientifically proven to reduce stress, increase focus, improve emotional regulation, and enhance overall well-being.",
            imageUrl: teachingImages[1],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "3",
            title: "The Philosophy of Advaita Vedanta",
            author: "Guru Ram Das",
            date: "2023-11-05",
            description: "Exploring the non-dualistic philosophy of Advaita Vedanta and its perspective on reality, consciousness, and the self.",
            category: "Philosophy",
            content: "Advaita Vedanta is one of the most influential sub-schools of the Vedanta school of Hindu philosophy. The term 'Advaita' refers to the idea that the soul (true Self, Atman) and the Absolute (Brahman) are one and the same.\n\nAccording to this philosophy, the perceived duality between individual consciousness and universal consciousness is an illusion (Maya). The ultimate goal is to transcend this illusion through spiritual practices that lead to direct realization of one's true nature.\n\nIn this teaching, we will delve into the core principles of Advaita Vedanta as expounded by its most famous exponent, Adi Shankaracharya. We will discuss concepts such as Brahman, Maya, and the path to self-realization through knowledge (jnana).\n\nUnderstanding these principles can transform your perspective on existence and lead to profound inner peace and freedom from suffering.",
            imageUrl: teachingImages[2],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "4",
            title: "Sacred Symbols in Hindu Tradition",
            author: "Pandit Rajesh Kumar",
            date: "2023-10-22",
            description: "Understanding the meaning and significance of important symbols in Hindu spiritual traditions.",
            category: "Symbolism",
            content: "Hindu tradition is rich with sacred symbols that carry profound spiritual meanings. These symbols are not merely decorative but are visual representations of complex philosophical concepts and divine energies.\n\nIn this teaching, we will explore the meaning and significance of important Hindu symbols such as Om (ॐ), the sacred sound and symbol representing the essence of the universe; the Swastika, an ancient symbol of good fortune and well-being; the Lotus flower, representing purity and spiritual awakening; and many more.\n\nWe will also discuss how these symbols are used in meditation, rituals, and daily practices to deepen spiritual connection and understanding. By understanding these sacred symbols, you can enrich your spiritual practice and connect more deeply with the divine essence they represent.",
            imageUrl: teachingImages[3],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "5",
            title: "Ayurvedic Principles for Modern Living",
            author: "Dr. Maya Sharma",
            date: "2023-11-12",
            description: "Applying the ancient wisdom of Ayurveda to create balance and wellness in contemporary life.",
            category: "Lifestyle",
            content: "Ayurveda, meaning 'science of life,' is one of the world's oldest holistic healing systems, developed in India thousands of years ago. This ancient wisdom offers a comprehensive approach to health that integrates body, mind, and spirit.\n\nAt the core of Ayurvedic philosophy are the three doshas—Vata, Pitta, and Kapha—which are energetic forces that make up every individual in different proportions. Understanding your unique doshic constitution is key to creating a lifestyle that supports your natural tendencies and addresses imbalances.\n\nIn this teaching, we will explore how Ayurvedic principles can be applied to modern living, including daily routines (dinacharya), seasonal practices (ritucharya), nutrition, exercise, and stress management appropriate for different constitutional types.\n\nBy incorporating these ancient practices into your contemporary lifestyle, you can enhance your physical health, mental clarity, and spiritual well-being in a way that honors your individual nature and needs.",
            imageUrl: teachingImages[4],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "6",
            title: "The Art of Mantra Meditation",
            author: "Swami Ananda",
            date: "2023-09-18",
            description: "Discover the transformative power of sacred sound through the practice of mantra meditation.",
            category: "Meditation",
            content: "Mantra meditation is a powerful spiritual practice that uses sacred sounds, words, or phrases to focus and quiet the mind. The word 'mantra' comes from Sanskrit: 'man' meaning mind, and 'tra' meaning vehicle or instrument—a mantra is an instrument of the mind.\n\nIn various spiritual traditions, particularly in Hinduism and Buddhism, mantras are considered to have special energetic and vibrational qualities that can transform consciousness when repeated with intention and awareness.\n\nIn this teaching, we will explore the science of sacred sound and learn how to practice different forms of mantra meditation, including japa (repetition of a mantra), kirtan (devotional chanting), and ajapa japa (spontaneous mantra awareness).\n\nWe will discuss some of the most powerful traditional mantras, their meanings, and the specific benefits they offer. Whether you're new to meditation or looking to deepen your existing practice, mantra meditation offers a accessible yet profound path to inner peace and spiritual awakening.",
            imageUrl: teachingImages[5],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      // Add images to teachings if they don't have one
      return data.map((teaching, index) => {
        if (!teaching.imageUrl || teaching.imageUrl === "/placeholder.svg") {
          teaching.imageUrl = teachingImages[index % teachingImages.length];
        }
        return teaching;
      });
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading teachings",
        description: "There was an error loading the teachings. Please try again later.",
        variant: "destructive"
      });
      console.error("Error fetching teachings:", error);
    }
  }, [error, toast]);

  const handleReadTeaching = async (teachingId: string) => {
    try {
      // First try to find the teaching in the already fetched data
      let teaching = teachings.find(t => t.id === teachingId);
      
      // If not found or we want to ensure we have the most up-to-date data,
      // fetch it from the backend
      if (!teaching) {
        teaching = await TeachingsAPI.getById(teachingId);
        if (!teaching) {
          throw new Error('Teaching not found');
        }
      }
      
      setSelectedTeaching(teaching);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Failed to load teaching details:", err);
      toast({
        title: "Error",
        description: "Failed to load teaching details. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-spiritual-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-sanskrit text-spiritual-brown mb-4">Sacred Teachings</h1>
            <p className="text-xl text-spiritual-brown/80 max-w-3xl mx-auto">
              Explore our collection of spiritual wisdom, ancient texts, and modern interpretations to guide your spiritual journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, index) => (
                <Card key={index} className="h-96 bg-white/50 animate-pulse">
                  <div className="h-full"></div>
                </Card>
              ))
            ) : teachings.length === 0 ? (
              <Card className="col-span-full p-8 text-center">
                <p className="text-spiritual-brown/70">No teachings available at the moment. Please check back later.</p>
              </Card>
            ) : (
              teachings.map((teaching) => (
                <Card key={teaching.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  <div className="aspect-video bg-spiritual-sand/30 relative">
                    <img 
                      src={teaching.imageUrl} 
                      alt={teaching.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-spiritual-gold/90 text-white text-xs px-2 py-1 rounded">
                      {teaching.category}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-sanskrit text-spiritual-brown">{teaching.title}</CardTitle>
                    <CardDescription className="flex items-center text-spiritual-brown/70">
                      <User className="h-4 w-4 mr-1" /> {teaching.author}
                    </CardDescription>
                    <CardDescription className="flex items-center text-spiritual-brown/70">
                      <Calendar className="h-4 w-4 mr-1" /> {new Date(teaching.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className="text-spiritual-brown/80">{teaching.description}</p>
                  </CardContent>
                  
                  <div className="p-4 pt-0 mt-auto">
                    <Button 
                      className="w-full bg-spiritual-gold hover:bg-spiritual-gold/90 text-white"
                      onClick={() => handleReadTeaching(teaching.id)}
                    >
                      <Book className="h-4 w-4 mr-2" /> Read Teaching
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer className="w-full mt-auto" />

      {/* Teaching Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-sanskrit text-spiritual-brown">
              {selectedTeaching?.title}
            </DialogTitle>
            <DialogDescription className="flex flex-col sm:flex-row sm:justify-between text-spiritual-brown/70">
              <span className="flex items-center"><User className="h-4 w-4 mr-1" /> {selectedTeaching?.author}</span>
              <span className="flex items-center mt-1 sm:mt-0"><Calendar className="h-4 w-4 mr-1" /> {selectedTeaching && new Date(selectedTeaching.date).toLocaleDateString()}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <div className="bg-spiritual-sand/30 p-4 rounded-md">
              <div 
                className="prose prose-sm sm:prose max-w-none text-spiritual-brown/80"
                dangerouslySetInnerHTML={{ 
                  __html: selectedTeaching?.content
                    .split('\n').map(para => `<p>${para}</p>`).join('') || '' 
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="mr-2">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachings;
