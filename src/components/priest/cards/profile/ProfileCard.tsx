
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface ProfileCardProps {
  onViewProfile: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onViewProfile }) => {
  return (
    <Card>
      <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-spiritual-gold" />
          Your Public Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-muted-foreground mb-3">Manage how you appear to users seeking your services.</p>
        <div className="text-sm">
          <p className="font-medium">Profile Visibility:</p>
          <p className="text-muted-foreground">Users can see your profile on the temple website</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-spiritual-gold" onClick={onViewProfile}>
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
