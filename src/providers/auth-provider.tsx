"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types/profile";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{
    success: boolean;
    user: User | null;
    session: Session | null;
    confirmEmail: boolean;
    error: any;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isProfileLoading: false,
  signIn: async () => {},
  signUp: async () => ({
    success: false,
    user: null,
    session: null,
    confirmEmail: false,
    error: null,
  }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const router = useRouter();

  // Clear any invalid cached data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear any custom cache keys that might conflict with Supabase's own storage
      localStorage.removeItem("sb-user");
      localStorage.removeItem("sb-session");
    }
  }, []);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch profile function with timeout
  const fetchProfile = async (userId: string) => {
    try {
      setIsProfileLoading(true);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`/api/profile`, {
        signal: controller.signal,
        headers: {
          "Cache-Control": "max-age=300", // Cache for 5 minutes
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.warn("Profile fetch timed out");
      } else {
        console.error("Error fetching profile:", error);
      }
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Get session first - this is the most reliable way
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setUser(null);
          setSession(null);
          setIsLoading(false);
          return;
        }

        // If we have a valid session, use it
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          console.log("Auth initialized from session - user:", session.user.email);
          setIsLoading(false);

          // Fetch profile in background
          fetchProfile(session.user.id).catch(console.error);
        } else {
          // No session found, user is not authenticated
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log("Auth state change:", event, session?.user?.email);

      if (session?.user) {
        setUser(session.user);
        setSession(session);
        setIsLoading(false);

        // Fetch profile in background
        fetchProfile(session.user.id).catch(console.error);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        setIsLoading(false);
      }

      if (event === "SIGNED_OUT") {
        router.push("/sign-in");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      await fetchProfile(data.user.id);
    }
    router.push("/dashboard");
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Get the site URL from the environment or current location
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            email_confirmed: false,
          },
        },
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        confirmEmail: true,
        error: null,
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        user: null,
        session: null,
        confirmEmail: false,
        error,
      };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isProfileLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
