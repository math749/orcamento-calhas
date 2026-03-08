import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PortfolioGallery, { type Project } from "@/components/PortfolioGallery";
import ProjectModal from "@/components/ProjectModal";

const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Residência Moderna - Zona Sul",
    category: "calhas",
    description: "Instalação de calhas em alumínio com acabamento premium em residência de alto padrão. Projeto realizado com precisão e atenção aos detalhes, garantindo perfeita drenagem de água pluvial.",
    beforeImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop",
    location: "São Paulo, SP",
    year: 2024
  },
  {
    id: "2",
    title: "Edifício Comercial - Centro",
    category: "completo",
    description: "Projeto completo com calhas, rufos e pingadeiras em fachada de vidro. Sistema integrado de drenagem com acabamento em aço inoxidável, resistindo às intempéries urbanas.",
    beforeImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
    location: "São Paulo, SP",
    year: 2024
  },
  {
    id: "3",
    title: "Casa Colonial - Interior",
    category: "rufos",
    description: "Restauração de rufos em estilo colonial com acabamento em cobre. Projeto respeitou a arquitetura original mantendo a elegância e funcionalidade.",
    beforeImage: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=400&fit=crop",
    location: "Minas Gerais, MG",
    year: 2023
  },
  {
    id: "4",
    title: "Condomínio Residencial",
    category: "pingadeiras",
    description: "Instalação de pingadeiras em múltiplos blocos de condomínio. Projeto de grande escala com coordenação de cronograma e minimização de impacto aos moradores.",
    beforeImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    location: "Rio de Janeiro, RJ",
    year: 2023
  },
  {
    id: "5",
    title: "Shopping Center",
    category: "completo",
    description: "Projeto de grande escala com sistema de drenagem integrado. Solução customizada para área de 15.000m² com acabamento profissional.",
    beforeImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
    location: "Brasília, DF",
    year: 2023
  },
  {
    id: "6",
    title: "Mansão Contemporânea",
    category: "calhas",
    description: "Calhas em alumínio anodizado com design minimalista. Projeto que integra funcionalidade com estética contemporânea.",
    beforeImage: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop",
    location: "São Paulo, SP",
    year: 2024
  },
  {
    id: "7",
    title: "Escola Privada",
    category: "completo",
    description: "Sistema completo de drenagem para instituição educacional. Projeto que prioriza segurança e durabilidade.",
    beforeImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
    location: "Belo Horizonte, MG",
    year: 2024
  },
  {
    id: "8",
    title: "Fábrica Industrial",
    category: "rufos",
    description: "Instalação de rufos em estrutura industrial. Solução robusta para ambiente de alta demanda.",
    beforeImage: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=400&fit=crop",
    location: "Campinas, SP",
    year: 2023
  }
];

export default function PortfolioPage() {
  const [, navigate] = useLocation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = SAMPLE_PROJECTS.findIndex(p => p.id === selectedProject.id);
    if (currentIndex < SAMPLE_PROJECTS.length - 1) {
      setSelectedProject(SAMPLE_PROJECTS[currentIndex + 1]);
    }
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = SAMPLE_PROJECTS.findIndex(p => p.id === selectedProject.id);
    if (currentIndex > 0) {
      setSelectedProject(SAMPLE_PROJECTS[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <img src="/logo-horizontal.png" alt="Calhas Em Geral" className="h-10 md:h-12 w-auto object-contain" />
          </div>
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            Voltar ao Início
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
              Nosso <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Portfólio</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Conheça alguns dos nossos projetos mais emblemáticos. Cada um representa nossa dedicação à qualidade e excelência.
            </p>
            <div className="flex gap-4">
              <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3">
                Ver Todos os Projetos <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <PortfolioGallery 
            projects={SAMPLE_PROJECTS}
            onProjectClick={handleProjectClick}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-900 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">150+</div>
              <p className="text-blue-100">Projetos Realizados</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">98%</div>
              <p className="text-blue-100">Clientes Satisfeitos</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">15+</div>
              <p className="text-blue-100">Anos de Experiência</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">5</div>
              <p className="text-blue-100">Estrelas (Avaliação)</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Pronto para Transformar Seu Projeto?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco para uma consulta gratuita e receba um orçamento personalizado.
          </p>
          <Button 
            onClick={() => navigate("/budget")}
            className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 text-lg"
          >
            Solicitar Orçamento <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
      />
    </div>
  );
}
