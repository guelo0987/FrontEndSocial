import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface InstagramPreviewProps {
  post: {
    image: string;
    title: string;
    subtitle: string;
    caption: string;
    hashtags: string[];
  } | null;
}

export const InstagramPreview = ({ post }: InstagramPreviewProps) => {
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
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                MI
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold">mi_empresa</span>
          </div>
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Image with overlay text */}
        <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-secondary/20">
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
            <h4 className="text-white text-2xl font-bold mb-1">{post.title}</h4>
            <p className="text-white/90 text-sm">{post.subtitle}</p>
          </div>
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

          {/* Caption */}
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold mr-2">mi_empresa</span>
              {post.caption}
            </p>
            <p className="text-primary">
              {post.hashtags.join(" ")}
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            hace 2 minutos
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 space-y-2">
        <Button variant="outline" className="w-full">
          🔄 Regenerar
        </Button>
        <Button variant="outline" className="w-full">
          💾 Guardar
        </Button>
      </div>
    </div>
  );
};
