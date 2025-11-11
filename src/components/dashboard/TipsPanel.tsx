import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const TipsPanel = () => {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Consejos para Mejores Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Tip 1: Mensaje claro */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="default" className="mt-0.5">1</Badge>
            <div className="flex-1">
              <p className="font-semibold">Mensaje Claro y Específico</p>
              <p className="text-muted-foreground text-xs mt-1">
                En lugar de "Quiero promocionar productos", escribe "Taladros DeWalt 50% descuento solo hoy"
              </p>
            </div>
          </div>
          <div className="ml-7 space-y-1">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
              <span>El sistema detectará: intención promocional + foco en producto</span>
            </div>
          </div>
        </div>

        {/* Tip 2: Configura contexto */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="default" className="mt-0.5">2</Badge>
            <div className="flex-1">
              <p className="font-semibold">Configura tu Contexto IA</p>
              <p className="text-muted-foreground text-xs mt-1">
                Ve a "Info de Empresa" → "Contexto IA" y completa todos los campos
              </p>
            </div>
          </div>
          <div className="ml-7 space-y-1">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
              <span>Business Type: Define si usas productos o personas</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
              <span>Photography Style: Controla el tipo de imágenes</span>
            </div>
          </div>
        </div>

        {/* Tip 3: Descripciones de estilos */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="default" className="mt-0.5">3</Badge>
            <div className="flex-1">
              <p className="font-semibold">Define Estilos con Detalle</p>
              <p className="text-muted-foreground text-xs mt-1">
                En "Catálogos" → "Estilos", agrega descripciones específicas
              </p>
            </div>
          </div>
          <div className="ml-7 space-y-1">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
              <span>Incluye: tipo de fondo, tamaños de tipografía, elementos prohibidos</span>
            </div>
          </div>
        </div>

        {/* Tip 4: Paleta de colores */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="default" className="mt-0.5">4</Badge>
            <div className="flex-1">
              <p className="font-semibold">Paleta de Colores Clara</p>
              <p className="text-muted-foreground text-xs mt-1">
                Define 2-3 colores principales en "Branding"
              </p>
            </div>
          </div>
          <div className="ml-7 space-y-1">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
              <span>El sistema analizará y aplicará automáticamente</span>
            </div>
          </div>
        </div>

        {/* Tip 5: Variaciones coherentes */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="default" className="mt-0.5">5</Badge>
            <div className="flex-1">
              <p className="font-semibold">Variaciones Inteligentes</p>
              <p className="text-muted-foreground text-xs mt-1">
                El botón "Regenerar" crea variaciones diferentes pero coherentes
              </p>
            </div>
          </div>
          <div className="ml-7 space-y-1">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
              <span>Mantiene: intención, estilo, paleta, mensaje</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
              <span>Varía: composición, ángulos, jerarquía</span>
            </div>
          </div>
        </div>

        {/* Ejemplos prácticos */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
          <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            📊 Ejemplos de Mensajes Efectivos:
          </p>
          <div className="space-y-2 text-xs text-yellow-800 dark:text-yellow-200">
            <div>
              <p className="font-medium">✓ Horario informativo:</p>
              <p className="italic">"Hoy laboraremos de 8:00 am a 1:00 pm"</p>
              <p className="text-[10px] text-muted-foreground">→ Post limpio, tipografía grande</p>
            </div>
            <div>
              <p className="font-medium">✓ Promoción:</p>
              <p className="italic">"50% descuento en todos los taladros DeWalt"</p>
              <p className="text-[10px] text-muted-foreground">→ Post dinámico, producto visible</p>
            </div>
            <div>
              <p className="font-medium">✓ Anuncio:</p>
              <p className="italic">"Nuevo servicio de consultoría digital para empresas"</p>
              <p className="text-[10px] text-muted-foreground">→ Post impactante, imagen profesional</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

