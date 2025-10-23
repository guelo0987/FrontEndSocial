import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Image, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Crea AI</span>
          </div>
          <Button onClick={() => navigate("/auth")} variant="outline">
            Iniciar Sesión
          </Button>
        </nav>

        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Crea contenido para
            <br />
            <span className="text-gradient">Instagram</span> con IA
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Genera posts profesionales en segundos. Diseños únicos, captions
            atractivos y hashtags optimizados, todo con inteligencia artificial.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="h-14 px-8 text-lg group"
          >
            Comenzar gratis
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-8 hover-lift">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Generación Rápida</h3>
            <p className="text-muted-foreground">
              Crea posts profesionales en segundos. Solo describe tu idea y deja
              que la IA haga el resto.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 hover-lift">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Diseños Únicos</h3>
            <p className="text-muted-foreground">
              Cada post es único. Personaliza colores, estilos y formatos según
              tu marca.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 hover-lift">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Captions Perfectos</h3>
            <p className="text-muted-foreground">
              Genera textos atractivos con hashtags optimizados para máximo
              alcance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
