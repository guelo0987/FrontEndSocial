import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Filter,
  RefreshCw,
  Trash2,
  X
} from 'lucide-react';
import { postsService } from '@/services/postsService';
import { useNotifications, ApiResponseHandler } from '@/helpers';
import type { GeneratedPostResponse } from '@/models';
import { useCatalogs } from '@/hooks/useCatalogs';

export const PostsSection = () => {
  const [posts, setPosts] = useState<GeneratedPostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    pages: 1,
    has_next: false,
    has_prev: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<GeneratedPostResponse | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    platform: 'all',
    objective: 'all',
    style: 'all',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc' as 'asc' | 'desc'
  });

  const { success, error } = useNotifications();
  const { objectives, styles, isLoading: catalogsLoading } = useCatalogs();

  // Debounce effect for search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Main effect for loading posts
  useEffect(() => {
    loadPosts();
  }, [currentPage, filters]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      // Clean filters - convert "all" to empty string and remove empty values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key, 
          value === 'all' || value === '' ? '' : value
        ])
      );
      
      const hasFilters = Object.values(cleanFilters).some(value => value !== '');
      const response = hasFilters 
        ? await postsService.getPostsWithFilters({ ...cleanFilters, page: currentPage, per_page: 10 })
        : await postsService.getPosts(currentPage, 10);
      
      if (ApiResponseHandler.isSuccess(response)) {
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
        success({
          title: 'Posts cargados',
          description: `Se cargaron ${response.data.posts.length} posts`
        });
      } else {
        error({
          title: 'Error al cargar posts',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudieron cargar los posts'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadPosts();
  };

  const handleNextPage = () => {
    if (pagination.has_next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.has_prev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await postsService.deletePost(postId);
      
      if (ApiResponseHandler.isSuccess(response)) {
        success({
          title: 'Post eliminado',
          description: 'El post ha sido eliminado exitosamente'
        });
        loadPosts(); // Recargar la lista
      } else {
        error({
          title: 'Error al eliminar',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo eliminar el post'
      });
    }
  };

  const handleViewPost = async (postId: number) => {
    try {
      const response = await postsService.getPostById(postId);
      
      if (ApiResponseHandler.isSuccess(response)) {
        setSelectedPost(response.data);
      } else {
        error({
          title: 'Error al cargar post',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error loading post:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo cargar el post'
      });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: 'all',
      platform: 'all',
      objective: 'all',
      style: 'all',
      search: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'published': return 'Publicado';
      case 'scheduled': return 'Programado';
      case 'failed': return 'Fallido';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Historial de Posts</h2>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Historial de Posts</h2>
          <p className="text-muted-foreground">
            {pagination.total} posts encontrados
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <Input
                placeholder="Buscar en posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="scheduled">Programado</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Plataforma</label>
              <Select value={filters.platform} onValueChange={(value) => handleFilterChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las plataformas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las plataformas</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Objetivo</label>
              <Select value={filters.objective} onValueChange={(value) => handleFilterChange('objective', value)} disabled={catalogsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={catalogsLoading ? "Cargando..." : "Todos los objetivos"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los objetivos</SelectItem>
                  {objectives.filter(obj => obj.is_active).map((objective) => (
                    <SelectItem key={objective.id} value={objective.name}>
                      {objective.name.charAt(0).toUpperCase() + objective.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Estilo</label>
              <Select value={filters.style || 'all'} onValueChange={(value) => handleFilterChange('style', value)} disabled={catalogsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={catalogsLoading ? "Cargando..." : "Todos los estilos"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estilos</SelectItem>
                  {styles.filter(style => style.is_active).map((style) => (
                    <SelectItem key={style.id} value={style.name}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Limpiar filtros
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {Object.values(filters).filter(value => value !== '').length} filtros activos
            </div>
          </div>
        </Card>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay posts</h3>
          <p className="text-muted-foreground mb-4">
            Aún no has creado ningún post. ¡Comienza creando tu primer post!
          </p>
          <Button>
            Crear mi primer post
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Instagram-style post header */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">FG</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Ferreteria Gigante</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewPost(post.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar post?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El post será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePost(post.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>

                {/* Post image */}
                <div className="relative">
                  {post.image_url ? (
                    <img 
                      src={post.image_url.startsWith('http') ? post.image_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${post.image_url}`}
                      alt="Post image"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        (e.currentTarget.nextElementSibling as HTMLElement)?.style.setProperty('display', 'flex');
                      }}
                    />
                  ) : null}
                  <div className="w-full h-64 bg-muted flex items-center justify-center" style={{ display: post.image_url ? 'none' : 'flex' }}>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Sin imagen</p>
                    </div>
                  </div>
                </div>

                {/* Post content */}
                <CardContent className="p-4 space-y-3">
                  {/* Engagement buttons */}
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Post text */}
                  <div className="space-y-2">
                    {post.title && (
                      <p className="font-semibold text-sm">{post.title}</p>
                    )}
                    {post.subtitle && (
                      <p className="text-sm text-muted-foreground">{post.subtitle}</p>
                    )}
                    <p className="text-sm line-clamp-3">
                      {post.content}
                    </p>
                  </div>

                  {/* Post metadata */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Badge>
                    {post.style && (
                      <Badge variant="outline">
                        {post.style}
                      </Badge>
                    )}
                    {post.objective && (
                      <Badge variant="outline">
                        {post.objective}
                      </Badge>
                    )}
                  </div>

                  {/* Post stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>0 vistas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>0 likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>0 comentarios</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage}
                disabled={!pagination.has_prev}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {pagination.page} de {pagination.pages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage}
                disabled={!pagination.has_next}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      {/* Post Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Post</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Información completa del post seleccionado
            </p>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-6">
              {/* Post Header */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">FG</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">Ferreteria Gigante</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedPost.created_at)}
                  </p>
                </div>
              </div>

              {/* Post Image - Full Width and Better Aspect Ratio */}
              {selectedPost.image_url && (
                <div className="relative w-full">
                  <img 
                    src={selectedPost.image_url.startsWith('http') ? selectedPost.image_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${selectedPost.image_url}`}
                    alt="Post image"
                    className="w-full max-h-96 object-contain rounded-lg border shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="space-y-4">
                {selectedPost.title && (
                  <div>
                    <h3 className="font-semibold text-xl">{selectedPost.title}</h3>
                  </div>
                )}
                {selectedPost.subtitle && (
                  <div>
                    <p className="text-muted-foreground text-lg">{selectedPost.subtitle}</p>
                  </div>
                )}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-base leading-relaxed">{selectedPost.content}</p>
                </div>
              </div>

              {/* Post Metadata - Better Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">Estado</label>
                    <Badge variant="secondary" className={getStatusColor(selectedPost.status)}>
                      {getStatusText(selectedPost.status)}
                    </Badge>
                  </div>
                  
                  {selectedPost.platform && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">Plataforma</label>
                      <p className="text-base capitalize font-medium">{selectedPost.platform}</p>
                    </div>
                  )}
                  
                  {selectedPost.objective && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">Objetivo</label>
                      <p className="text-base capitalize font-medium">{selectedPost.objective}</p>
                    </div>
                  )}
                  
                  {selectedPost.style && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">Estilo</label>
                      <p className="text-base capitalize font-medium">{selectedPost.style}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {selectedPost.scheduled_for && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">Programado para</label>
                      <p className="text-base font-medium">{formatDate(selectedPost.scheduled_for)}</p>
                    </div>
                  )}
                  
                  {selectedPost.published_at && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">Publicado el</label>
                      <p className="text-base font-medium">{formatDate(selectedPost.published_at)}</p>
                    </div>
                  )}
                  
                  {selectedPost.post_url && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">URL del Post</label>
                      <a 
                        href={selectedPost.post_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block break-all"
                      >
                        {selectedPost.post_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
