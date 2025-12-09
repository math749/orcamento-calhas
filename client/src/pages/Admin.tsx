import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: products } = trpc.catalog.getProducts.useQuery();
  const { data: materials } = trpc.catalog.getMaterials.useQuery();
  const { data: budgets } = trpc.admin.getAllBudgets.useQuery();

  const createProductMutation = trpc.admin.createProduct.useMutation();
  const updateMaterialMutation = trpc.admin.updateMaterial.useMutation();

  const [newProduct, setNewProduct] = useState({ name: "", type: "calha", description: "" });
  const [editingMaterial, setEditingMaterial] = useState<any>(null);

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-600">Acesso restrito a administradores</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCreateProduct = async () => {
    if (!newProduct.name) {
      toast.error("Nome do produto é obrigatório");
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        name: newProduct.name,
        type: newProduct.type as "calha" | "rufo" | "pingadeira",
        description: newProduct.description || undefined,
      });
      toast.success("Produto criado com sucesso");
      setNewProduct({ name: "", type: "calha", description: "" });
    } catch (error) {
      toast.error("Erro ao criar produto");
    }
  };

  const handleUpdateMaterial = async () => {
    if (!editingMaterial) return;

    try {
      await updateMaterialMutation.mutateAsync({
        id: editingMaterial.id,
        pricePerSqMeter: editingMaterial.pricePerSqMeter,
      });
      toast.success("Material atualizado com sucesso");
      setEditingMaterial(null);
    } catch (error) {
      toast.error("Erro ao atualizar material");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 gap-2">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Button>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">Painel Administrativo</h1>
        <p className="text-slate-600 mb-8">Gerencie produtos, materiais e visualize orçamentos</p>

        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materials">Materiais</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
          </TabsList>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Gerenciar Materiais</CardTitle>
                <CardDescription>
                  Edite os preços dos materiais disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materials?.map((material) => (
                    <div
                      key={material.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{material.name}</h3>
                        <p className="text-sm text-slate-600">{material.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <Label htmlFor={`price-${material.id}`} className="text-xs">
                            Preço/m²
                          </Label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">R$</span>
                            <Input
                              id={`price-${material.id}`}
                              type="number"
                              value={
                                editingMaterial?.id === material.id
                                  ? editingMaterial.pricePerSqMeter / 100
                                  : material.pricePerSqMeter / 100
                              }
                              onChange={(e) =>
                                setEditingMaterial({
                                  ...editingMaterial,
                                  id: material.id,
                                  pricePerSqMeter: Math.round(parseFloat(e.target.value) * 100),
                                })
                              }
                              className="w-24"
                              step="0.01"
                            />
                          </div>
                        </div>
                        {editingMaterial?.id === material.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleUpdateMaterial}
                              disabled={updateMaterialMutation.isPending}
                            >
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingMaterial(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setEditingMaterial({
                                id: material.id,
                                pricePerSqMeter: material.pricePerSqMeter,
                              })
                            }
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Criar Novo Produto</CardTitle>
                <CardDescription>Adicione um novo produto ao catálogo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productName">Nome do Produto</Label>
                  <Input
                    id="productName"
                    placeholder="Ex: Calha Meia Cana"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="productType">Tipo</Label>
                  <Select
                    value={newProduct.type}
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, type: value })
                    }
                  >
                    <SelectTrigger id="productType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calha">Calha</SelectItem>
                      <SelectItem value="rufo">Rufo</SelectItem>
                      <SelectItem value="pingadeira">Pingadeira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="productDescription">Descrição</Label>
                  <Input
                    id="productDescription"
                    placeholder="Descrição do produto"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                  />
                </div>

                <Button
                  onClick={handleCreateProduct}
                  disabled={createProductMutation.isPending}
                  className="w-full gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {createProductMutation.isPending ? "Criando..." : "Criar Produto"}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Produtos Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {products?.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-600">
                          Tipo: {product.type} | {product.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Todos os Orçamentos</CardTitle>
                <CardDescription>
                  {budgets?.length || 0} orçamentos criados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!budgets || budgets.length === 0 ? (
                  <p className="text-center text-slate-600 py-8">
                    Nenhum orçamento criado ainda
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold">ID</th>
                          <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                          <th className="text-left py-3 px-4 font-semibold">Total</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgets.map((budget) => (
                          <tr key={budget.id} className="border-b border-slate-100">
                            <td className="py-3 px-4">#{budget.id}</td>
                            <td className="py-3 px-4">
                              {budget.clientName || "Sem nome"}
                            </td>
                            <td className="py-3 px-4 font-bold text-blue-600">
                              R$ {(budget.totalPrice / 100).toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
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
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {new Date(budget.createdAt).toLocaleDateString("pt-BR")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
