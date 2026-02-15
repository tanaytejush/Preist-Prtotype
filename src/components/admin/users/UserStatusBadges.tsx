
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, UserCheck } from 'lucide-react';
import { UserProfile } from '@/types/priest';

interface UserStatusBadgesProps {
  profile: UserProfile;
}

const UserStatusBadges: React.FC<UserStatusBadgesProps> = ({ profile }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {profile.is_admin && (
        <Badge 
          variant="outline" 
          className="bg-spiritual-gold/20 text-spiritual-brown dark:text-spiritual-cream border-spiritual-gold/30 flex items-center"
        >
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      )}
      
      {profile.priest_status === 'pending' && (
        <Badge 
          variant="outline" 
          className="bg-amber-50 text-amber-700 border-amber-200 flex items-center"
        >
          <Clock className="h-3 w-3 mr-1" />
          Priest Request
        </Badge>
      )}
      
      {profile.is_priest && (
        <Badge 
          variant="outline" 
          className="bg-green-50 text-green-700 border-green-200 flex items-center"
        >
          <UserCheck className="h-3 w-3 mr-1" />
          Priest
        </Badge>
      )}
      
      {(!profile.is_admin && !profile.is_priest && !profile.priest_status) && (
        <Badge 
          variant="outline" 
          className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          User
        </Badge>
      )}
    </div>
  );
};

export default UserStatusBadges;
