import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, FileText, Settings, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import GalleryBeforeAfter from "@/components/GalleryBeforeAfter";
import Portfolio from "@/components/Portfolio";
import GoogleBusinessProfile from "@/components/GoogleBusinessProfile";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center flex-wrap">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/logo-horizontal.png" alt="Calhas Em Geral" className="h-10 md:h-14 w-auto object-contain" />
          </div>
          <div className="flex gap-2 md:gap-4 flex-wrap justify-end">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/budget")}>
                  Novo Orçamento
                </Button>
                <Button variant="ghost" onClick={() => navigate("/history")}>
                  Histórico
                </Button>
                {user?.role === "admin" && (
                  <Button variant="ghost" onClick={() => navigate("/admin")}>
                    Admin
                  </Button>
                )}
                <Button variant="outline" onClick={() => navigate("/profile")}>
                  Perfil
                </Button>
              </>
            ) : (
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <section 
        className="relative min-h-screen md:min-h-[600px] bg-cover bg-center bg-fixed flex items-center"
        style={{ backgroundImage: 'url(/hero-background.jpg)' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                Orçamentos de Calhas com <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Elegância</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-6 md:mb-8 drop-shadow-md">
                A solução completa para orçar calhas, rufos e pingadeiras com precisão e elegância.
              </p>
              <div className="flex gap-2 md:gap-4 flex-col sm:flex-row">
                {isAuthenticated ? (
                  <Button onClick={() => navigate("/budget")} className="gap-2 bg-orange-500 hover:bg-orange-600 w-full sm:w-auto text-sm md:text-base px-3 md:px-6 py-2 md:py-3">
                    Criar Orçamento <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                  </Button>
                ) : (
                  <Button asChild className="gap-2 bg-orange-500 hover:bg-orange-600 w-full sm:w-auto text-sm md:text-base px-3 md:px-6 py-2 md:py-3">
                    <a href={getLoginUrl()}>
                      Começar Agora <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="border-white text-white hover:bg-white/20 w-full sm:w-auto text-sm md:text-base px-3 md:px-6 py-2 md:py-3">
                  Saiba Mais
                </Button>
              </div>
            </div>
            <div className="relative mt-8 md:mt-0">
              <div className="bg-gradient-to-br from-blue-900/90 to-orange-500/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-white shadow-2xl">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Calculator className="w-6 md:w-8 h-6 md:h-8" />
                    <span className="text-base md:text-xl font-semibold">Cálculos Precisos</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Zap className="w-6 md:w-8 h-6 md:h-8" />
                    <span className="text-base md:text-xl font-semibold">Resultados Instantâneos</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <FileText className="w-6 md:w-8 h-6 md:h-8" />
                    <span className="text-base md:text-xl font-semibold">PDF Profissional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-16">
            Funcionalidades Principais
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <Card className="border-l-4 border-l-blue-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-blue-900">Formulário Interativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Selecione produtos, materiais e dimensões com facilidade. Interface intuitiva e responsiva.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-orange-500">Cálculos Automáticos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Cálculos precisos de m² e preços em tempo real. Suporte a múltiplas faixas de preço.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-blue-900">PDF Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Gere PDFs elegantes com descrições detalhadas. Pronto para impressão e compartilhamento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-orange-500">Histórico Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Acesse todos os seus orçamentos anteriores. Filtros e busca avançada para facilitar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-blue-900">WhatsApp Direto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Contato direto com clientes via WhatsApp. Links pré-formatados para facilitar comunicação.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-orange-500">Painel Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Gerencie produtos, materiais e preços. Visualize todos os orçamentos criados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GalleryBeforeAfter />

      {/* Portfolio Section */}
      <Portfolio />

      {/* Google Business Profile Section */}
      <GoogleBusinessProfile />

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-900 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">Pronto para Começar?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-blue-50">
            Crie seu primeiro orçamento agora e veja como é fácil!
          </p>
          {isAuthenticated ? (
            <Button size="lg" onClick={() => navigate("/budget")} className="gap-2 bg-white text-blue-900 hover:bg-slate-100">
              Criar Orçamento <ArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button size="lg" asChild className="gap-2 bg-white text-blue-900 hover:bg-slate-100">
              <a href={getLoginUrl()}>
                Entrar Agora <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <img src="/logo-horizontal.png" alt="Calhas Em Geral" className="h-20 w-auto mb-4 object-contain" />
              <p className="text-blue-100">
                Solução completa para orçamentos de calhas, rufos e pingadeiras.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Navegação</h3>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">Novo Orçamento</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Histórico</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <p className="text-blue-100">
                Entre em contato conosco para dúvidas ou sugestões.
              </p>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-8 text-center text-blue-100">
            <p>&copy; 2024 Calhas Em Geral. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
