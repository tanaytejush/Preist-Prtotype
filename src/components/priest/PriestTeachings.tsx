
import React, { useState } from 'react';
import { Search, BookOpen, FileText, Download, Filter, CheckCircle, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

// Sample teachings data
const teachingsData = [
  {
    id: '1',
    title: 'Bhagavad Gita Chapter 12 Commentary',
    category: 'Scripture',
    level: 'Advanced',
    language: 'Sanskrit & English',
    description: 'In-depth analysis of the Bhakti Yoga chapter with word-by-word translations and practical insights.',
    lastUpdated: '2025-04-01',
    format: 'PDF',
    imageUrl: '/teaching-gita.jpg',
  },
  {
    id: '2',
    title: 'Introduction to Meditation',
    category: 'Practices',
    level: 'Beginner',
    language: 'English',
    description: 'A guide for teaching basic meditation techniques suitable for beginners, with visual aids.',
    lastUpdated: '2025-03-15',
    format: 'Slideshow',
    imageUrl: '/teaching-meditation.jpg',
  },
  {
    id: '3',
    title: 'Upanishadic Wisdom',
    category: 'Scripture',
    level: 'Intermediate',
    language: 'Sanskrit & English',
    description: 'Key teachings from the principal Upanishads with explanatory notes.',
    lastUpdated: '2025-03-22',
    format: 'PDF',
    imageUrl: '/teaching-upanishad.jpg',
  },
  {
    id: '4',
    title: 'Mantras for Peace',
    category: 'Chanting',
    level: 'All Levels',
    language: 'Sanskrit with transliteration',
    description: 'Collection of peace mantras with proper pronunciation guides and meanings.',
    lastUpdated: '2025-03-28',
    format: 'Audio & PDF',
    imageUrl: '/teaching-mantra.jpg',
  },
  {
    id: '5',
    title: 'Yoga Philosophy',
    category: 'Philosophy',
    level: 'Intermediate',
    language: 'English',
    description: "An overview of classical yoga philosophy based on Patanjali's Yoga Sutras.",
    lastUpdated: '2025-03-10',
    format: 'PDF',
    imageUrl: '/teaching-yoga.jpg',
  },
  {
    id: '6',
    title: 'Sacred Symbolism in Hindu Art',
    category: 'Culture',
    level: 'All Levels',
    language: 'English',
    description: 'Visual guide to understanding the spiritual significance of symbols in Hindu iconography.',
    lastUpdated: '2025-02-28',
    format: 'Slideshow',
    imageUrl: '/teaching-symbolism.jpg',
  },
];

// Level badges
const levelBadges = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-amber-100 text-amber-800',
  'Advanced': 'bg-violet-100 text-violet-800',
  'All Levels': 'bg-blue-100 text-blue-800',
};

const PriestTeachings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedTeaching, setSelectedTeaching] = useState<typeof teachingsData[0] | null>(null);
  
  const filteredTeachings = teachingsData.filter(teaching => {
    const matchesSearch = teaching.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          teaching.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ? true : teaching.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = ['all', ...new Set(teachingsData.map(teaching => teaching.category))];
  
  const handleShare = (teaching: typeof teachingsData[0]) => {
    setSelectedTeaching(teaching);
    setShareDialogOpen(true);
  };

  // Function to copy sharing link
  const copyShareLink = () => {
    if (!selectedTeaching) return;
    
    const shareLink = `${window.location.origin}/teachings/${selectedTeaching.id}`;
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        alert('Link copied to clipboard!');
        setShareDialogOpen(false);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachings..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachings.map(teaching => (
          <Card key={teaching.id} className="overflow-hidden flex flex-col">
            <AspectRatio ratio={16/9} className="bg-gray-100 dark:bg-gray-800">
              <img
                src={teaching.imageUrl || "/placeholder.svg"}
                alt={teaching.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            
            <CardHeader className="bg-sky-50/50 dark:bg-sky-900/20 pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-medium">{teaching.title}</CardTitle>
                <Badge className={levelBadges[teaching.level]}>
                  {teaching.level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{teaching.category} • {teaching.language}</p>
            </CardHeader>
            
            <CardContent className="pt-4 flex-grow">
              <p className="text-sm text-muted-foreground">{teaching.description}</p>
              
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  <span>Format: {teaching.format}</span>
                </div>
                <span>Updated: {teaching.lastUpdated}</span>
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-gray-50 dark:bg-gray-800/50 p-3">
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare(teaching)}
                    className="flex items-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                <Button variant="default" size="sm" className="flex items-center bg-spiritual-gold hover:bg-spiritual-gold/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {filteredTeachings.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">No teaching materials match your search criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {setSearchTerm(''); setSelectedCategory('all');}} 
              className="mt-2 text-spiritual-gold"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Teaching Material</DialogTitle>
            <DialogDescription>
              Share this teaching material with other priests or spiritual guides.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeaching && (
            <div className="py-4">
              <p className="font-medium">{selectedTeaching.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedTeaching.category} • {selectedTeaching.level}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <span className="text-sm truncate">
              {selectedTeaching ? `${window.location.origin}/teachings/${selectedTeaching.id}` : ''}
            </span>
            <Button size="sm" onClick={copyShareLink}>
              Copy Link
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriestTeachings;
