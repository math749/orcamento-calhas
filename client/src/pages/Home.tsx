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
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">GCALHAS</span>
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
              <Button asChild>
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
              Orçamentos de Calhas com <span className="text-blue-600">Elegância</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Sistema profissional e intuitivo para orçar calhas, rufos e pingadeiras. Cálculos precisos, resultados instantâneos.
            </p>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Button size="lg" onClick={() => navigate("/budget")} className="gap-2">
                  Criar Orçamento <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button size="lg" asChild className="gap-2">
                  <a href={getLoginUrl()}>
                    Começar Agora <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline">
                Saiba Mais
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calculator className="w-8 h-8" />
                  <span className="text-lg font-semibold">Cálculos Precisos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8" />
                  <span className="text-lg font-semibold">Resultados Instantâneos</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <span className="text-lg font-semibold">PDF Profissional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Funcionalidades Principais
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Calculadora Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Insira as dimensões e deixe o sistema calcular automaticamente o metro quadrado e o preço final.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>PDF Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gere orçamentos em PDF com descrições detalhadas e profissionais de cada produto.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Settings className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Gestão Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Painel administrativo para gerenciar produtos, materiais e preços com facilidade.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Crie seu primeiro orçamento em menos de 2 minutos
          </p>
          {isAuthenticated ? (
            <Button size="lg" variant="secondary" onClick={() => navigate("/budget")} className="gap-2">
              Novo Orçamento <ArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <a href={getLoginUrl()}>
                Entrar e Começar <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2025 GCALHAS. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
