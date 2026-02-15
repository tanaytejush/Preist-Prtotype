
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Loader2, IndianRupee, ArrowUp, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';

// Interface for donation data
interface Donation {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  donationType: 'one-time' | 'monthly' | 'yearly';
  category: 'diya' | 'seva' | 'temple' | 'other';
  message?: string;
  anonymous: boolean;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  transactionId?: string;
}

const DonationsTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Sample user names for demonstration
  const donorNames = [
    "Rahul Sharma", "Priya Patel", "Amit Kumar", "Deepa Singh", "Vikram Mehta",
    "Anjali Gupta", "Sanjay Verma", "Neha Malhotra", "Rajesh Khanna", "Sunita Joshi"
  ];
  
  // Generate real-looking donation data
  const generateDonationData = (): Donation[] => {
    const categories: Array<'diya' | 'seva' | 'temple' | 'other'> = ['diya', 'seva', 'temple', 'other'];
    const donationTypes: Array<'one-time' | 'monthly' | 'yearly'> = ['one-time', 'monthly', 'yearly'];
    const statuses: Array<'pending' | 'completed' | 'failed'> = ['pending', 'completed', 'completed', 'completed', 'failed'];
    
    return Array(15).fill(null).map((_, i) => {
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
      
      return {
        id: `don-${i+1000}`,
        userId: `user-${i+1000}`,
        userName: donorNames[i % donorNames.length],
        amount: Math.floor(Math.random() * 10000) + 100, // Between 100 and 10100 rupees
        currency: 'INR',
        donationType: donationTypes[Math.floor(Math.random() * donationTypes.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        message: Math.random() > 0.5 ? `Donation for ${categories[Math.floor(Math.random() * categories.length)]} activities` : undefined,
        anonymous: Math.random() > 0.8,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: createdDate.toISOString(),
        transactionId: `txn-${Math.random().toString(36).substring(2, 10)}`
      };
    });
  };

  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd fetch from your database or API
        // For now, generate some realistic-looking data
        const data = generateDonationData();
        setDonations(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
        toast({
          title: "Error",
          description: "Failed to load donation data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [toast]);

  // Calculate donation statistics
  const totalDonations = donations.reduce((sum, donation) => 
    donation.status === 'completed' ? sum + donation.amount : sum, 0);
  
  const completedDonations = donations.filter(d => d.status === 'completed');
  const averageDonation = completedDonations.length > 0 
    ? totalDonations / completedDonations.length 
    : 0;
  
  const uniqueDonors = new Set(donations.map(d => d.userId)).size;

  // Function to handle viewing a donation's details
  const handleViewDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setViewDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation Overview</CardTitle>
        <CardDescription>Track and manage donations to your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-spiritual-brown/70">Total Donations</p>
                <p className="text-2xl font-bold text-spiritual-brown flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {totalDonations.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center justify-center">
                  <ArrowUp className="h-3 w-3 mr-1" /> 12% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-spiritual-brown/70">Average Donation</p>
                <p className="text-2xl font-bold text-spiritual-brown flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {averageDonation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center justify-center">
                  <ArrowUp className="h-3 w-3 mr-1" /> 5% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-spiritual-brown/70">Total Donors</p>
                <p className="text-2xl font-bold text-spiritual-brown">{uniqueDonors}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center justify-center">
                  <ArrowUp className="h-3 w-3 mr-1" /> 8% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Donations</CardTitle>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="animate-spin h-8 w-8 text-spiritual-gold" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-spiritual-gold/10">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.slice(0, 10).map((donation) => (
                        <tr key={donation.id} className="border-b border-spiritual-gold/10">
                          <td className="p-2">{donation.anonymous ? "Anonymous Donor" : donation.userName}</td>
                          <td className="p-2 font-medium">
                            <span className="flex items-center">
                              <IndianRupee className="h-3.5 w-3.5 mr-1 text-spiritual-brown/70" /> 
                              {donation.amount.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="p-2 capitalize">{donation.category}</td>
                          <td className="p-2 text-sm">
                            {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                              donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDonation(donation)}
                              className="flex items-center"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>

      {/* Donation View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Complete information about this donation
            </DialogDescription>
          </DialogHeader>
          
          {selectedDonation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Donor</p>
                  <p className="font-medium">{selectedDonation.anonymous ? "Anonymous Donor" : selectedDonation.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    {selectedDonation.amount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">{selectedDonation.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedDonation.donationType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={`font-medium ${
                    selectedDonation.status === 'completed' ? 'text-green-600' :
                    selectedDonation.status === 'pending' ? 'text-yellow-600' : 
                    'text-red-600'
                  } capitalize`}>
                    {selectedDonation.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(selectedDonation.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              {selectedDonation.message && (
                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="font-medium p-2 bg-muted rounded">{selectedDonation.message}</p>
                </div>
              )}
              
              {selectedDonation.transactionId && (
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-medium font-mono text-sm">{selectedDonation.transactionId}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DonationsTab;
