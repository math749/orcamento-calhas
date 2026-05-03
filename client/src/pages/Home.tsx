import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, FileText, Settings, Zap, CheckCircle, Award, Users, Briefcase } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import GalleryBeforeAfter from "@/components/GalleryBeforeAfter";
import Portfolio from "@/components/Portfolio";
import GoogleBusinessProfile from "@/components/GoogleBusinessProfile";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/logo-horizontal.png" alt="Calhas Em Geral" className="h-10 md:h-14 w-auto object-contain" />
          </div>
          <div className="flex gap-2 md:gap-4 flex-wrap justify-end">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/budget")} className="text-slate-700 hover:text-orange-600">
                  Novo Orçamento
                </Button>
                <Button variant="ghost" onClick={() => navigate("/history")} className="text-slate-700 hover:text-orange-600">
                  Histórico
                </Button>
                {user?.role === "admin" && (
                  <Button variant="ghost" onClick={() => navigate("/admin")} className="text-slate-700 hover:text-orange-600">
                    Admin
                  </Button>
                )}
                <Button variant="outline" onClick={() => navigate("/profile")} className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  Perfil
                </Button>
              </>
            ) : (
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Diagonal */}
      <section className="relative min-h-screen md:min-h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=700&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
        
        {/* Diagonal SVG Shape */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="none">
            <polygon points="0,0 1200,0 1200,500 0,700" fill="white" />
          </svg>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-block mb-4 md:mb-6 px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full">
                <span className="text-orange-400 text-xs md:text-sm font-semibold uppercase tracking-wider">Solução Completa</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-tight drop-shadow-lg animate-fade-in-up">
                Orçamentos de <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Calhas</span> com Elegância
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 leading-relaxed drop-shadow-md animate-fade-in-up-delay-1 font-light">
                A plataforma mais completa para orçar calhas, rufos e pingadeiras com precisão profissional. Resultados instantâneos e documentos prontos para apresentação.
              </p>
              <div className="flex gap-3 md:gap-4 flex-col sm:flex-row animate-fade-in-up-delay-2">
                {isAuthenticated ? (
                  <Button onClick={() => navigate("/budget")} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold w-full sm:w-auto text-base px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Criar Orçamento <ArrowRight className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button asChild className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold w-full sm:w-auto text-base px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <a href={getLoginUrl()}>
                      Começar Agora <ArrowRight className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold w-full sm:w-auto text-base px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-300">
                  Saiba Mais
                </Button>
              </div>
            </div>
            
            {/* Right Features Card */}
            <div className="relative mt-8 md:mt-0 animate-fade-in-up-delay-3">
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 via-orange-400 to-transparent opacity-20 blur-2xl rounded-3xl"></div>
              <div className="relative bg-gradient-to-br from-blue-950/95 via-blue-900/90 to-orange-600/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 text-white shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:-translate-y-3">
                <div className="space-y-6 md:space-y-7">
                  {/* Feature 1 */}
                  <div className="flex items-start gap-5 pb-6 border-b border-white/20 hover:border-white/40 transition-colors duration-300 group cursor-pointer">
                    <div className="flex-shrink-0 w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg md:text-xl font-bold text-white leading-tight">Cálculos Precisos</p>
                      <p className="text-sm md:text-base text-white/80 mt-2">Matemática exata para seus orçamentos</p>
                    </div>
                  </div>
                  
                  {/* Feature 2 */}
                  <div className="flex items-start gap-5 pb-6 border-b border-white/20 hover:border-white/40 transition-colors duration-300 group cursor-pointer">
                    <div className="flex-shrink-0 w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg md:text-xl font-bold text-white leading-tight">Resultados Instantâneos</p>
                      <p className="text-sm md:text-base text-white/80 mt-2">Geração de orçamentos em segundos</p>
                    </div>
                  </div>
                  
                  {/* Feature 3 */}
                  <div className="flex items-start gap-5 group cursor-pointer">
                    <div className="flex-shrink-0 w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg md:text-xl font-bold text-white leading-tight">PDF Profissional</p>
                      <p className="text-sm md:text-base text-white/80 mt-2">Documentos prontos para impressão</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Por Que Nos Escolher
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Somos a solução mais completa e confiável para orçamentos de calhas no Brasil
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: CheckCircle, title: "100% Preciso", desc: "Cálculos matemáticos exatos" },
              { icon: Award, title: "Profissional", desc: "Documentos de alta qualidade" },
              { icon: Users, title: "Confiável", desc: "Usado por milhares de profissionais" },
              { icon: Briefcase, title: "Completo", desc: "Todas as funcionalidades que precisa" }
            ].map((item, idx) => (
              <div key={idx} className="group p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-slate-900 mb-12 md:mb-16">
            Funcionalidades Principais
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Formulário Interativo", desc: "Selecione produtos, materiais e dimensões com facilidade", color: "blue" },
              { title: "Cálculos Automáticos", desc: "Cálculos precisos de m² e preços em tempo real", color: "orange" },
              { title: "PDF Profissional", desc: "Gere PDFs elegantes com descrições detalhadas", color: "blue" },
              { title: "Histórico Completo", desc: "Acesse todos os seus orçamentos anteriores", color: "orange" },
              { title: "WhatsApp Direto", desc: "Contato direto com clientes via WhatsApp", color: "blue" },
              { title: "Painel Admin", desc: "Gerencie produtos, materiais e preços", color: "orange" }
            ].map((item, idx) => (
              <Card key={idx} className={`border-l-4 ${item.color === "blue" ? "border-l-blue-900" : "border-l-orange-500"} hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white`}>
                <CardHeader>
                  <CardTitle className={item.color === "blue" ? "text-blue-900" : "text-orange-600"}>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GalleryBeforeAfter />

      {/* Portfolio Section */}
      <Portfolio />

      {/* Google Business Profile Section */}
      <GoogleBusinessProfile />

      {/* CTA Section with Diagonal */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-blue-900 via-blue-800 to-orange-600 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6">Pronto para Começar?</h2>
          <p className="text-lg md:text-xl mb-8 md:mb-10 text-blue-50 max-w-2xl mx-auto">
            Crie seu primeiro orçamento agora e veja como é fácil gerar documentos profissionais!
          </p>
          {isAuthenticated ? (
            <Button size="lg" onClick={() => navigate("/budget")} className="gap-2 bg-white text-blue-900 hover:bg-slate-100 font-bold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Criar Orçamento <ArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button size="lg" asChild className="gap-2 bg-white text-blue-900 hover:bg-slate-100 font-bold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <a href={getLoginUrl()}>
                Entrar Agora <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo-horizontal.png" alt="Calhas Em Geral" className="h-16 w-auto mb-4 object-contain" />
              <p className="text-slate-400">
                Solução completa para orçamentos profissionais de calhas, rufos e pingadeiras.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Produto</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Novo Orçamento</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Histórico</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Painel Admin</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Empresa</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Contato</h3>
              <p className="text-slate-400 mb-2">
                Entre em contato conosco para dúvidas ou sugestões.
              </p>
              <p className="text-orange-400 font-semibold">suporte@calhasemgeral.com.br</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Calhas Em Geral. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
