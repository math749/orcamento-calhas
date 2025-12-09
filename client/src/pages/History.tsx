import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function History() {
  const [, navigate] = useLocation();
  const { data: budgets, isLoading } = trpc.budget.listUserBudgets.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 gap-2">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Button>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">Histórico de Orçamentos</h1>
        <p className="text-slate-600 mb-8">
          Visualize todos os orçamentos que você criou
        </p>

        {!budgets || budgets.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="pt-12 text-center">
              <p className="text-slate-600 mb-4">Nenhum orçamento criado ainda</p>
              <Button onClick={() => navigate("/budget")}>
                Criar Primeiro Orçamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <Card key={budget.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          Orçamento #{budget.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            budget.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : budget.status === "sent"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {budget.status === "completed"
                            ? "Completo"
                            : budget.status === "sent"
                              ? "Enviado"
                              : "Rascunho"}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div>
                          <p className="text-xs text-slate-500">Data</p>
                          <p className="font-semibold text-slate-900">
                            {format(new Date(budget.createdAt), "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                        {budget.clientName && (
                          <div>
                            <p className="text-xs text-slate-500">Cliente</p>
                            <p className="font-semibold text-slate-900">{budget.clientName}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-slate-500">Total</p>
                          <p className="font-bold text-blue-600">
                            R$ {(budget.totalPrice / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/budget/${budget.id}`)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
