
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/lib/firebase";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Photo } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ["/api/photos"]
  });

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (!user.email) {
        throw new Error("No email provided from Google login");
      }

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
        description: error.message || "Failed to sign in",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/3 bg-primary/5 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Photo Gallery</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Share and explore beautiful moments
            </p>
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
      <div className="w-2/3 p-8">
        <div className="grid grid-cols-2 gap-4 auto-rows-fr">
          {photos.slice(0, 6).map((photo) => (
            <div key={photo.id} className="photo-card">
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
