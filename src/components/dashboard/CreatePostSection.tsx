import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Upload, Loader2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { useCatalogs } from "@/hooks/useCatalogs";
import { contentService, type GenerateContentRequest, type RegenerateContentRequest } from "@/services/contentService";
import { ApiResponseHandler } from "@/helpers";

interface CreatePostSectionProps {
  onPostGenerated: (post: {
    image_url: string;
    title: string;
    subtitle: string;
    caption: string;
    hashtags: string[];
  }) => void;
  onRegenerateCallback?: (callback: (() => void) | null) => void;
}

export const CreatePostSection = ({ onPostGenerated, onRegenerateCallback }: CreatePostSectionProps) => {
  const [message, setMessage] = useState("");
  const [objectiveId, setObjectiveId] = useState<number | undefined>();
  const [styleId, setStyleId] = useState<number | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    role: "user" | "assistant";
    content: string;
  }>>([]);
  const [lastGenerated, setLastGenerated] = useState<{
    content: string;
    imageUrl: string;
    originalMessage: string;
    postId: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasNotifiedCallbackRef = useRef(false);
  const { objectives, styles, isLoading: catalogsLoading } = useCatalogs();

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('La imagen es demasiado grande (máx. 10MB)');
        return;
      }
      setImageFile(file);
      toast.success('Imagen cargada correctamente');
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Parse content into structured format
  const parseGeneratedContent = (content: string) => {
    const parts = content.split('\n\n');
    const bodyText = parts[0] || '';
    const cta = parts[1] || '';
    const hashtagsLine = parts[2] || '';
    const hashtags = hashtagsLine.split(' ').filter(tag => tag.startsWith('#'));

    return {
      bodyText,
      cta,
      hashtags,
      fullCaption: content
    };
  };

  // Generate content
  const handleGenerate = async () => {
    if (!message.trim()) {
      toast.error("Por favor escribe un mensaje");
      return;
    }

    if (!objectiveId) {
      toast.error("Por favor selecciona un objetivo");
      return;
    }

    setIsGenerating(true);
    
    // Add user message to conversation
    const userMessage = { role: "user" as const, content: message };
    setConversation(prev => [...prev, userMessage]);

    try {
      const request: GenerateContentRequest = {
        message: message.trim(),
        objective_id: objectiveId,
        style_id: styleId,
        image: imageFile || undefined,
      };

      const response = await contentService.generateContent(request);

      if (ApiResponseHandler.isSuccess(response)) {
        const { content, image_url } = response.data;
        
        // Store for regeneration
        setLastGenerated({
          content,
          imageUrl: image_url,
          originalMessage: message,
          postId: response.data.post_id
        });

        // Parse content
        const parsed = parseGeneratedContent(content);
        
        // Get objective and style names
        const objectiveName = objectives.find(obj => obj.id === objectiveId)?.name || '';
        const styleName = styles.find(s => s.id === styleId)?.name || 'moderno';

        // Add assistant message to conversation
        const assistantMessage = {
          role: "assistant" as const,
          content: `He generado un post ${styleName} con el objetivo de ${objectiveName}. Aquí está tu contenido:\n\n${parsed.bodyText}\n\n${parsed.cta}\n\n${parsed.hashtags.join(' ')}`
        };
        setConversation(prev => [...prev, assistantMessage]);

        // Generate post for preview
        const generatedPost = {
          image_url: image_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
          title: parsed.bodyText.split('\n')[0] || "Post Generado",
          subtitle: styleName,
          caption: parsed.fullCaption,
          hashtags: parsed.hashtags
        };

        onPostGenerated(generatedPost);
        
        // Clear form
        setMessage("");
        setImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        toast.success("¡Post generado exitosamente!");
      } else {
        const errorMessage = {
          role: "assistant" as const,
          content: `Lo siento, hubo un error: ${response.message}`
        };
        setConversation(prev => [...prev, errorMessage]);
        
        toast.error(response.message);
        
        // Handle specific error cases
        if (response.status === 'error' && response.error.code === 'COMPANY_INFO_REQUIRED') {
          toast.info('Completa tu información de empresa primero', {
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = {
        role: "assistant" as const,
        content: 'Ocurrió un error inesperado al generar el contenido. Por favor, intenta nuevamente.'
      };
      setConversation(prev => [...prev, errorMessage]);
      toast.error('Error inesperado al generar contenido');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate content (create variation)
  const handleRegenerate = useCallback(async () => {
    if (!lastGenerated) {
      toast.error("No hay contenido previo para regenerar");
      return;
    }

    if (!objectiveId) {
      toast.error("Por favor selecciona un objetivo");
      return;
    }

    setIsRegenerating(true);

    // Add user request to conversation
    const userMessage = { role: "user" as const, content: "Genera una nueva versión" };
    setConversation(prev => [...prev, userMessage]);

    try {
      const request: RegenerateContentRequest = {
        previous_content: lastGenerated.content,
        original_message: lastGenerated.originalMessage,
        post_id: lastGenerated.postId, // Use post_id for better regeneration
        objective_id: objectiveId,
        style_id: styleId,
        previous_image_path: lastGenerated.imageUrl,
      };

      const response = await contentService.regenerateContent(request);

      if (ApiResponseHandler.isSuccess(response)) {
        const { content, image_url } = response.data;
        
        // Update stored content
        setLastGenerated({
          content,
          imageUrl: image_url,
          originalMessage: lastGenerated.originalMessage,
          postId: response.data.post_id
        });

        // Parse content
        const parsed = parseGeneratedContent(content);
        
        // Get style name
        const styleName = styles.find(s => s.id === styleId)?.name || 'moderno';

        // Add assistant message
        const assistantMessage = {
          role: "assistant" as const,
          content: `Aquí está una nueva versión:\n\n${parsed.bodyText}\n\n${parsed.cta}\n\n${parsed.hashtags.join(' ')}`
        };
        setConversation(prev => [...prev, assistantMessage]);

        // Update preview
        const generatedPost = {
          image_url: image_url || lastGenerated.imageUrl,
          title: parsed.bodyText.split('\n')[0] || "Post Regenerado",
          subtitle: styleName,
          caption: parsed.fullCaption,
          hashtags: parsed.hashtags
        };

        onPostGenerated(generatedPost);
        toast.success("¡Nueva variación generada!");
      } else {
        const errorMessage = {
          role: "assistant" as const,
          content: `Lo siento, hubo un error: ${response.message}`
        };
        setConversation(prev => [...prev, errorMessage]);
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error regenerating content:', error);
      const errorMessage = {
        role: "assistant" as const,
        content: 'Ocurrió un error al regenerar el contenido. Por favor, intenta nuevamente.'
      };
      setConversation(prev => [...prev, errorMessage]);
      toast.error('Error inesperado al regenerar contenido');
    } finally {
      setIsRegenerating(false);
    }
  }, [lastGenerated, objectiveId, styleId, styles, onPostGenerated]);

  // Pass regenerate function to parent only when lastGenerated changes
  useEffect(() => {
    if (onRegenerateCallback) {
      if (lastGenerated) {
        onRegenerateCallback(() => handleRegenerate());
        hasNotifiedCallbackRef.current = true;
      } else if (hasNotifiedCallbackRef.current) {
        onRegenerateCallback(null);
        hasNotifiedCallbackRef.current = false;
      }
    }
  }, [lastGenerated]); // Solo depende de lastGenerated, no de handleRegenerate

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-2">Crear Post</h2>
      <p className="text-muted-foreground mb-8">
        Describe qué tipo de contenido quieres crear y nuestra IA lo generará para ti
      </p>

      {/* Conversation area */}
      {conversation.length > 0 && (
        <div className="mb-6 space-y-4">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
            >
              <div
                className={`max-w-2xl p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground ml-12"
                    : "glass mr-12"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold">Crea AI</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input form */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="message">¿Qué quieres comunicar?</Label>
          <Textarea
            id="message"
            placeholder="Ej: Quiero promocionar nuestro nuevo servicio de consultoría digital que ayuda a empresas a digitalizar sus procesos..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Objetivo del post</Label>
            <Select 
              value={objectiveId?.toString()} 
              onValueChange={(val) => setObjectiveId(Number(val))} 
              disabled={catalogsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={catalogsLoading ? "Cargando..." : "Selecciona un objetivo"} />
              </SelectTrigger>
              <SelectContent>
                {objectives.filter(obj => obj.is_active).map((objectiveItem) => (
                  <SelectItem key={objectiveItem.id} value={objectiveItem.id.toString()}>
                    {objectiveItem.name.charAt(0).toUpperCase() + objectiveItem.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estilo visual</Label>
            <Select 
              value={styleId?.toString()} 
              onValueChange={(val) => setStyleId(Number(val))} 
              disabled={catalogsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={catalogsLoading ? "Cargando..." : "Selecciona un estilo"} />
              </SelectTrigger>
              <SelectContent>
                {styles.filter(styleItem => styleItem.is_active).map((styleItem) => (
                  <SelectItem key={styleItem.id} value={styleItem.id.toString()}>
                    {styleItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Subir imagen (opcional)</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          {!imageFile ? (
            <label
              htmlFor="image-upload"
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer group block"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-sm text-muted-foreground">
                Arrastra una imagen o haz click para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Máx. 10MB - JPG, PNG, WEBP
              </p>
            </label>
          ) : (
            <div className="border-2 border-primary rounded-xl p-4 flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{imageFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || isRegenerating}
            className="flex-1 h-12 text-base font-semibold"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-5 h-5" />
                Generar Post
              </>
            )}
          </Button>

          {lastGenerated && (
            <Button
              onClick={handleRegenerate}
              disabled={isGenerating || isRegenerating}
              variant="outline"
              className="h-12 px-6"
              size="lg"
              title="Generar nueva versión"
            >
              {isRegenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
