import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { postsService, type PaginatedPostsResponse } from '@/services/postsService';
import { useNotifications, ApiResponseHandler } from '@/helpers';
import type { GeneratedPostResponse } from '@/models';

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

  const { success, error } = useNotifications();

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await postsService.getPosts(currentPage, 10);
      
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
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

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
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
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
    </div>
  );
};
