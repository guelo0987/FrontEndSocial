import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const DashboardHeader = () => {
  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Crea contenido increíble con IA</p>
      </div>

      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          <User className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
    </header>
  );
};
