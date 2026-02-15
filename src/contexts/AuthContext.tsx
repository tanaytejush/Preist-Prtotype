
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to clean up auth state - prevents auth limbo
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT') {
          // Clear all user data on sign out
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        } else if (session) {
          setSession(session);
          setUser(session.user);
          
          // Check admin status if signed in
          if (session.user) {
            try {
              // Defer data fetching to prevent deadlocks
              setTimeout(async () => {
                await checkUserAdmin(session.user.id);
              }, 0);
            } catch (error) {
              console.error("Error checking admin status:", error);
            }
          }
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }
        
        console.log("Initial session check:", session ? "Has session" : "No session");
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              await checkUserAdmin(session.user.id);
            } catch (error) {
              console.error("Error checking admin status:", error);
            }
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Unexpected error in auth initialization:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    initializeAuth();

    return () => {
      console.log("Cleaning up auth subscription");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkUserAdmin = async (userId: string) => {
    try {
      console.log("Checking admin status for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      console.log("Admin check result:", data);
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Clean up existing state first
      cleanupAuthState();
      
      console.log("Attempting sign in for:", email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Successfully signed in!",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "Failed to sign in. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      // Clean up existing state first
      cleanupAuthState();
      
      console.log("Attempting Google sign in");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth',
        },
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Successfully initiated Google sign in!",
      });
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: error.message || "Failed to sign in with Google. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      // Clean up existing state first
      cleanupAuthState();
      
      console.log("Attempting sign up for:", email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      if (error) throw error;
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email for confirmation.",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "Failed to create account. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting sign out");
      setIsLoading(true);
      
      // First clean up any auth state
      cleanupAuthState();
      
      // Then clear state to prevent UI flashing
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // Then sign out from Supabase, attempt global sign out
      try {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) throw error;
      } catch (signOutError) {
        console.error("Error during signOut:", signOutError);
        // Continue even if this fails
      }
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      // Force page reload for a clean state
      window.location.href = '/';
      
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "Failed to sign out. Please try again.",
      });
      
      // Try to restore state if sign out failed and we still have a session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
        if (session.user) {
          await checkUserAdmin(session.user.id);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
