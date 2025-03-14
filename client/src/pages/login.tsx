import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/lib/firebase";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      
      // Create or fetch user in our backend
      const response = await apiRequest(
        "POST",
        "/api/users",
        {
          email: user.email,
          name: user.displayName,
          photoUrl: user.photoURL,
          firebaseUid: user.uid
        }
      );
      
      if (response.ok) {
        setLocation("/photos");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive"
      });
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
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
