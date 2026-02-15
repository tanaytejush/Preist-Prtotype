
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface TeachingsCardProps {
  onViewTeachings: () => void;
}

const TeachingsCard: React.FC<TeachingsCardProps> = ({ onViewTeachings }) => {
  return (
    <Card>
      <CardHeader className="bg-sky-50 dark:bg-sky-900/20">
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-spiritual-gold" />
          Teaching Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-muted-foreground mb-3">Access teaching materials and prepare your spiritual lessons.</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Recent uploads:</span>
          <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">3 new</span>
        </div>
        <p className="text-sm">Bhagavad Gita Chapter 12 Commentary</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-spiritual-gold" onClick={onViewTeachings}>
          View Resources
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeachingsCard;
