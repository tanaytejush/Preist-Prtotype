
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from "@/hooks/common/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { sendEmail } from '@/services/email/emailService';

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      // Save to Supabase - using type assertion to work around TypeScript limitations
      const { error } = await (supabase as any)
        .from('contact_submissions')
        .insert({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message
        });
        
      if (error) throw error;

      // Send acknowledgment email
      sendEmail({
        type: 'contact_acknowledgment',
        to: values.email,
        data: {
          name: values.name,
          subject: values.subject,
          message: values.message,
        },
      });

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We will respond to your message shortly.",
      });
      
      form.reset();
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-spiritual-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-sanskrit text-spiritual-brown mb-4">Contact Us</h1>
            <p className="text-xl text-spiritual-brown/80 max-w-3xl mx-auto">
              We're here to answer your questions and provide spiritual guidance. Reach out to us through any of the methods below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/70 text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-spiritual-gold/20 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="h-6 w-6 text-spiritual-gold" />
                </div>
                <CardTitle className="text-spiritual-brown">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-spiritual-brown/80 mb-2">Our spiritual advisors are available</p>
                <p className="text-spiritual-brown font-medium">+91 9876 543210</p>
                <p className="text-sm text-spiritual-brown/70 mt-2">Monday-Saturday: 9am-5pm</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-spiritual-gold/20 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6 text-spiritual-gold" />
                </div>
                <CardTitle className="text-spiritual-brown">Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-spiritual-brown/80 mb-2">For inquiries and bookings</p>
                <p className="text-spiritual-brown font-medium">contact@divineguidance.com</p>
                <p className="text-sm text-spiritual-brown/70 mt-2">We aim to respond within 24 hours</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-spiritual-gold/20 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-6 w-6 text-spiritual-gold" />
                </div>
                <CardTitle className="text-spiritual-brown">Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-spiritual-brown/80 mb-2">Our spiritual center is located at</p>
                <p className="text-spiritual-brown font-medium">IIT Madras, Chennai, Tamil Nadu, India</p>
                <p className="text-sm text-spiritual-brown/70 mt-2">Open daily for visitors: 7am-7pm</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <Card className="lg:col-span-3 border-spiritual-gold/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-spiritual-brown">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="What is your message about?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please share your questions or thoughts..." 
                              className="min-h-32 resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-spiritual-gold hover:bg-spiritual-gold/90"
                    >
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2">
              <Card className="h-full border-spiritual-gold/20 shadow-lg overflow-hidden">
                <div className="h-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.485289043498!2d80.2309!3d12.9916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52677f8e2a88c1%3A0x6e5e1e67c6a56e24!2sIIT%20Madras!5e0!3m2!1sen!2sin!4v1614201896951!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, minHeight: "400px" }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
