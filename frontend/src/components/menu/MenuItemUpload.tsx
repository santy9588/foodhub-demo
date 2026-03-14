import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MenuItemUploadProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

export default function MenuItemUpload({ imageUrl, onImageUrlChange }: MenuItemUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(imageUrl);

  const handleUrlChange = (url: string) => {
    onImageUrlChange(url);
    setPreviewUrl(url);
  };

  const clearImage = () => {
    onImageUrlChange('');
    setPreviewUrl('');
  };

  return (
    <div className="space-y-4">
      <Label>Menu Item Image</Label>
      
      {/* Preview */}
      <div className="relative w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/30">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl('')}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src="/assets/generated/menu-upload-icon.dim_256x256.png"
              alt="Upload"
              className="h-16 w-16 mb-2 opacity-50"
            />
            <p className="text-sm text-muted-foreground">No image selected</p>
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-sm">Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {imageUrl && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Enter a direct URL to an image (JPG, PNG, GIF, WebP)
        </p>
      </div>
    </div>
  );
}
