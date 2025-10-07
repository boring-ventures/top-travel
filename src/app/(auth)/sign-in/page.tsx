"use client";

import { SignInPage } from "@/components/ui/sign-in";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

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
        title: "Éxito",
        description: "Has iniciado sesión correctamente.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Email o contraseña inválidos.",
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
          Bienvenido a Top Travel
        </span>
      }
      description="Inicia sesión en tu cuenta y continúa tu viaje con nosotros"
      heroImageSrc="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2160&q=80"
      onSignIn={handleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
    />
  );
}
