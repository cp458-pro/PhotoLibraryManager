import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PhotoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const photo = await response.json();
      
      // Invalidate photos query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });

      toast({
        title: "Success",
        description: `Photo uploaded successfully${photo.metadata ? ' with EXIF data' : ''}!`,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to upload photo',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label htmlFor="photo">Upload Photo</Label>
          <div className="flex items-center gap-4">
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
            {isUploading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Upload a photo to automatically extract its metadata (EXIF data).
            Supported formats: JPEG
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
