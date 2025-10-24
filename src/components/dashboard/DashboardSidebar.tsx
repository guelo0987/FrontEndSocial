import { Sparkles, Palette, Building2, Image, Settings, LogOut, History, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const DashboardSidebar = ({ activeSection, setActiveSection }: DashboardSidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "crear", label: "Crear Post", icon: Palette },
    { id: "historial", label: "Historial", icon: History },
    { id: "empresa", label: "Info de Empresa", icon: Building2 },
    { id: "plantillas", label: "Plantillas", icon: Image },
    { id: "catalogos", label: "Catálogos", icon: Target },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">Crea AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Cerrar Sesión</span>
        </Button>
      </div>
    </aside>
  );
};
