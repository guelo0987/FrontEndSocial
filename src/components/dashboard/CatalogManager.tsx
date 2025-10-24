import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Target, 
  Palette, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { catalogService, type CreateObjectiveRequest, type UpdateObjectiveRequest, type CreateStyleRequest, type UpdateStyleRequest } from '@/services/catalogService';
import { useNotifications, ApiResponseHandler } from '@/helpers';
import type { PostObjective, VisualStyle } from '@/models';

export const CatalogManager = () => {
  const [activeTab, setActiveTab] = useState('objectives');
  const [isLoading, setIsLoading] = useState(true);
  const [objectives, setObjectives] = useState<PostObjective[]>([]);
  const [styles, setStyles] = useState<VisualStyle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PostObjective | VisualStyle | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  const { success, error, info } = useNotifications();

  // Load data
  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    try {
      setIsLoading(true);
      const response = await catalogService.loadAllCatalogs();
      
      if (ApiResponseHandler.isSuccess(response)) {
        setObjectives(response.data.objectives);
        setStyles(response.data.styles);
      } else {
        error({
          title: 'Error al cargar catálogos',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error loading catalogs:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudieron cargar los catálogos'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on search and active status
  const filteredObjectives = objectives.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesActive = showInactive || item.is_active;
    return matchesSearch && matchesActive;
  });

  const filteredStyles = styles.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesActive = showInactive || item.is_active;
    return matchesSearch && matchesActive;
  });

  // Form handlers
  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      is_active: true
    });
    setEditingItem(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (item: PostObjective | VisualStyle) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      is_active: item.is_active
    });
    setIsEditDialogOpen(true);
  };

  // Create handlers
  const handleCreateObjective = async () => {
    try {
      const data: CreateObjectiveRequest = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active
      };

      const response = await catalogService.createObjective(data);
      
      if (ApiResponseHandler.isSuccess(response)) {
        setObjectives(prev => [...prev, response.data]);
        setIsCreateDialogOpen(false);
        resetForm();
        success({
          title: 'Objetivo creado',
          description: 'El objetivo se ha creado exitosamente'
        });
      } else {
        error({
          title: 'Error al crear objetivo',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error creating objective:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo crear el objetivo'
      });
    }
  };

  const handleCreateStyle = async () => {
    try {
      const data: CreateStyleRequest = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active
      };

      const response = await catalogService.createStyle(data);
      
      if (ApiResponseHandler.isSuccess(response)) {
        setStyles(prev => [...prev, response.data]);
        setIsCreateDialogOpen(false);
        resetForm();
        success({
          title: 'Estilo creado',
          description: 'El estilo se ha creado exitosamente'
        });
      } else {
        error({
          title: 'Error al crear estilo',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error creating style:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo crear el estilo'
      });
    }
  };

  // Update handlers
  const handleUpdateObjective = async () => {
    if (!editingItem) return;

    try {
      const data: UpdateObjectiveRequest = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active
      };

      const response = await catalogService.updateObjective(editingItem.id, data);
      
      if (ApiResponseHandler.isSuccess(response)) {
        setObjectives(prev => prev.map(item => 
          item.id === editingItem.id ? response.data : item
        ));
        setIsEditDialogOpen(false);
        resetForm();
        success({
          title: 'Objetivo actualizado',
          description: 'El objetivo se ha actualizado exitosamente'
        });
      } else {
        error({
          title: 'Error al actualizar objetivo',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error updating objective:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo actualizar el objetivo'
      });
    }
  };

  const handleUpdateStyle = async () => {
    if (!editingItem) return;

    try {
      const data: UpdateStyleRequest = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active
      };

      const response = await catalogService.updateStyle(editingItem.id, data);
      
      if (ApiResponseHandler.isSuccess(response)) {
        setStyles(prev => prev.map(item => 
          item.id === editingItem.id ? response.data : item
        ));
        setIsEditDialogOpen(false);
        resetForm();
        success({
          title: 'Estilo actualizado',
          description: 'El estilo se ha actualizado exitosamente'
        });
      } else {
        error({
          title: 'Error al actualizar estilo',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error updating style:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo actualizar el estilo'
      });
    }
  };

  const handleCreate = () => {
    if (activeTab === 'objectives') {
      handleCreateObjective();
    } else {
      handleCreateStyle();
    }
  };

  const handleUpdate = () => {
    if (activeTab === 'objectives') {
      handleUpdateObjective();
    } else {
      handleUpdateStyle();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Gestión de Catálogos</h2>
        <p className="text-muted-foreground">
          Administra los objetivos de posts y estilos visuales disponibles
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="objectives" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Objetivos
          </TabsTrigger>
          <TabsTrigger value="styles" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Estilos
          </TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={`Buscar ${activeTab === 'objectives' ? 'objetivos' : 'estilos'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="show-inactive"
              checked={showInactive}
              onCheckedChange={setShowInactive}
            />
            <Label htmlFor="show-inactive">Mostrar inactivos</Label>
          </div>
        </div>

        {/* Objectives Tab */}
        <TabsContent value="objectives" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Objetivos de Posts</h3>
              <p className="text-sm text-muted-foreground">
                {filteredObjectives.length} objetivo(s) encontrado(s)
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nuevo Objetivo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Objetivo</DialogTitle>
                  <DialogDescription>
                    Define un nuevo objetivo para los posts generados
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Ej: Promoción, Educación, Entretenimiento"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Describe el propósito de este objetivo..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleFormChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Activo</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                    Crear
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredObjectives.map((objective) => (
                  <TableRow key={objective.id}>
                    <TableCell className="font-medium">{objective.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {objective.description || 'Sin descripción'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={objective.is_active ? 'default' : 'secondary'}>
                        {objective.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(objective)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Styles Tab */}
        <TabsContent value="styles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Estilos Visuales</h3>
              <p className="text-sm text-muted-foreground">
                {filteredStyles.length} estilo(s) encontrado(s)
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nuevo Estilo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Estilo</DialogTitle>
                  <DialogDescription>
                    Define un nuevo estilo visual para los posts generados
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Ej: Moderno, Minimalista, Creativo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Describe las características de este estilo..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleFormChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Activo</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                    Crear
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStyles.map((style) => (
                  <TableRow key={style.id}>
                    <TableCell className="font-medium">{style.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {style.description || 'Sin descripción'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={style.is_active ? 'default' : 'secondary'}>
                        {style.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(style)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar {activeTab === 'objectives' ? 'Objetivo' : 'Estilo'}
            </DialogTitle>
            <DialogDescription>
              Modifica la información del {activeTab === 'objectives' ? 'objetivo' : 'estilo'} seleccionado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder={`Nombre del ${activeTab === 'objectives' ? 'objetivo' : 'estilo'}`}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Descripción detallada..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleFormChange('is_active', checked)}
              />
              <Label htmlFor="edit-is_active">Activo</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.name.trim()}>
              Actualizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
