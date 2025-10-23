import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCatalogs } from "@/hooks/useCatalogs";

interface CreatePostSectionProps {
  onPostGenerated: (post: {
    image: string;
    title: string;
    subtitle: string;
    caption: string;
    hashtags: string[];
  }) => void;
}

export const CreatePostSection = ({ onPostGenerated }: CreatePostSectionProps) => {
  const [message, setMessage] = useState("");
  const [objective, setObjective] = useState("");
  const [style, setStyle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    role: "user" | "assistant";
    content: string;
  }>>([]);

  const { objectives, styles, isLoading: catalogsLoading } = useCatalogs();

  const handleGenerate = async () => {
    if (!message.trim()) {
      toast.error("Por favor escribe un mensaje");
      return;
    }

    if (!objective) {
      toast.error("Por favor selecciona un objetivo");
      return;
    }

    setIsGenerating(true);
    
    // Add user message to conversation
    const userMessage = { role: "user" as const, content: message };
    setConversation(prev => [...prev, userMessage]);

    // Simulate AI generation
    setTimeout(() => {
      const generatedPost = {
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
        title: "Innovación Digital",
        subtitle: "El Futuro es Ahora",
        caption: `¡Descubre cómo la tecnología está transformando nuestro negocio! 🚀\n\n${message}\n\nEstamos comprometidos con la innovación y la excelencia. Únete a nosotros en este viaje hacia el futuro.`,
        hashtags: ["#Innovacion", "#TechLife", "#DigitalTransformation", "#Emprendimiento", "#Negocios"]
      };

      const assistantMessage = {
        role: "assistant" as const,
        content: `He generado un post ${style || "moderno"} con el objetivo de ${objective}. Aquí está tu contenido:\n\n**Título:** ${generatedPost.title}\n**Subtítulo:** ${generatedPost.subtitle}\n\n**Caption:**\n${generatedPost.caption}\n\n**Hashtags:**\n${generatedPost.hashtags.join(" ")}`
      };

      setConversation(prev => [...prev, assistantMessage]);
      onPostGenerated(generatedPost);
      setMessage("");
      setIsGenerating(false);
      toast.success("¡Post generado exitosamente!");
    }, 2000);
  };

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
            <Select value={objective} onValueChange={setObjective} disabled={catalogsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={catalogsLoading ? "Cargando..." : "Selecciona un objetivo"} />
              </SelectTrigger>
              <SelectContent>
                {objectives.filter(obj => obj.is_active).map((objectiveItem) => (
                  <SelectItem key={objectiveItem.id} value={objectiveItem.name}>
                    {objectiveItem.name.charAt(0).toUpperCase() + objectiveItem.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estilo visual</Label>
            <Select value={style} onValueChange={setStyle} disabled={catalogsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={catalogsLoading ? "Cargando..." : "Selecciona un estilo"} />
              </SelectTrigger>
              <SelectContent>
                {styles.filter(styleItem => styleItem.is_active).map((styleItem) => (
                  <SelectItem key={styleItem.id} value={styleItem.name}>
                    {styleItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Subir imagen (opcional)</Label>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer group">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="text-sm text-muted-foreground">
              Arrastra una imagen o haz click para seleccionar
            </p>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-12 text-base font-semibold"
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
      </div>
    </div>
  );
};
