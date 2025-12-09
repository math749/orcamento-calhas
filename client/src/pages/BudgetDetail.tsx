import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function BudgetDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const budgetId = parseInt(id || "0");

  const { data: budgetData, isLoading } = trpc.budget.getBudget.useQuery(budgetId);
  const { data: pdfData } = trpc.pdf.generateBudgetPDF.useQuery(budgetId);
  const [copying, setCopying] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!budgetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 gap-2">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-600">Orçamento não encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { budget, items } = budgetData;
  const totalPrice = budget.totalPrice;

  const handlePrint = () => {
    if (pdfData?.html) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(pdfData.html);
        printWindow.document.close();
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      }
    } else {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setCopying(true);
      if (!pdfData?.html) {
        toast.error("PDF não disponível");
        return;
      }

      // Create a blob from the HTML
      const blob = new Blob([pdfData.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      
      // Open in new window for printing/saving
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      }
      
      toast.success("PDF aberto para download/impressão");
    } catch (error) {
      toast.error("Erro ao gerar PDF");
      console.error(error);
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 gap-2">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Budget Header */}
            <Card className="shadow-lg mb-6">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Orçamento #{budget.id}</CardTitle>
                <CardDescription className="text-blue-100">
                  Criado em {new Date(budget.createdAt).toLocaleDateString("pt-BR")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {budget.clientName && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-600">Cliente</p>
                      <p className="text-lg font-semibold text-slate-900">{budget.clientName}</p>
                    </div>
                    {budget.clientEmail && (
                      <div>
                        <p className="text-sm text-slate-600">Email</p>
                        <p className="text-lg font-semibold text-slate-900">{budget.clientEmail}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
                </div>
              </CardContent>
            </Card>

            {/* Budget Items */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Itens do Orçamento</CardTitle>
                <CardDescription>{items.length} produtos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">
                          Produto
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">
                          Material
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-900">
                          M²
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-900">
                          Qtd
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-900">
                          Unitário
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-900">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-slate-900">
                            {item.product?.name || "Produto"}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {item.material?.name || "Material"}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-700">
                            {(item.squareMeter / 10000).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-700">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-900 font-semibold">
                            R$ {(item.unitPrice / 100).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-900 font-bold">
                            R$ {(item.totalPrice / 100).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-6 flex justify-end">
                  <div className="w-full md:w-96">
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between text-slate-700">
                        <span>Subtotal:</span>
                        <span>R$ {(totalPrice / 100).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-bold text-slate-900">
                        <span>Total:</span>
                        <span className="text-blue-600">R$ {(totalPrice / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div>
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={copying}
                  className="w-full gap-2"
                  variant="default"
                >
                  <Download className="w-5 h-5" />
                  {copying ? "Gerando..." : "Baixar PDF"}
                </Button>
                <Button onClick={handlePrint} className="w-full gap-2" variant="outline" disabled={!pdfData}>
                  <Printer className="w-5 h-5" />
                  Imprimir
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copiado!");
                  }}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Copy className="w-5 h-5" />
                  Copiar Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
