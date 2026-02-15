
import React, { useState } from 'react';
import { Search, Book, FileText, Download, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample rituals data
const ritualsData = [
  {
    id: '1',
    title: 'Ganesha Puja',
    type: 'Vedic',
    description: 'Detailed procedure for invoking Lord Ganesha at the beginning of ceremonies.',
    duration: '30-45 minutes',
    materials: ['Red flowers', 'Modak', 'Durva grass', 'Sindoor', 'Coconut'],
    mantras: 8,
  },
  {
    id: '2',
    title: 'Rudra Abhishekam',
    type: 'Vedic',
    description: 'Sacred bathing ritual of Lord Shiva with detailed steps and mantras.',
    duration: '1-2 hours',
    materials: ['Bilva leaves', 'Milk', 'Honey', 'Yogurt', 'Panchamrit'],
    mantras: 14,
  },
  {
    id: '3',
    title: 'Navagraha Shanti',
    type: 'Vedic',
    description: 'Propitiatory ritual to the nine planets to remove obstacles and bestow blessings.',
    duration: '2-3 hours',
    materials: ['Nine types of grains', 'Nine colored cloths', 'Specific flowers for each planet'],
    mantras: 27,
  },
  {
    id: '4',
    title: 'Kali Puja',
    type: 'Tantric',
    description: 'Ritual worship of Goddess Kali with specific tantric procedures.',
    duration: '1-2 hours',
    materials: ['Red flowers', 'Special lamps', 'Black sesame seeds'],
    mantras: 11,
  },
  {
    id: '5',
    title: 'Griha Pravesh',
    type: 'Vedic',
    description: 'House-warming ceremony with specific rituals for new homes.',
    duration: '1-1.5 hours',
    materials: ['Coconut', 'Rice', 'Ghee', 'New pot', 'Mango leaves'],
    mantras: 6,
  },
  {
    id: '6',
    title: 'Sri Sukta Homa',
    type: 'Vedic',
    description: 'Fire ritual for prosperity and abundance using Sri Sukta verses.',
    duration: '1-2 hours',
    materials: ['Ghee', 'Wood', 'Rice', 'Red flowers'],
    mantras: 16,
  },
];

const PriestRituals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const filteredRituals = ritualsData.filter(ritual => {
    const matchesSearch = ritual.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ritual.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? ritual.type === selectedType : true;
    return matchesSearch && matchesType;
  });
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rituals..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={selectedType === null ? 'default' : 'outline'}
            onClick={() => setSelectedType(null)}
            className={selectedType === null ? 'bg-spiritual-gold hover:bg-spiritual-gold/90' : ''}
          >
            All
          </Button>
          <Button 
            variant={selectedType === 'Vedic' ? 'default' : 'outline'}
            onClick={() => setSelectedType('Vedic')}
            className={selectedType === 'Vedic' ? 'bg-spiritual-gold hover:bg-spiritual-gold/90' : ''}
          >
            Vedic
          </Button>
          <Button 
            variant={selectedType === 'Tantric' ? 'default' : 'outline'}
            onClick={() => setSelectedType('Tantric')}
            className={selectedType === 'Tantric' ? 'bg-spiritual-gold hover:bg-spiritual-gold/90' : ''}
          >
            Tantric
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRituals.map(ritual => (
          <Card key={ritual.id} className="overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-amber-50/50 dark:bg-amber-900/20">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg text-spiritual-brown dark:text-spiritual-cream">{ritual.title}</h3>
                <Badge variant="outline" className={ritual.type === 'Vedic' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}>
                  {ritual.type}
                </Badge>
              </div>
            </div>
            
            <div className="p-4 flex-grow">
              <p className="text-sm text-muted-foreground mb-3">{ritual.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-spiritual-gold" />
                  <span>Duration: {ritual.duration}</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5 text-spiritual-gold" />
                  <span>Mantras: {ritual.mantras}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-spiritual-brown dark:text-spiritual-cream">Required Materials:</p>
                <div className="flex flex-wrap gap-1">
                  {ritual.materials.map((material, idx) => (
                    <span key={idx} className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between">
                <Button variant="outline" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredRituals.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
            <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">No rituals match your search criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {setSearchTerm(''); setSelectedType(null);}} 
              className="mt-2 text-spiritual-gold"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Add Clock icon since it's missing
const Clock = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};

export default PriestRituals;
