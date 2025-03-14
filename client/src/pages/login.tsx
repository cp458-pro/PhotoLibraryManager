import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/lib/firebase";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();

      if (!user.email) {
        throw new Error("No email provided from Google login");
      }

      // Create or fetch user in our backend
      const response = await apiRequest(
        "POST",
        "/api/users",
        {
          email: user.email,
          name: user.displayName || "Unknown User",
          photoUrl: user.photoURL,
          firebaseUid: user.uid
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
        setLocation("/photos");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Photo Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleLogin}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}