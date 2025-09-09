import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check current user and session
    const initializeAuth = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (userError) {
          console.error("Error getting user:", userError);
          setUser(null);
          setSession(null);
        } else {
          setUser(user);
          setSession(session);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession) {
        // Verify the user is still valid
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error("Error verifying user:", error);
          setUser(null);
          setSession(null);
        } else {
          setUser(user);
          setSession(newSession);
        }
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /** Sign in with email and password */
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw error;

    if (data?.session) {
      setSession(data.session);
      setUser(data.user);
      await supabase.auth.setSession(data.session);
      return data.session;
    }
  };

  /** Sign up with email and password */
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

      // For email confirmation sign-ups, we won't get a session immediately
      // The user needs to verify their email first
      // Note: Profile creation is handled in two places:
      // 1. On the client during signup (in sign-up-form.tsx) with user-provided data
      // 2. As a fallback in auth/callback route if the client-side creation failed

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
    setUser(null);
    setSession(null);
    router.push("/");
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
