"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch profile function
  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  // Refetch function to refresh user and profile data
  const refetch = useCallback(async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError);
        setUser(null);
        setProfile(null);
      } else {
        setUser(user);

        if (user) {
          await fetchProfile(user.id);
        } else {
          setProfile(null);
        }
      }
    } catch (error) {
      console.error("Error refetching user data:", error);
    }
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (userError) {
          console.error("Error getting user:", userError);
          setUser(null);
          setProfile(null);
        } else {
          setUser(user);

          if (user) {
            await fetchProfile(user.id);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error getting user:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session) {
        // Verify the user is still valid
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error("Error verifying user:", error);
          setUser(null);
          setProfile(null);
        } else {
          setUser(user);

          if (user) {
            await fetchProfile(user.id);
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading, isLoading: loading, refetch };
}
