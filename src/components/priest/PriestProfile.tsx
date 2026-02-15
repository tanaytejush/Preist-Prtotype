import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PriestProfile as PriestProfileType } from '@/types/priest';

const PriestProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newSpecialty, setNewSpecialty] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [profile, setProfile] = useState<PriestProfileType>({
    user_id: user?.id || '',
    name: '',
    description: '',
    specialties: [],
    experience_years: 0,
    avatar_url: '',
    base_price: 0,
    availability: '',
    location: '',
    approval_status: 'pending'
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['priestProfile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: priestProfile, error: priestProfileError } = await supabase
        .from('priest_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (priestProfile) return priestProfile as PriestProfileType;
      
      const { data: userProfile, error: userProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (userProfileError && userProfileError.code !== 'PGRST116') throw userProfileError;
      
      const newPriestProfile: PriestProfileType = {
        user_id: user.id,
        name: `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim() || 'New Priest',
        description: 'Add your description here',
        specialties: [],
        experience_years: 0,
        avatar_url: userProfile?.avatar_url || '/placeholder.svg',
        base_price: 0,
        availability: 'Weekdays 9am-5pm',
        location: 'Local Temple',
        approval_status: 'pending'
      };
      
      return newPriestProfile;
    },
    enabled: !!user
  });

  useEffect(() => {
    if (data) {
      setProfile(data);
      if (data.avatar_url) {
        setAvatarPreview(data.avatar_url);
      }
    }
  }, [data]);

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    }
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (profileData: PriestProfileType) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: existingProfile, error: checkError } = await supabase
        .from('priest_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingProfile) {
        const { data, error } = await supabase
          .from('priest_profiles')
          .update({
            name: profileData.name,
            description: profileData.description,
            specialties: profileData.specialties,
            experience_years: profileData.experience_years,
            avatar_url: profileData.avatar_url,
            base_price: profileData.base_price,
            availability: profileData.availability,
            location: profileData.location
          })
          .eq('user_id', user.id)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('priest_profiles')
          .insert({
            user_id: user.id,
            name: profileData.name,
            description: profileData.description,
            specialties: profileData.specialties,
            experience_years: profileData.experience_years,
            avatar_url: profileData.avatar_url,
            base_price: profileData.base_price,
            availability: profileData.availability,
            location: profileData.location
          })
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priestProfile'] });
      toast({
        title: "Profile Saved",
        description: "Your priest profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Saving Profile",
        description: error.message || "There was an error saving your profile.",
        variant: "destructive",
      });
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'experience_years' || name === 'base_price' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !profile.specialties.includes(newSpecialty.trim())) {
      setProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = async () => {
    try {
      let avatarUrl = profile.avatar_url;
      
      if (avatarFile) {
        avatarUrl = await uploadAvatarMutation.mutateAsync(avatarFile);
      }
      
      await saveProfileMutation.mutateAsync({
        ...profile,
        avatar_url: avatarUrl
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-spiritual-gold" />
      </div>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-spiritual-brown">Your Priest Profile</CardTitle>
        <CardDescription>
          Update your profile information to be displayed on the temple website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <Avatar className="h-32 w-32 border-2 border-spiritual-gold">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                    <span className="text-3xl">?</span>
                  </div>
                )}
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-spiritual-gold rounded-full p-2 cursor-pointer hover:bg-spiritual-gold/90 shadow-md"
              >
                <Upload className="h-4 w-4 text-white" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">Upload your profile photo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                name="experience_years"
                type="number"
                min="0"
                value={profile.experience_years}
                onChange={handleInputChange}
                placeholder="Years of experience"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price ($)</Label>
              <Input
                id="base_price"
                name="base_price"
                type="number"
                min="0"
                step="0.01"
                value={profile.base_price}
                onChange={handleInputChange}
                placeholder="Your base service price"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                placeholder="Your main location"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              name="availability"
              value={profile.availability}
              onChange={handleInputChange}
              placeholder="e.g., Weekdays 9am-5pm, Weekends available"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Bio/Description</Label>
            <Textarea
              id="description"
              name="description"
              value={profile.description}
              onChange={handleInputChange}
              placeholder="Write a brief description about yourself, your background, and services"
              className="min-h-[120px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Specialties</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.specialties.map((specialty, index) => (
                <Badge key={index} className="bg-spiritual-gold/20 text-spiritual-brown">
                  {specialty}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSpecialty(specialty)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add a specialty (e.g., Vedic Rituals)"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddSpecialty}
                disabled={!newSpecialty.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-spiritual-gold hover:bg-spiritual-gold/90"
          disabled={saveProfileMutation.isPending || uploadAvatarMutation.isPending}
        >
          {(saveProfileMutation.isPending || uploadAvatarMutation.isPending) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : 'Save Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PriestProfile;
