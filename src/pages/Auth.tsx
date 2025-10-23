import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // Simulate authentication
    localStorage.setItem("isAuthenticated", "true");
    toast.success(isLogin ? "¡Bienvenido de vuelta!" : "¡Cuenta creada exitosamente!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Crea AI</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {isLogin ? "Bienvenido" : "Comienza ahora"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Ingresa a tu cuenta para continuar"
                : "Crea tu cuenta y empieza a generar contenido"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold group"
              size="lg"
            >
              {isLogin ? "Iniciar sesión" : "Crear cuenta"}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? (
                <>
                  ¿No tienes cuenta?{" "}
                  <span className="text-primary font-semibold">Regístrate</span>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <span className="text-primary font-semibold">Inicia sesión</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Hero visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-secondary to-accent items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative z-10 text-center text-white animate-scale-in">
          <div className="mb-8">
            <Sparkles className="w-20 h-20 mx-auto mb-6 animate-pulse" />
          </div>
          <h2 className="text-5xl font-bold mb-4">
            Crea contenido
            <br />
            increíble con IA
          </h2>
          <p className="text-xl opacity-90 max-w-md mx-auto">
            Genera posts profesionales para Instdagram en segundos con nuestra
            inteligencia artificial
          </p>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-3xl backdrop-blur-sm animate-float" style={{ animationDelay: "0s" }}></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-2xl backdrop-blur-sm animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 right-40 w-16 h-16 bg-white/10 rounded-xl backdrop-blur-sm animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Auth;
