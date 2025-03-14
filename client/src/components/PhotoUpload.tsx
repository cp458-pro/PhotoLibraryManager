import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PhotoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);

      // Add tags if provided
      if (tags.trim()) {
        formData.append('tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)));
      }

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

      // Clear the tags input after successful upload
      setTags('');

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
          <div>
            <Label htmlFor="photo">Upload Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="nature, vacation, family..."
              disabled={isUploading}
            />
          </div>
          {isUploading && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Upload a photo to automatically extract its metadata (EXIF data).
            Supported formats: JPEG
          </p>
        </div>
      </CardContent>
    </Card>
  );
}