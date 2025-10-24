import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { companyInfoService } from "@/services/companyInfoService";
import { ApiResponseHandler } from "@/helpers";
import type { CompanyInfoResponse } from "@/models";

interface InstagramPreviewProps {
  post: {
    image_url: string;
    title: string;
    subtitle: string;
    caption: string;
    hashtags: string[];
  } | null;
  onRegenerate?: () => void;
  onSave?: () => void;
}

export const InstagramPreview = ({ post, onRegenerate, onSave }: InstagramPreviewProps) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoResponse | null>(null);

  // Helper function to build full URL
  const buildFullUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    return `${baseUrl}${path}`;
  };

  // Get company initials
  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get company username
  const getCompanyUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_');
  };

  // Load company info
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const response = await companyInfoService.getCompanyInfo();
        if (ApiResponseHandler.isSuccess(response)) {
          setCompanyInfo(response.data);
        }
      } catch (error) {
        console.error('Error loading company info:', error);
      }
    };

    loadCompanyInfo();
  }, []);
  if (!post) {
    return (
      <div className="animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-sm text-muted-foreground">
            La vista previa de tu post aparecerá aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Vista Previa</h3>
        <Button variant="outline" size="sm">
          Publicar
        </Button>
      </div>

      {/* Instagram mockup */}
      <div className="glass rounded-2xl overflow-hidden border border-border">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              {companyInfo?.logo_path && (
                <AvatarImage 
                  src={buildFullUrl(companyInfo.logo_path)} 
                  alt={companyInfo.company_name}
                />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {companyInfo?.company_name ? getCompanyInitials(companyInfo.company_name) : 'MI'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold">
              {companyInfo?.company_name ? getCompanyUsername(companyInfo.company_name) : 'mi_empresa'}
            </span>
          </div>
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Image without overlay text - cleaner look */}
        <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-secondary/20">
          <img 
            src={buildFullUrl(post.image_url)} 
            alt="Post" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800';
            }}
          />
        </div>

        {/* Actions */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 hover:text-destructive cursor-pointer transition-colors" />
              <MessageCircle className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
              <Send className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
            </div>
            <Bookmark className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
          </div>

          <div className="text-sm font-semibold">1,234 me gusta</div>

          {/* Caption with title and subtitle */}
          <div className="text-sm space-y-2">
            {/* Title and subtitle as separate elements */}
            {post.title && (
              <div className="font-bold text-base text-foreground">
                {post.title}
              </div>
            )}
            {post.subtitle && (
              <div className="text-muted-foreground text-sm">
                {post.subtitle}
              </div>
            )}
            
            {/* Main caption */}
            <p>
              <span className="font-semibold mr-2">
                {companyInfo?.company_name ? getCompanyUsername(companyInfo.company_name) : 'mi_empresa'}
              </span>
              {post.caption}
            </p>
            
            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <p className="text-primary">
                {post.hashtags.join(" ")}
              </p>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            hace 2 minutos
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 space-y-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onRegenerate}
          disabled={!onRegenerate}
        >
          🔄 Regenerar
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onSave}
          disabled={!onSave}
        >
          💾 Guardar
        </Button>
      </div>
    </div>
  );
};
