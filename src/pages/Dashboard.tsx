import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreatePostSection } from "@/components/dashboard/CreatePostSection";
import { InstagramPreview } from "@/components/dashboard/InstagramPreview";
import { CompanyInfoSection } from "@/components/dashboard/CompanyInfoSection";
import { PostsSection } from "@/components/dashboard/PostsSection";
import { TemplateManager } from "@/components/dashboard/TemplateManager";
import { CatalogManager } from "@/components/dashboard/CatalogManager";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("crear");
  const [generatedPost, setGeneratedPost] = useState<{
    image_url: string;
    title: string;
    subtitle: string;
    caption: string;
    hashtags: string[];
  } | null>(null);
  const [regenerateCallback, setRegenerateCallback] = useState<{ fn: (() => void) | null }>({ fn: null });
  

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-surface">
      <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {activeSection === "crear" && (
              <CreatePostSection 
                onPostGenerated={setGeneratedPost}
                onRegenerateCallback={(callback) => setRegenerateCallback({ fn: callback })}
              />
            )}
            {activeSection === "historial" && (
              <div className="animate-fade-in">
                <PostsSection />
              </div>
            )}
            {activeSection === "empresa" && (
              <div className="animate-fade-in">
                <CompanyInfoSection />
              </div>
            )}
            {activeSection === "plantillas" && (
              <div className="animate-fade-in">
                <TemplateManager />
              </div>
            )}
            {activeSection === "catalogos" && (
              <div className="animate-fade-in">
                <CatalogManager />
              </div>
            )}
          </main>

          {/* Preview Panel - Right side */}
          <aside className="hidden xl:block w-[380px] border-l border-border bg-background p-6 overflow-y-auto">
            <InstagramPreview 
              post={generatedPost} 
              onRegenerate={regenerateCallback.fn || undefined}
              onSave={() => {
                // TODO: Implement save functionality
                console.log('Save post:', generatedPost);
              }}
            />
          </aside>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
