
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, User } from 'lucide-react';
import UserStatusBadges from './UserStatusBadges';
import UserActionButtons from './UserActionButtons';
import { UserProfile } from '@/types/priest';
import { DialogState } from '../types';

interface UsersTableProps {
  profiles: UserProfile[] | undefined;
  isProcessing: boolean;
  searchTerm: string;
  activeTab: 'all' | 'priests' | 'pending';
  setDialogState: React.Dispatch<React.SetStateAction<DialogState>>;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  profiles, 
  isProcessing, 
  searchTerm, 
  activeTab, 
  setDialogState 
}) => {
  const filteredProfiles = profiles?.filter(profile => {
    const matchesSearch = searchTerm 
      ? (profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         profile.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    switch (activeTab) {
      case 'priests':
        return matchesSearch && profile.is_priest === true;
      case 'pending':
        return matchesSearch && profile.priest_status === 'pending';
      default:
        return matchesSearch;
    }
  });

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center py-8 text-spiritual-brown/70 dark:text-spiritual-cream/70">
        <User className="h-8 w-8 mx-auto mb-2 opacity-30" />
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-spiritual-cream/10 dark:hover:bg-gray-800/50">
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProfiles?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-spiritual-brown/70 dark:text-spiritual-cream/70">
                <User className="h-8 w-8 mx-auto mb-2 opacity-30" />
                {searchTerm ? 'No users match your search' : 'No users found'}
              </TableCell>
            </TableRow>
          ) : (
            filteredProfiles?.map((profile) => (
              <TableRow 
                key={profile.id} 
                className={`
                  hover:bg-spiritual-cream/10 dark:hover:bg-gray-800/50 transition-colors duration-150
                  ${profile.priest_status === 'pending' ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}
                  ${profile.is_priest ? 'bg-green-50/30 dark:bg-green-900/10' : ''}
                `}
              >
                <TableCell className="font-medium">
                  {profile.first_name || profile.last_name 
                    ? `${profile.first_name || ''} ${profile.last_name || ''}` 
                    : 'Unnamed User'
                  }
                </TableCell>
                <TableCell className="flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                  {profile.email}
                </TableCell>
                <TableCell>
                  <UserStatusBadges profile={profile} />
                </TableCell>
                <TableCell className="text-right">
                  <UserActionButtons 
                    profile={profile}
                    isProcessing={isProcessing}
                    setDialogState={setDialogState}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
