
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  Eye, 
  Inbox,
  RotateCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactAPI, ContactSubmission } from '@/api/supabaseUtils';
import { format } from 'date-fns';

const ContactTab = () => {
  const { toast } = useToast();
  const [viewingSubmission, setViewingSubmission] = React.useState<ContactSubmission | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<ContactSubmission['status']>('new');

  const { 
    data: submissions, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: ContactAPI.getAll
  });

  const handleViewSubmission = (submission: ContactSubmission) => {
    setViewingSubmission(submission);
  };

  const handleStatusChange = (submission: ContactSubmission) => {
    setViewingSubmission(submission);
    setSelectedStatus(submission.status);
    setStatusDialogOpen(true);
  };

  const updateStatus = async () => {
    if (!viewingSubmission) return;
    
    try {
      const success = await ContactAPI.updateStatus(viewingSubmission.id, selectedStatus);
      
      if (success) {
        toast({
          title: "Status Updated",
          description: `Submission marked as "${selectedStatus}"`,
        });
        refetch();
        setStatusDialogOpen(false);
      } else {
        throw new Error("Could not update status");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update status",
      });
    }
  };

  const getStatusBadge = (status: ContactSubmission['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Inbox className="w-3 h-3 mr-1" />
            New
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Submissions</CardTitle>
        <CardDescription>View and manage contact form submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-spiritual-gold border-t-transparent rounded-full"></div>
            <p className="mt-2 text-spiritual-brown/70">Loading submissions...</p>
          </div>
        ) : submissions && submissions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${submission.email}`} className="text-spiritual-gold hover:underline">
                      {submission.email}
                    </a>
                  </TableCell>
                  <TableCell>{submission.subject}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(submission)}
                      >
                        <RotateCw className="h-4 w-4 mr-1" />
                        Status
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Inbox className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions</h3>
            <p className="mt-1 text-sm text-gray-500">
              No contact form submissions have been received yet.
            </p>
          </div>
        )}

        {/* View Submission Dialog */}
        {viewingSubmission && (
          <Dialog open={!!viewingSubmission} onOpenChange={() => setViewingSubmission(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{viewingSubmission.subject}</DialogTitle>
                <DialogDescription>
                  From {viewingSubmission.name} ({viewingSubmission.email})
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Message:</p>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {viewingSubmission.message}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date:</p>
                  <div className="text-sm">
                    {format(new Date(viewingSubmission.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status:</p>
                  <div>{getStatusBadge(viewingSubmission.status)}</div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingSubmission(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setSelectedStatus(viewingSubmission.status);
                  setStatusDialogOpen(true);
                }}>
                  Update Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Status Change Dialog */}
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Status</DialogTitle>
              <DialogDescription>
                Change the status of this contact submission
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select
                value={selectedStatus}
                onValueChange={(value: any) => setSelectedStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateStatus}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContactTab;
