import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, FileText, Settings, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo-horizontal.png" alt="Calhas Em Geral" className="h-14 w-auto object-contain" />
          </div>
          <div className="flex gap-4">
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Orçamentos de Calhas com <span className="bg-gradient-to-r from-blue-900 to-orange-500 bg-clip-text text-transparent">Elegância</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              A solução completa para orçar calhas, rufos e pingadeiras com precisão e elegância.
            </p>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Button size="lg" onClick={() => navigate("/budget")} className="gap-2 bg-orange-500 hover:bg-orange-600">
                  Criar Orçamento <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button size="lg" asChild className="gap-2 bg-orange-500 hover:bg-orange-600">
                  <a href={getLoginUrl()}>
                    Começar Agora <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                Saiba Mais
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-900 to-orange-500 rounded-2xl p-8 text-white shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calculator className="w-8 h-8" />
                  <span className="text-xl font-semibold">Cálculos Precisos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8" />
                  <span className="text-xl font-semibold">Resultados Instantâneos</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <span className="text-xl font-semibold">PDF Profissional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
            Funcionalidades Principais
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-xl mb-8 text-blue-50">
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
