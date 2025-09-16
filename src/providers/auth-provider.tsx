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
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isProfileLoading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const router = useRouter();

  // Try to get cached user data for faster initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedUser = localStorage.getItem("sb-user");
      const cachedSession = localStorage.getItem("sb-session");

      if (cachedUser && cachedSession) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          const parsedSession = JSON.parse(cachedSession);

          // Only use cache if it's recent (less than 5 minutes old)
          if (
            parsedSession?.expires_at &&
            Date.now() < parsedSession.expires_at * 1000
          ) {
            setUser(parsedUser);
            setSession(parsedSession);
            setIsLoading(false);
            console.log("Auth loaded from cache - user:", parsedUser.email);
          }
        } catch (error) {
          console.error("Error parsing cached auth data:", error);
          localStorage.removeItem("sb-user");
          localStorage.removeItem("sb-session");
        }
      }
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
      if (error.name === "AbortError") {
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
        // Try to get session first (faster than getUser)
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

        // If we have a session, set it immediately
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          console.log(
            "Auth initialized from session - user:",
            session.user.email
          );
          setIsLoading(false);

          // Cache the session for faster future loads
          if (typeof window !== "undefined") {
            localStorage.setItem("sb-user", JSON.stringify(session.user));
            localStorage.setItem("sb-session", JSON.stringify(session));
          }

          // Fetch profile in background
          fetchProfile(session.user.id).catch(console.error);
        } else {
          // No session, verify with getUser as fallback
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (!isMounted) return;

          if (userError) {
            console.error("Error getting user:", userError);
            setUser(null);
            setSession(null);
          } else {
            setUser(user);
            setSession(session);
            console.log("Auth initialized from user - user:", user?.email);

            if (user) {
              fetchProfile(user.id).catch(console.error);
            }
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
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
        // Use session data directly (faster than getUser)
        setUser(session.user);
        setSession(session);
        setIsLoading(false);

        // Cache the session for faster future loads
        if (typeof window !== "undefined") {
          localStorage.setItem("sb-user", JSON.stringify(session.user));
          localStorage.setItem("sb-session", JSON.stringify(session));
        }

        // Fetch profile in background
        fetchProfile(session.user.id).catch(console.error);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        setIsLoading(false);

        // Clear cache on logout
        if (typeof window !== "undefined") {
          localStorage.removeItem("sb-user");
          localStorage.removeItem("sb-session");
        }
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
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
