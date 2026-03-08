import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  category: "calhas" | "rufos" | "pingadeiras" | "completo";
  description: string;
  beforeImage: string;
  afterImage: string;
  location: string;
  year: number;
}

const CATEGORIES = [
  { id: "all", label: "Todos os Projetos" },
  { id: "calhas", label: "Calhas" },
  { id: "rufos", label: "Rufos" },
  { id: "pingadeiras", label: "Pingadeiras" },
  { id: "completo", label: "Projetos Completos" }
];

const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Residência Moderna - Zona Sul",
    category: "calhas",
    description: "Instalação de calhas em alumínio com acabamento premium em residência de alto padrão",
    beforeImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop",
    location: "São Paulo, SP",
    year: 2024
  },
  {
    id: "2",
    title: "Edifício Comercial - Centro",
    category: "completo",
    description: "Projeto completo com calhas, rufos e pingadeiras em fachada de vidro",
    beforeImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
    location: "São Paulo, SP",
    year: 2024
  },
  {
    id: "3",
    title: "Casa Colonial - Interior",
    category: "rufos",
    description: "Restauração de rufos em estilo colonial com acabamento em cobre",
    beforeImage: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=400&fit=crop",
    location: "Minas Gerais, MG",
    year: 2023
  },
  {
    id: "4",
    title: "Condomínio Residencial",
    category: "pingadeiras",
    description: "Instalação de pingadeiras em múltiplos blocos de condomínio",
    beforeImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    location: "Rio de Janeiro, RJ",
    year: 2023
  },
  {
    id: "5",
    title: "Shopping Center",
    category: "completo",
    description: "Projeto de grande escala com sistema de drenagem integrado",
    beforeImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
    location: "Brasília, DF",
    year: 2023
  },
  {
    id: "6",
    title: "Mansão Contemporânea",
    category: "calhas",
    description: "Calhas em alumínio anodizado com design minimalista",
    beforeImage: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop",
    location: "São Paulo, SP",
    year: 2024
  }
];

interface PortfolioGalleryProps {
  projects?: Project[];
  onProjectClick?: (project: Project) => void;
}

export default function PortfolioGallery({ 
  projects = SAMPLE_PROJECTS,
  onProjectClick 
}: PortfolioGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Filter Buttons */}
      <div className="mb-12 flex flex-wrap gap-3 justify-center">
        {CATEGORIES.map(category => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`
              rounded-full px-6 py-2 font-semibold transition-all duration-300
              ${selectedCategory === category.id 
                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg" 
                : "border-2 border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-500"
              }
            `}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <div 
            key={project.id}
            className="group cursor-pointer"
            onClick={() => {
              setExpandedProject(expandedProject === project.id ? null : project.id);
              onProjectClick?.(project);
            }}
          >
            {/* Project Card */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
              {/* Before/After Container */}
              <div className="relative h-80 overflow-hidden bg-slate-200">
                {/* Before Image */}
                <img
                  src={project.beforeImage}
                  alt={`Antes - ${project.title}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                
                {/* After Image */}
                <img
                  src={project.afterImage}
                  alt={`Depois - ${project.title}`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                {/* Before/After Label */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
                  <div className="text-center">
                    <p className="text-white text-sm font-semibold mb-2">Clique para expandir</p>
                    <div className="flex justify-center gap-4 text-white text-xs">
                      <span>← Antes</span>
                      <span>Depois →</span>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full uppercase">
                    {CATEGORIES.find(c => c.id === project.category)?.label}
                  </span>
                </div>

                {/* Year Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 bg-blue-900 text-white text-xs font-semibold rounded-full">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                {/* Location */}
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                  <span>📍</span>
                  <span>{project.location}</span>
                </div>

                {/* Expanded Details */}
                {expandedProject === project.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in-up">
                    <p className="text-slate-700 text-sm mb-4">
                      {project.description}
                    </p>
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProjectClick?.(project);
                      }}
                    >
                      Ver Detalhes Completos
                    </Button>
                  </div>
                )}

                {/* Expand/Collapse Icon */}
                <div className="mt-4 flex justify-center">
                  {expandedProject === project.id ? (
                    <ChevronUp className="w-5 h-5 text-orange-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">
            Nenhum projeto encontrado nesta categoria.
          </p>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-12 text-center">
        <p className="text-slate-600">
          Exibindo <span className="font-bold text-orange-600">{filteredProjects.length}</span> de <span className="font-bold">{projects.length}</span> projetos
        </p>
      </div>
    </div>
  );
}
