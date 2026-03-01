import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/OptimizedImage";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Residência Moderna - Calha Azul",
    category: "Residencial",
    image: "/portfolio-1.jpg",
    description: "Instalação de calha moderna em residência com acabamento em azul marinho.",
  },
  {
    id: 2,
    title: "Edifício Comercial - Sistema Completo",
    category: "Comercial",
    image: "/portfolio-2.jpg",
    description: "Sistema completo de drenagem com calhas e rufos em edifício comercial.",
  },
  {
    id: 3,
    title: "Casa Clássica - Calha Cobre",
    category: "Residencial",
    image: "/portfolio-3.jpg",
    description: "Instalação elegante de calha em cor cobre que realça a arquitetura clássica.",
  },
  {
    id: 4,
    title: "Residência Contemporânea - Calha Preta",
    category: "Residencial",
    image: "/portfolio-4.jpg",
    description: "Sistema de drenagem em calha preta integrado ao design contemporâneo.",
  },
  {
    id: 5,
    title: "Edifício Moderno - Calha Integrada",
    category: "Comercial",
    image: "/portfolio-5.jpg",
    description: "Calha e rufos integrados perfeitamente ao design moderno do edifício.",
  },
];

export default function Portfolio() {
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<string>("Todos");

  const categories = ["Todos", "Residencial", "Comercial"];
  const filteredItems =
    filter === "Todos"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === filter);

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handleImageClick = (item: PortfolioItem) => {
    setSelectedImage(item);
    const index = filteredItems.findIndex((i) => i.id === item.id);
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Portfólio de Projetos
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Conheça alguns dos nossos trabalhos realizados. Cada projeto reflete
            nosso compromisso com qualidade e excelência.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => {
                setFilter(category);
                setCurrentIndex(0);
              }}
              variant={filter === category ? "default" : "outline"}
              className={
                filter === category
                  ? "bg-blue-900 hover:bg-blue-800"
                  : "border-blue-900 text-blue-900 hover:bg-blue-50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleImageClick(item)}
              className="group cursor-pointer relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <OptimizedImage
                src={item.image}
                alt={item.title}
                className="w-full h-64 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-blue-200 text-sm">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-orange-500 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Image */}
              <OptimizedImage
                src={filteredItems[currentIndex]?.image || ""}
                alt={filteredItems[currentIndex]?.title || ""}
                className="w-full h-auto rounded-lg"
              />

              {/* Info */}
              <div className="bg-blue-900 text-white p-6 rounded-b-lg">
                <h3 className="text-2xl font-bold mb-2">
                  {filteredItems[currentIndex]?.title}
                </h3>
                <p className="text-blue-100 mb-4">
                  {filteredItems[currentIndex]?.description}
                </p>
                <span className="inline-block bg-orange-500 px-4 py-2 rounded-full text-sm font-semibold">
                  {filteredItems[currentIndex]?.category}
                </span>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Anterior
                </Button>

                <div className="text-white text-sm">
                  {currentIndex + 1} de {filteredItems.length}
                </div>

                <Button
                  onClick={handleNext}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Próximo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
