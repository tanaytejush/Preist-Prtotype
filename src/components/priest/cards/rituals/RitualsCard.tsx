
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';

interface RitualsCardProps {
  onViewRituals: () => void;
}

const RitualsCard: React.FC<RitualsCardProps> = ({ onViewRituals }) => {
  return (
    <Card>
      <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
        <CardTitle className="flex items-center">
          <Book className="mr-2 h-5 w-5 text-spiritual-gold" />
          Ritual Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-muted-foreground mb-3">Access ritual manuals, prayers, and procedures for various ceremonies.</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-orange-50/50 rounded-md">
            <p className="text-sm font-medium">Vedic</p>
            <p className="text-xs text-muted-foreground">22 rituals</p>
          </div>
          <div className="text-center p-2 bg-orange-50/50 rounded-md">
            <p className="text-sm font-medium">Tantric</p>
            <p className="text-xs text-muted-foreground">14 rituals</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-spiritual-gold" onClick={onViewRituals}>
          Browse Rituals
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RitualsCard;
