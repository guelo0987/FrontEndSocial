# 📋 Integración de Catálogos - Frontend

## 🎯 Descripción General

El sistema ahora utiliza tablas de catálogos (`PostObjective` y `VisualStyle`) para mantener la integridad referencial de los posts. Esto significa que en lugar de usar strings libres para objetivos y estilos, ahora usamos IDs que referencian a estas tablas.

## 📊 Modelos Actualizados

### PostObjective
```typescript
interface PostObjective {
  id: number;
  name: string;          // "promoción", "educativo", etc.
  description?: string;
  is_active: boolean;
}
```

### VisualStyle
```typescript
interface VisualStyle {
  id: number;
  name: string;          // "Moderno", "Minimalista", etc.
  description?: string;
  is_active: boolean;
}
```

### GeneratedPost (Actualizado)
```typescript
interface GeneratedPost {
  // ... otros campos
  objective_id: number;   // ✅ NUEVO: FK a post_objectives
  objective?: string;     // Nombre del objetivo (JOIN)
  style_id: number;       // ✅ NUEVO: FK a visual_styles  
  style?: string;         // Nombre del estilo (JOIN)
  // ... otros campos
}
```

## 🚀 Cómo Usar

### 1. Cargar Catálogos con el Hook

```typescript
import { useCatalogs } from '@/hooks/useCatalogs';

function MyComponent() {
  const { objectives, styles, isLoading, error } = useCatalogs();

  if (isLoading) return <div>Cargando catálogos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <select>
        {objectives.map(obj => (
          <option key={obj.id} value={obj.id}>
            {obj.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### 2. Usar el Servicio Directamente

```typescript
import { catalogService } from '@/services/catalogService';
import { ApiResponseHandler } from '@/helpers';

// Cargar objetivos
const loadObjectives = async () => {
  const response = await catalogService.getObjectives();
  if (ApiResponseHandler.isSuccess(response)) {
    console.log(response.data.objectives);
  }
};

// Cargar estilos
const loadStyles = async () => {
  const response = await catalogService.getStyles();
  if (ApiResponseHandler.isSuccess(response)) {
    console.log(response.data.styles);
  }
};

// Cargar ambos a la vez
const loadAll = async () => {
  const response = await catalogService.loadAllCatalogs();
  if (ApiResponseHandler.isSuccess(response)) {
    console.log(response.data.objectives);
    console.log(response.data.styles);
  }
};
```

### 3. Filtrar Posts por Catálogos

```typescript
import { postsService } from '@/services/postsService';

// Filtrar por nombre (la API convierte automáticamente)
const posts = await postsService.getPostsWithFilters({
  objective: 'promoción',  // Nombre del objetivo
  style: 'Moderno',        // Nombre del estilo
  platform: 'instagram',
  page: 1,
  per_page: 10
});
```

### 4. Componente con Carga Dinámica

El componente `PostsSection` ahora carga dinámicamente los catálogos desde la base de datos:

```typescript
import { useCatalogs } from '@/hooks/useCatalogs';

const { objectives, styles, isLoading: catalogsLoading } = useCatalogs();

// Los selectores se pueblan automáticamente con datos reales de la BD
<Select disabled={catalogsLoading}>
  <SelectItem value="all">Todos los objetivos</SelectItem>
  {objectives.filter(obj => obj.is_active).map((objective) => (
    <SelectItem key={objective.id} value={objective.name}>
      {objective.name.charAt(0).toUpperCase() + objective.name.slice(1)}
    </SelectItem>
  ))}
</Select>
```

## 📋 Catálogos Disponibles

### Objetivos
1. **promoción** - Posts promocionales de productos o servicios
2. **educativo** - Contenido educativo e informativo
3. **engagement** - Posts para aumentar la interacción
4. **anuncio** - Anuncios importantes y comunicados
5. **sorteo** - Sorteos y concursos
6. **testimonio** - Testimonios de clientes y casos de éxito
7. **evento** - Promoción de eventos y actividades

### Estilos Visuales
1. **Moderno** - Diseño contemporáneo y actual
2. **Minimalista** - Diseño limpio y simple
3. **Profesional** - Estilo corporativo y formal
4. **Creativo** - Diseño artístico e innovador
5. **Elegante** - Diseño sofisticado y refinado
6. **Divertido** - Diseño alegre y dinámico
7. **Vintage** - Estilo retro y clásico

## 🔄 Compatibilidad con la API

### Crear/Actualizar Posts

La API acepta dos formas de especificar objetivos y estilos:

#### Opción 1: Por Nombre (Más Simple)
```typescript
{
  post_objective: "promoción",
  post_style: "Moderno"
}
```

#### Opción 2: Por ID (Más Eficiente)
```typescript
{
  objective_id: 1,
  style_id: 1
}
```

#### Prioridad
Si envías ambos, la API prioriza los IDs.

### Filtrar Posts

Para filtrar, usa los **nombres** en los parámetros de búsqueda:

```typescript
{
  objective: "promoción",  // Nombre, no ID
  platform: "instagram",
  search: "texto a buscar"
}
```

## 📝 Ejemplo Completo: Selector de Catálogos

```typescript
import { useState } from 'react';
import { useCatalogs } from '@/hooks/useCatalogs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const PostForm = () => {
  const { objectives, styles, isLoading } = useCatalogs();
  const [selectedObjective, setSelectedObjective] = useState<number>(1);
  const [selectedStyle, setSelectedStyle] = useState<number>(1);

  if (isLoading) {
    return <div>Cargando catálogos...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label>Objetivo del Post</label>
        <Select 
          value={selectedObjective.toString()} 
          onValueChange={(value) => setSelectedObjective(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un objetivo" />
          </SelectTrigger>
          <SelectContent>
            {objectives.map(obj => (
              <SelectItem key={obj.id} value={obj.id.toString()}>
                {obj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label>Estilo Visual</label>
        <Select 
          value={selectedStyle.toString()} 
          onValueChange={(value) => setSelectedStyle(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estilo" />
          </SelectTrigger>
          <SelectContent>
            {styles.map(style => (
              <SelectItem key={style.id} value={style.id.toString()}>
                {style.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
```

## ✅ Beneficios

1. **Integridad de Datos**: No se pueden insertar valores inválidos
2. **Consistencia**: Todos usan los mismos valores
3. **Flexibilidad**: Fácil agregar nuevos objetivos/estilos
4. **Performance**: Queries más eficientes con JOINs
5. **UX Mejorada**: Selectores con valores predefinidos
6. **Mantenibilidad**: Código más limpio y mantenible

## 🔧 Archivos Relevantes

- **Modelos**: `src/models/GeneratedPost.ts`
- **Servicio**: `src/services/catalogService.ts`
- **Hook**: `src/hooks/useCatalogs.ts`
- **Endpoints**: `src/api/endpoints.ts`
- **Componentes**: `src/components/dashboard/PostsSection.tsx`

## 📞 API Endpoints

```
GET /api/catalog/objectives  - Lista todos los objetivos
GET /api/catalog/styles      - Lista todos los estilos
```

## ⚠️ Notas Importantes

1. **Carga Inicial**: Los catálogos se cargan una vez al inicio y se cachean
2. **Nombres vs IDs**: Para filtros usa nombres, para crear/actualizar puedes usar ambos
3. **Retrocompatibilidad**: La API sigue aceptando nombres por compatibilidad
4. **Validación**: La API valida que los IDs existan en las tablas
5. **Fallback**: Si un ID no existe, la API usa el primer registro por defecto

