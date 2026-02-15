
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { TeachingsAPI, Teaching } from '@/api/supabaseUtils';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

const TEACHING_CATEGORIES = [
  "Scripture",
  "Practices",
  "Philosophy",
  "Symbolism",
  "Lifestyle",
  "Meditation"
];

const TeachingsTab = () => {
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [teachingToDelete, setTeachingToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Teaching>>({
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Scripture',
    content: '',
    imageUrl: '/placeholder.svg'
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: teachings = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-teachings'],
    queryFn: TeachingsAPI.getAll
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleCreateTeaching = async () => {
    try {
      // Complete the teaching object with required fields
      const newTeaching = {
        ...formData,
        title: formData.title || '',
        author: formData.author || '',
        date: formData.date || new Date().toISOString().split('T')[0],
        description: formData.description || '',
        category: formData.category || 'Scripture',
        content: formData.content || '',
        imageUrl: formData.imageUrl || '/placeholder.svg'
      };

      if (isEditing && formData.id) {
        // Update existing teaching
        const success = await TeachingsAPI.update(formData.id, newTeaching);
        if (success) {
          toast({
            title: "Teaching updated",
            description: "The teaching has been updated successfully."
          });
          refetch();
        } else {
          toast({
            title: "Error",
            description: "Failed to update the teaching.",
            variant: "destructive"
          });
        }
      } else {
        // Create new teaching
        const created = await TeachingsAPI.create(newTeaching);
        if (created) {
          toast({
            title: "Teaching created",
            description: "New teaching has been created successfully."
          });
          refetch();
        } else {
          toast({
            title: "Error",
            description: "Failed to create new teaching.",
            variant: "destructive"
          });
        }
      }

      // Reset form
      setFormData({
        title: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'Scripture',
        content: '',
        imageUrl: '/placeholder.svg'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error creating/updating teaching:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleEditTeaching = (teaching: Teaching) => {
    setFormData({ ...teaching });
    setIsEditing(true);
  };

  const confirmDeleteTeaching = (id: string) => {
    setTeachingToDelete(id);
    setIsAlertOpen(true);
  };

  const handleDeleteTeaching = async () => {
    try {
      if (!teachingToDelete) return;
      
      const success = await TeachingsAPI.delete(teachingToDelete);
      if (success) {
        toast({
          title: "Teaching deleted",
          description: "The teaching has been deleted successfully."
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the teaching.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting teaching:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsAlertOpen(false);
      setTeachingToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Teachings Management</CardTitle>
            <CardDescription>Manage your spiritual teachings and resources</CardDescription>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-spiritual-gold hover:bg-spiritual-gold/90">
                <Plus className="h-4 w-4 mr-2" /> Add New Teaching
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{isEditing ? 'Edit Teaching' : 'Add New Teaching'}</SheetTitle>
                <SheetDescription>
                  {isEditing 
                    ? 'Update the teaching details below and save your changes.' 
                    : 'Fill in the details below to create a new teaching.'}
                </SheetDescription>
              </SheetHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    placeholder="Enter teaching title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author"
                    name="author"
                    value={formData.author || ''}
                    onChange={handleChange}
                    placeholder="Enter author name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category || 'Scripture'} 
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEACHING_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Enter a short description"
                    rows={2}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content"
                    name="content"
                    value={formData.content || ''}
                    onChange={handleChange}
                    placeholder="Enter the full content"
                    rows={10}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input 
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={handleChange}
                    placeholder="/placeholder.svg"
                  />
                </div>
              </div>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFormData({
                        title: '',
                        author: '',
                        date: new Date().toISOString().split('T')[0],
                        description: '',
                        category: 'Scripture',
                        content: '',
                        imageUrl: '/placeholder.svg'
                      });
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button 
                    className="bg-spiritual-gold hover:bg-spiritual-gold/90" 
                    onClick={handleCreateTeaching}
                  >
                    {isEditing ? 'Save Changes' : 'Create Teaching'}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-white/50 animate-pulse h-32">
                <CardContent className="p-4"></CardContent>
              </Card>
            ))
          ) : teachings.length === 0 ? (
            <p className="text-spiritual-brown/70 col-span-2 text-center py-8">No teachings found. Add your first teaching using the button above.</p>
          ) : (
            teachings.map((teaching) => (
              <Card key={teaching.id} className="bg-white/50">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-spiritual-brown">{teaching.title}</h3>
                    <div className="text-xs bg-spiritual-gold/20 text-spiritual-brown px-2 py-1 rounded">
                      {teaching.category}
                    </div>
                  </div>
                  <p className="text-sm text-spiritual-brown/70 mt-2">
                    {teaching.description.length > 100 ? 
                      `${teaching.description.substring(0, 100)}...` : 
                      teaching.description}
                  </p>
                  <div className="flex justify-between mt-4">
                    <div className="text-xs text-spiritual-brown/60">
                      Published: {new Date(teaching.date).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTeaching(teaching)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => confirmDeleteTeaching(teaching.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this teaching.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeaching} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TeachingsTab;
