import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Palette, Phone, Save, Loader2, Upload, Image, X, Sparkles, RefreshCw } from 'lucide-react';
import { companyInfoService } from '@/services/companyInfoService';
import { autoContextService } from '@/services/autoContextService';
import { useNotifications, ApiResponseHandler } from '@/helpers';
import type { CompanyInfoResponse, CompanyInfoCreateRequest, CompanyInfoUpdateRequest, BrandColors } from '@/models';

export const CompanyInfoSection = () => {
  const [, setCompanyInfo] = useState<CompanyInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasCompanyInfo, setHasCompanyInfo] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isGeneratingContext, setIsGeneratingContext] = useState(false);
  const [hasAutoContext, setHasAutoContext] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [formData, setFormData] = useState<CompanyInfoCreateRequest>({
    company_name: '',
    business_description: '',
    address: '',
    phone: '',
    website: '',
    email: '',
    hashtags: '',
    logo_path: '',
    template_style: 'modern',
    brand_colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    },
    // Nuevos campos de contexto de negocio
    business_type: '',
    photography_style: '',
    brand_personality: '',
    target_audience_details: '',
    visual_references: []
  });

  const { success, error, info } = useNotifications();

  // Helper function to build logo URL
  const buildLogoUrl = (logoPath: string) => {
    if (logoPath.startsWith('http')) {
      return logoPath;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    return `${baseUrl}${logoPath}`;
  };

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      setIsLoading(true);
      const response = await companyInfoService.getCompanyInfo();
      
      if (ApiResponseHandler.isSuccess(response)) {
        
        setCompanyInfo(response.data);
        setHasCompanyInfo(true);
        setFormData({
          company_name: response.data.company_name,
          business_description: response.data.business_description || '',
          address: response.data.address || '',
          phone: response.data.phone || '',
          website: response.data.website || '',
          email: response.data.email || '',
          hashtags: response.data.hashtags || '',
          logo_path: response.data.logo_path || '',
          template_style: response.data.template_style || 'modern',
          brand_colors: response.data.brand_colors || {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937'
          },
          // Nuevos campos de contexto de negocio
          business_type: response.data.business_type || '',
          photography_style: response.data.photography_style || '',
          brand_personality: response.data.brand_personality || '',
          target_audience_details: response.data.target_audience_details || '',
          visual_references: response.data.visual_references || []
        });
      } else if (ApiResponseHandler.isError(response) && response.error.code === 'NOT_FOUND') {
        setHasCompanyInfo(false);
        info({
          title: 'Configura tu empresa',
          description: 'Completa la información de tu empresa para personalizar tus posts'
        });
      } else {
        error({
          title: 'Error al cargar información',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error loading company info:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo cargar la información de la empresa'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (colorField: keyof BrandColors, value: string) => {
    setFormData(prev => ({
      ...prev,
      brand_colors: {
        ...prev.brand_colors,
        [colorField]: value
      }
    }));
  };

  // Generate context automatically with AI
  const handleGenerateContext = async (forceRegenerate: boolean = false) => {
    if (!hasCompanyInfo) {
      error({
        title: 'Información incompleta',
        description: 'Primero debes guardar la información básica de tu empresa (nombre y descripción)'
      });
      return;
    }

    try {
      setIsGeneratingContext(true);
      
      const response = await autoContextService.generateContext(forceRegenerate);
      
      if (ApiResponseHandler.isSuccess(response)) {
        const { context, was_generated } = response.data;
        
        // Update form with generated context
        setFormData(prev => ({
          ...prev,
          business_type: context.business_type,
          photography_style: context.photography_style,
          brand_personality: context.brand_personality,
          target_audience_details: context.target_audience_details,
          visual_references: context.visual_references
        }));
        
        setHasAutoContext(true);
        
        if (was_generated) {
          success({
            title: '¡Contexto generado con IA! ✨',
            description: 'Se ha generado automáticamente el contexto de tu negocio. Revísalo y guarda los cambios.'
          });
        } else {
          success({
            title: 'Contexto cargado',
            description: 'Se ha cargado el contexto existente'
          });
        }
      } else {
        error({
          title: 'Error al generar contexto',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error generating context:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo generar el contexto con IA'
      });
    } finally {
      setIsGeneratingContext(false);
    }
  };

  // Handle logo file selection
  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        error({
          title: 'Tipo de archivo no válido',
          description: 'Solo se permiten archivos PNG, JPG, JPEG, GIF, WebP y SVG'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        error({
          title: 'Archivo demasiado grande',
          description: 'El logo no puede superar los 5MB'
        });
        return;
      }
      
      setLogoFile(file);
      success({
        title: 'Logo seleccionado',
        description: 'Archivo listo para subir'
      });
    }
  };

  // Remove selected logo file
  const handleRemoveLogoFile = () => {
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload logo file
  const handleUploadLogo = async () => {
    if (!logoFile) {
      error({
        title: 'No hay archivo',
        description: 'Selecciona un archivo de logo primero'
      });
      return;
    }

    try {
      setIsUploadingLogo(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('logo', logoFile);
      
      // Add other company info fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'logo' && value !== '') {
          uploadFormData.append(key, value as string);
        }
      });

      let response;
      if (hasCompanyInfo) {
        // Update with logo
        response = await companyInfoService.updateCompanyInfoWithFile(uploadFormData);
      } else {
        // Create with logo
        response = await companyInfoService.createCompanyInfoWithFile(uploadFormData);
      }

      if (ApiResponseHandler.isSuccess(response)) {
        setCompanyInfo(response.data);
        setHasCompanyInfo(true);
        setLogoFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        success({
          title: 'Logo subido exitosamente',
          description: 'El logo de tu empresa se ha actualizado correctamente'
        });
      } else {
        error({
          title: 'Error al subir logo',
          description: response.message
        });
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo subir el logo'
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (hasCompanyInfo) {
        // Update existing company info
        const updateData: CompanyInfoUpdateRequest = { ...formData };
        const response = await companyInfoService.updateCompanyInfo(updateData);
        
        if (ApiResponseHandler.isSuccess(response)) {
          setCompanyInfo(response.data);
          success({
            title: 'Información actualizada',
            description: 'Los datos de tu empresa se han actualizado correctamente'
          });
        } else {
          error({
            title: 'Error al actualizar',
            description: response.message
          });
        }
      } else {
        // Create new company info
        const response = await companyInfoService.createCompanyInfo(formData);
        
        if (ApiResponseHandler.isSuccess(response)) {
          setCompanyInfo(response.data);
          setHasCompanyInfo(true);
          success({
            title: 'Información creada',
            description: 'Los datos de tu empresa se han guardado correctamente'
          });
        } else {
          error({
            title: 'Error al crear',
            description: response.message
          });
        }
      }
    } catch (err) {
      console.error('Error saving company info:', err);
      error({
        title: 'Error inesperado',
        description: 'No se pudo guardar la información'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando información de empresa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Información de Empresa
          </h2>
          <p className="text-muted-foreground">
            {hasCompanyInfo ? 'Actualiza la información de tu empresa' : 'Configura la información de tu empresa'}
          </p>
        </div>
        <Badge variant={hasCompanyInfo ? "default" : "secondary"}>
          {hasCompanyInfo ? 'Configurado' : 'Sin configurar'}
        </Badge>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="ai-context">Contexto IA</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Información Básica
              </CardTitle>
              <CardDescription>
                Datos principales de tu empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Nombre de la Empresa *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Mi Empresa S.A."
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_description">Descripción del Negocio</Label>
                <Textarea
                  id="business_description"
                  value={formData.business_description}
                  onChange={(e) => handleInputChange('business_description', e.target.value)}
                  placeholder="Describe qué hace tu empresa..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="logo_path">Logo de la Empresa</Label>
                
                {/* Vista previa del logo */}
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/10">
                      {formData.logo_path ? (
                        <img 
                          src={buildLogoUrl(formData.logo_path)} 
                          alt="Logo de la empresa" 
                          className="w-20 h-20 object-contain"
                        
                          onError={(e) => {
            
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className={`flex flex-col items-center justify-center text-muted-foreground ${formData.logo_path ? 'hidden' : 'flex'}`}>
                        <Image className="w-8 h-8 mb-2" />
                        <span className="text-xs text-center">Sin logo</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {/* File upload section */}
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                        onChange={handleLogoFileSelect}
                        className="hidden"
                        id="logo-upload"
                      />
                      
                      {!logoFile ? (
                        <label
                          htmlFor="logo-upload"
                          className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer group block"
                        >
                          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                          <p className="text-sm text-muted-foreground">
                            Haz click para seleccionar un logo
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF, WebP, SVG - Máx. 5MB
                          </p>
                        </label>
                      ) : (
                        <div className="border-2 border-primary rounded-lg p-4 flex items-center justify-between bg-primary/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Image className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{logoFile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              onClick={handleUploadLogo}
                              disabled={isUploadingLogo}
                              size="sm"
                              className="h-8"
                            >
                              {isUploadingLogo ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-1" />
                                  Subir
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveLogoFile}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* URL input section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Input
                            id="logo_path"
                            value={formData.logo_path}
                            onChange={(e) => handleInputChange('logo_path', e.target.value)}
                            placeholder="https://ejemplo.com/logo.png"
                            className="h-10"
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="h-10 px-4"
                          onClick={() => handleSave()}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        O ingresa la URL de tu logo directamente
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template_style">Estilo de Plantilla</Label>
                <select
                  id="template_style"
                  value={formData.template_style}
                  onChange={(e) => handleInputChange('template_style', e.target.value)}
                  className="w-full h-12 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="modern">Moderno</option>
                  <option value="classic">Clásico</option>
                  <option value="minimal">Minimalista</option>
                  <option value="creative">Creativo</option>
                  <option value="Minimalista y Enfocado">Minimalista y Enfocado</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Información de Contacto
              </CardTitle>
              <CardDescription>
                Datos de contacto de tu empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contacto@miempresa.com"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.miempresa.com"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Dirección completa de tu empresa..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Branding y Colores
              </CardTitle>
              <CardDescription>
                Personaliza los colores y hashtags de tu marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Colores de la Marca</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Color Primario</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="primary_color"
                        value={formData.brand_colors?.primary || '#3b82f6'}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-12 h-12 rounded border border-input"
                      />
                      <Input
                        value={formData.brand_colors?.primary || '#3b82f6'}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        placeholder="#3b82f6"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Color Secundario</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="secondary_color"
                        value={formData.brand_colors?.secondary || '#8b5cf6'}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="w-12 h-12 rounded border border-input"
                      />
                      <Input
                        value={formData.brand_colors?.secondary || '#8b5cf6'}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        placeholder="#8b5cf6"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent_color">Color de Acento</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="accent_color"
                        value={formData.brand_colors?.accent || '#f59e0b'}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-12 h-12 rounded border border-input"
                      />
                      <Input
                        value={formData.brand_colors?.accent || '#f59e0b'}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        placeholder="#f59e0b"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="hashtags">Hashtags de la Marca</Label>
                <Textarea
                  id="hashtags"
                  value={formData.hashtags}
                  onChange={(e) => handleInputChange('hashtags', e.target.value)}
                  placeholder="#miempresa #negocio #marca #empresa"
                  className="min-h-[80px]"
                />
                <p className="text-sm text-muted-foreground">
                  Separa los hashtags con espacios
                </p>
              </div>

              {/* Preview de colores */}
              <div className="space-y-2">
                <Label>Vista Previa de Colores</Label>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: formData.brand_colors?.background || '#ffffff' }}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full" 
                      style={{ backgroundColor: formData.brand_colors?.primary || '#3b82f6' }}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded-full" 
                      style={{ backgroundColor: formData.brand_colors?.secondary || '#8b5cf6' }}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded-full" 
                      style={{ backgroundColor: formData.brand_colors?.accent || '#f59e0b' }}
                    ></div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: formData.brand_colors?.text || '#1f2937' }}
                    >
                      {formData.company_name || 'Mi Empresa'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-context" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Contexto para IA - Sistema Inteligente
                  </CardTitle>
                  <CardDescription>
                    Este contexto alimenta el sistema de análisis inteligente que genera posts personalizados
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleGenerateContext(false)}
                    disabled={isGeneratingContext || !hasCompanyInfo}
                    variant="default"
                    size="sm"
                  >
                    {isGeneratingContext ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 w-4 h-4" />
                        Generar con IA
                      </>
                    )}
                  </Button>
                  {hasAutoContext && (
                    <Button
                      onClick={() => handleGenerateContext(true)}
                      disabled={isGeneratingContext || !hasCompanyInfo}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Alerta informativa mejorada */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-900">
                <div className="flex gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      💡 Cómo funciona el sistema inteligente:
                    </p>
                    <ul className="space-y-1 text-blue-800 dark:text-blue-200 list-disc list-inside">
                      <li><strong>Analiza tu mensaje:</strong> "Horario 8am-1pm" → Detecta intención informativa</li>
                      <li><strong>Interpreta el estilo:</strong> "Minimalista" → Aplica reglas concretas (fondo sólido, tipografía grande)</li>
                      <li><strong>Usa tu paleta:</strong> Extrae colores y los aplica específicamente</li>
                      <li><strong>Considera tu negocio:</strong> Ferreterías usan productos, marcas personales usan retratos</li>
                    </ul>
                    <p className="text-blue-900 dark:text-blue-100 font-medium mt-3">
                      ✨ Resultado: Posts que realmente reflejan tu marca y mensaje
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="business_type">Tipo de Negocio</Label>
                  <span className="text-xs text-muted-foreground">(Afecta si usa productos o personas en imágenes)</span>
                </div>
                <select
                  id="business_type"
                  value={formData.business_type}
                  onChange={(e) => handleInputChange('business_type', e.target.value)}
                  className="w-full h-12 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="retail">🏪 Retail / Comercio (Productos físicos)</option>
                  <option value="personal_brand">👤 Marca Personal (Influencer, Coach, Modelo)</option>
                  <option value="service">💼 Servicios Profesionales (Consultoría, Legal)</option>
                  <option value="education">📚 Educación (Cursos, Academia)</option>
                  <option value="beauty">💅 Belleza y Cuidado Personal (Salón, Spa)</option>
                  <option value="food">🍔 Restaurante / Comida</option>
                  <option value="technology">💻 Tecnología (Software, Tech)</option>
                  <option value="healthcare">⚕️ Salud y Bienestar (Médicos, Fitness)</option>
                  <option value="construction">🏗️ Construcción / Arquitectura</option>
                  <option value="other">❓ Otro</option>
                </select>
                <p className="text-sm text-muted-foreground">
                  <strong>Retail:</strong> Generará imágenes de productos. <strong>Personal Brand:</strong> Generará retratos profesionales.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="photography_style">Estilo Fotográfico Preferido</Label>
                  <span className="text-xs text-muted-foreground">(Define el tipo de imágenes generadas)</span>
                </div>
                <select
                  id="photography_style"
                  value={formData.photography_style}
                  onChange={(e) => handleInputChange('photography_style', e.target.value)}
                  className="w-full h-12 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="">Selecciona un estilo</option>
                  <option value="professional_portrait">📸 Retrato Profesional (Personas en estudio)</option>
                  <option value="lifestyle">🌟 Lifestyle (Personas usando productos/servicios)</option>
                  <option value="product_only">📦 Solo Producto (Sin personas, fondo limpio)</option>
                  <option value="editorial">📰 Editorial (Estilo revista/moda)</option>
                  <option value="commercial">🎬 Comercial (Publicidad profesional)</option>
                  <option value="documentary">📷 Documental (Realista, natural)</option>
                </select>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground"><strong>Product Only:</strong> Para ferreterías, tiendas.</p>
                  <p className="text-muted-foreground"><strong>Professional Portrait:</strong> Para coaches, modelos.</p>
                  <p className="text-muted-foreground"><strong>Lifestyle:</strong> Para servicios, productos en uso.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_personality">Personalidad de Marca</Label>
                <Textarea
                  id="brand_personality"
                  value={formData.brand_personality}
                  onChange={(e) => handleInputChange('brand_personality', e.target.value)}
                  placeholder="Ejemplos específicos:
          
• Ferretería: 'Confiable, profesional, orientada a resultados. Soluciones prácticas para construcción.'
• Coach Personal: 'Inspiradora, empática, motivacional. Enfoque en transformación personal.'
• Restaurante: 'Cálido, familiar, acogedor. Tradición y sabor casero.'
• Tech Startup: 'Innovadora, disruptiva, futurista. Soluciones cutting-edge.'"
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Sé específico. Esto define el tono visual y emocional de tus posts.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_audience_details">Público Objetivo</Label>
                <Textarea
                  id="target_audience_details"
                  value={formData.target_audience_details}
                  onChange={(e) => handleInputChange('target_audience_details', e.target.value)}
                  placeholder="Describe DETALLADAMENTE tu audiencia:

Ejemplo 1 (Ferretería):
'Constructores profesionales, maestros de obra, personal de mantenimiento. Edad 25-55 años, buscan herramientas de calidad, valoran durabilidad y precio justo.'

Ejemplo 2 (Coach):
'Profesionales 30-45 años, ejecutivos buscando desarrollo personal, emprendedores con estrés. Quieren resultados rápidos y prácticos.'

Ejemplo 3 (Restaurante):
'Familias locales, trabajadores de oficina cercanas, foodies. Buscan comida casera, ambiente acogedor, precios accesibles.'"
                  className="min-h-[140px]"
                />
                <p className="text-sm text-muted-foreground">
                  💡 Incluye: edad, ocupación, necesidades, valores, comportamiento.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visual_references">Referencias Visuales (Keywords)</Label>
                <Textarea
                  id="visual_references"
                  value={Array.isArray(formData.visual_references) ? formData.visual_references.join(', ') : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const references = value.split(',').map(ref => ref.trim()).filter(ref => ref !== '');
                    setFormData(prev => ({
                      ...prev,
                      visual_references: references
                    }));
                  }}
                  placeholder="Keywords visuales que definen tu estilo (separar por comas):

Ejemplo 1 (Ferretería):
'producto en acción, fondo de obra, iluminación comercial, textura industrial, colores tierra, herramientas profesionales'

Ejemplo 2 (Coach):
'luz natural, fondo neutro, retrato profesional, expresión motivacional, ambiente minimalista, colores cálidos'

Ejemplo 3 (Moda):
'iluminación dramática, fondo urbano, pose dinámica, estilo editorial, colores vibrantes, textura premium'"
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  💡 Estos keywords guían directamente la generación de imágenes.
                </p>
              </div>

              {/* Ejemplo visual de lo que lograrás */}
              <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                <p className="text-sm font-semibold mb-2">📊 Ejemplo de Análisis Generado:</p>
                <div className="text-xs space-y-1 text-muted-foreground font-mono">
                  <p><strong>Mensaje:</strong> "Hoy abierto 8am-1pm"</p>
                  <p><strong>Sistema detecta:</strong> informative → minimal → text-focused</p>
                  <p><strong>Resultado:</strong> Post limpio, tipografía grande, fondo sólido con tu paleta</p>
                  <div className="mt-2 p-2 bg-background rounded border text-[10px]">
                    <p>✓ Intención: informativa</p>
                    <p>✓ Estilo "Minimalista": fondo #FFFFFF, texto 80-120pt</p>
                    <p>✓ Paleta aplicada: {formData.brand_colors?.primary || '#3b82f6'}</p>
                    <p>✓ Logo: esquina superior derecha (8% margen)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !formData.company_name}
          className="h-12 px-8"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 w-4 h-4" />
              {hasCompanyInfo ? 'Actualizar Información' : 'Guardar Información'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
