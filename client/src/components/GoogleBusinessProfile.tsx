import { MapPin, Phone, Mail, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GoogleBusinessProfile() {
  const googleBusinessUrl =
    "https://www.google.com/search?q=gcalhas";

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Avaliações e Informações
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Confira nossas avaliações no Google e entre em contato conosco
            através dos nossos canais de comunicação.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info Cards */}
          <div className="space-y-6">
            {/* Rating Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
                <span className="text-xl font-bold text-slate-900">5.0</span>
              </div>
              <p className="text-slate-600">
                Avaliação média baseada em avaliações de clientes satisfeitos
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-blue-900">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-900 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Localização</h3>
                  <p className="text-slate-600">
                    Disponível para atender em toda região
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-orange-500">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Telefone</h3>
                  <p className="text-slate-600">Entre em contato para orçamento</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-blue-900">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-900 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Horário</h3>
                  <p className="text-slate-600">
                    Segunda a Sexta: 8h às 18h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Google Business Embed */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-900 to-orange-500 text-white">
              <h3 className="text-2xl font-bold mb-2">GCALHAS</h3>
              <p className="text-blue-50">Calhas Em Geral - Orçamentos Profissionais</p>
            </div>

            {/* Google Business Info */}
            <div className="p-6 space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-bold text-slate-900 mb-2">
                  Sobre a Empresa
                </h4>
                <p className="text-slate-600 text-sm">
                  Especializada em orçamentos de calhas, rufos e pingadeiras com
                  qualidade e precisão. Atendimento profissional e soluções
                  personalizadas para cada projeto.
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-bold text-slate-900 mb-2">Serviços</h4>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>✓ Orçamentos de Calhas</li>
                  <li>✓ Rufos e Pingadeiras</li>
                  <li>✓ Cálculos de m²</li>
                  <li>✓ Consultoria Técnica</li>
                </ul>
              </div>

              <Button
                asChild
                className="w-full bg-blue-900 hover:bg-blue-800"
              >
                <a
                  href={googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver no Google
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-orange-500 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Quer conhecer mais sobre nossos trabalhos?
          </h3>
          <p className="mb-6 text-blue-50">
            Visite nosso perfil no Google para ver avaliações completas e mais
            informações sobre a GCALHAS.
          </p>
          <Button
            asChild
            className="bg-white text-blue-900 hover:bg-slate-100 font-bold"
          >
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Acessar Perfil Google
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
