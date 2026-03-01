import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/OptimizedImage";

interface Project {
  id: number;
  title: string;
  description: string;
  before: string;
  after: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Residência - Proteção contra Chuva",
    description: "Instalação de calha e rufos em residência, protegendo a estrutura contra infiltrações e danos causados pela chuva.",
    before: "/before-1.jpg",
    after: "/after-1.jpg",
  },
  {
    id: 2,
    title: "Edifício Comercial - Sistema Completo",
    description: "Sistema completo de drenagem com calhas, rufos e pingadeiras em edifício comercial moderno.",
    before: "/before-2.jpg",
    after: "/after-2.jpg",
  },
];

export default function GalleryBeforeAfter() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  const current = projects[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setSliderPosition(50);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setSliderPosition(50);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Galeria de Projetos
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Veja a transformação que nossas calhas, rufos e pingadeiras proporcionam aos imóveis. Deslize para comparar antes e depois.
          </p>
        </div>

        {/* Gallery Container */}
        <div className="max-w-4xl mx-auto">
          {/* Before/After Slider */}
          <div
            className="relative w-full overflow-hidden rounded-lg shadow-2xl cursor-col-resize mb-8"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* Before Image */}
            <OptimizedImage
              src={current.before}
              alt="Antes"
              className="w-full h-auto block"
            />

            {/* After Image Container */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <OptimizedImage
                src={current.after}
                alt="Depois"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 h-full w-1 bg-white shadow-lg"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg">
                <div className="flex gap-1">
                  <ChevronLeft className="w-5 h-5 text-blue-900" />
                  <ChevronRight className="w-5 h-5 text-blue-900" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold">
              ANTES
            </div>
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold">
              DEPOIS
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {current.title}
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="lg"
              className="border-blue-900 text-blue-900 hover:bg-blue-50"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Anterior
            </Button>

            {/* Project Indicators */}
            <div className="flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSliderPosition(50);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-blue-900 w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600"
            >
              Próximo
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Project Counter */}
          <div className="text-center mt-6 text-slate-600">
            Projeto {currentIndex + 1} de {projects.length}
          </div>
        </div>
      </div>
    </section>
  );
}
