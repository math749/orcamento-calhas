import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface BudgetItemInput {
  productId: number;
  materialId: number;
  quantity: number;
  length: number;
  width: number;
}

interface BudgetItemWithCalculation extends BudgetItemInput {
  squareMeter: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  materialName: string;
}

export default function Budget() {
  const [, navigate] = useLocation();
  const { data: products } = trpc.catalog.getProducts.useQuery();
  const { data: materials } = trpc.catalog.getMaterials.useQuery();
  const calculatePrice = trpc.budget.calculatePrice.useQuery;
  const createBudgetMutation = trpc.budget.createBudget.useMutation();

  const [items, setItems] = useState<BudgetItemWithCalculation[]>([]);
  const [currentItem, setCurrentItem] = useState<BudgetItemInput>({
    productId: 0,
    materialId: 0,
    quantity: 1,
    length: 0,
    width: 0,
  });

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Calculate price for current item
  const { data: priceData } = calculatePrice(
    {
      materialId: currentItem.materialId,
      length: currentItem.length,
      width: currentItem.width,
      quantity: currentItem.quantity,
    },
    {
      enabled:
        currentItem.materialId > 0 &&
        currentItem.length > 0 &&
        currentItem.width > 0 &&
        currentItem.quantity > 0,
    }
  );

  const getProductName = (id: number) => {
    return products?.find((p) => p.id === id)?.name || "Produto";
  };

  const getMaterialName = (id: number) => {
    return materials?.find((m) => m.id === id)?.name || "Material";
  };

  const handleAddItem = () => {
    if (
      !currentItem.productId ||
      !currentItem.materialId ||
      !currentItem.length ||
      !currentItem.width ||
      !currentItem.quantity
    ) {
      toast.error("Preencha todos os campos do item");
      return;
    }

    if (!priceData) {
      toast.error("Aguarde o cálculo de preço");
      return;
    }

    const newItem: BudgetItemWithCalculation = {
      ...currentItem,
      squareMeter: priceData.squareMeter,
      unitPrice: priceData.unitPrice,
      totalPrice: priceData.totalPrice,
      productName: getProductName(currentItem.productId),
      materialName: getMaterialName(currentItem.materialId),
    };

    setItems([...items, newItem]);
    setCurrentItem({
      productId: 0,
      materialId: 0,
      quantity: 1,
      length: 0,
      width: 0,
    });
    toast.success("Item adicionado ao orçamento");
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    toast.success("Item removido");
  };

  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleCreateBudget = async () => {
    if (items.length === 0) {
      toast.error("Adicione pelo menos um item ao orçamento");
      return;
    }

    try {
      const result = await createBudgetMutation.mutateAsync({
        clientName: clientName || undefined,
        clientEmail: clientEmail || undefined,
        clientPhone: clientPhone || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          materialId: item.materialId,
          quantity: item.quantity,
          length: item.length,
          width: item.width,
        })),
      });

      toast.success("Orçamento criado com sucesso!");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setItems([]);
      navigate(`/budget/${result.budgetId}`);
    } catch (error) {
      toast.error("Erro ao criar orçamento");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Criar Orçamento</h1>
        <p className="text-slate-600 mb-8">
          Selecione os produtos, materiais e dimensões para gerar seu orçamento
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Dados do Cliente</CardTitle>
                <CardDescription>
                  Informações opcionais para personalizar o orçamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Nome do Cliente</Label>
                  <Input
                    id="clientName"
                    placeholder="Ex: João Silva"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="Ex: joao@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Telefone/WhatsApp (opcional)</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    placeholder="Ex: (11) 9 9999-9999"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle>Adicionar Itens</CardTitle>
                <CardDescription>
                  Configure o produto, material e dimensões
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product">Produto</Label>
                    <Select
                      value={currentItem.productId.toString()}
                      onValueChange={(value) =>
                        setCurrentItem({ ...currentItem, productId: parseInt(value) })
                      }
                    >
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="material">Material</Label>
                    <Select
                      value={currentItem.materialId.toString()}
                      onValueChange={(value) =>
                        setCurrentItem({ ...currentItem, materialId: parseInt(value) })
                      }
                    >
                      <SelectTrigger id="material">
                        <SelectValue placeholder="Selecione um material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials?.map((material) => (
                          <SelectItem key={material.id} value={material.id.toString()}>
                            {material.name} - R$ {(material.pricePerSqMeter / 100).toFixed(2)}/m²
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="length">Comprimento (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="0"
                      value={currentItem.length || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          length: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="width">Largura (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="0"
                      value={currentItem.width || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          width: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="1"
                      value={currentItem.quantity || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>M²</Label>
                    <div className="bg-slate-100 rounded-md p-2 text-center font-semibold">
                      {priceData?.squareMeter.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </div>

                {priceData && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-slate-600">Preço Unitário</p>
                        <p className="text-lg font-bold text-blue-600">
                          R$ {(priceData.unitPrice / 100).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Quantidade</p>
                        <p className="text-lg font-bold text-blue-600">
                          {currentItem.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Total do Item</p>
                        <p className="text-lg font-bold text-blue-600">
                          R$ {(priceData.totalPrice / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleAddItem} className="w-full gap-2">
                  <Plus className="w-5 h-5" />
                  Adicionar Item
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <div>
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Orçamento</CardTitle>
                <CardDescription>{items.length} itens adicionados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    Nenhum item adicionado ainda
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-slate-900">
                                {item.productName}
                              </p>
                              <p className="text-xs text-slate-600">{item.materialName}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {item.length} x {item.width} cm ({item.squareMeter.toFixed(2)}m²)
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">
                              R$ {(item.unitPrice / 100).toFixed(2)} x {item.quantity}
                            </span>
                            <span className="font-bold text-slate-900">
                              R$ {(item.totalPrice / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="text-lg font-bold text-slate-900">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          R$ {(totalPrice / 100).toFixed(2)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={handleCreateBudget}
                          disabled={createBudgetMutation.isPending}
                          className="w-full gap-2"
                        >
                          <Download className="w-5 h-5" />
                          {createBudgetMutation.isPending ? "Criando..." : "Gerar Orçamento"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
