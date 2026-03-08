import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "./PortfolioGallery";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  onNext,
  onPrev
}: ProjectModalProps) {
  const [showAfter, setShowAfter] = useState(false);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-orange-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{project.title}</h2>
            <p className="text-blue-100 mt-1">{project.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Before/After Images */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden bg-slate-200 h-96 md:h-[500px] mb-4">
              {/* Image Container */}
              <div className="relative w-full h-full">
                {/* Before Image */}
                <img
                  src={project.beforeImage}
                  alt={`Antes - ${project.title}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    showAfter ? "opacity-0" : "opacity-100"
                  }`}
                />

                {/* After Image */}
                <img
                  src={project.afterImage}
                  alt={`Depois - ${project.title}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    showAfter ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Slider Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-white text-lg font-bold drop-shadow-lg">
                      {showAfter ? "DEPOIS" : "ANTES"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => setShowAfter(!showAfter)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                {showAfter ? "Ver Antes" : "Ver Depois"}
              </button>
            </div>

            {/* Image Info */}
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Clique no botão acima para alternar entre antes e depois</span>
              <span className="font-semibold text-orange-600">{project.year}</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-200">
            {/* Category */}
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Categoria
              </h3>
              <p className="text-lg font-bold text-slate-900 capitalize">
                {project.category === "completo" ? "Projeto Completo" : project.category}
              </p>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Localização
              </h3>
              <p className="text-lg font-bold text-slate-900">
                {project.location}
              </p>
            </div>

            {/* Year */}
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Ano
              </h3>
              <p className="text-lg font-bold text-slate-900">
                {project.year}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Sobre o Projeto</h3>
            <p className="text-slate-700 leading-relaxed text-lg">
              {project.description}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Destaques do Projeto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-xl mt-1">✓</span>
                <span className="text-slate-700">Acabamento profissional com materiais de alta qualidade</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-xl mt-1">✓</span>
                <span className="text-slate-700">Instalação realizada por profissionais experientes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-xl mt-1">✓</span>
                <span className="text-slate-700">Garantia estendida e suporte pós-venda</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-xl mt-1">✓</span>
                <span className="text-slate-700">Solução personalizada conforme necessidades do cliente</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-900 to-orange-600 text-white p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold mb-2">Gostou deste projeto?</h3>
            <p className="text-blue-100 mb-4">
              Entre em contato conosco para orçar um projeto similar para sua propriedade.
            </p>
            <Button className="bg-white text-blue-900 hover:bg-slate-100 font-bold">
              Solicitar Orçamento
            </Button>
          </div>
        </div>

        {/* Footer with Navigation */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={!onPrev}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="text-slate-600"
          >
            Fechar
          </Button>

          <Button
            onClick={onNext}
            disabled={!onNext}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
