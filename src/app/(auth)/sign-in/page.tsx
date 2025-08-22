"use client";

import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

// Sample testimonials for the travel theme
const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Chen",
    handle: "@sarahadventures",
    text: "Amazing travel experiences! The platform made planning our honeymoon so easy and memorable.",
  },
  {
    avatarSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Marcus Johnson",
    handle: "@marcusexplorer",
    text: "This service has transformed how we travel. Clean design, powerful features, and excellent support.",
  },
  {
    avatarSrc:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Emma Rodriguez",
    handle: "@emmatravels",
    text: "I've tried many travel platforms, but this one stands out. Intuitive, reliable, and genuinely helpful.",
  },
];

export default function SignInPageWrapper() {
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await signIn(normalizedEmail, password);
      toast({
        title: "Success",
        description: "You have been signed in.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = () => {
    router.push("/forgot-password");
  };

  const handleCreateAccount = () => {
    router.push("/sign-up");
  };

  return (
    <SignInPage
      title={
        <span className="font-light text-foreground tracking-tighter">
          Welcome to Top Travel
        </span>
      }
      description="Sign in to your account and continue your journey with us"
      heroImageSrc="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2160&q=80"
      testimonials={sampleTestimonials}
      onSignIn={handleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
    />
  );
}
