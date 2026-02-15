
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface PriestAccessRestrictedProps {
  reason: 'not-signed-in' | 'pending' | 'rejected' | 'not-priest';
}

const PriestAccessRestricted: React.FC<PriestAccessRestrictedProps> = ({ reason }) => {
  const navigate = useNavigate();

  const messages = {
    'not-signed-in': "You need to sign in to access this page.",
    'pending': "Your priest account is pending approval.",
    'rejected': "Your priest application was not approved.",
    'not-priest': "You don't have priest privileges on this account."
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-spiritual-brown mb-4">Access Restricted</h2>
          <p className="mb-6 text-gray-600">{messages[reason]}</p>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-spiritual-gold hover:bg-spiritual-gold/90"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              className="w-full"
            >
              Go to Profile
            </Button>
            <div className="text-sm text-gray-500 mt-4">
              <p>To access the priest dashboard:</p>
              <ol className="list-decimal list-inside text-left mt-2">
                <li>Sign in to your account</li>
                <li>Go to your profile page</li>
                <li>Apply to become a priest</li>
                <li>Wait for admin approval</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PriestAccessRestricted;
