import { useMemo } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialAnalysisProps {
  totalValue: number;
  materialCost: number;
}

export default function FinancialAnalysis({
  totalValue,
  materialCost,
}: FinancialAnalysisProps) {
  const financialBreakdown = useMemo(() => {
    // Passo 1: Valor do serviço
    let remaining = totalValue;

    // Passo 2: Deduz custo do material
    const material = materialCost;
    remaining -= material;

    // Passo 3: 30% GCALHAS sobre o que sobrou
    const gcalhas = remaining * 0.3;
    remaining -= gcalhas;

    // Passo 4: 30% Carro
    const car = remaining * 0.3;
    remaining -= car;

    // Passo 5: 27% Nildo (Mão de obra)
    const nildo = remaining * 0.27;
    remaining -= nildo;

    // Passo 6: 25% Matheus (Mão de obra)
    const matheus = remaining * 0.25;
    remaining -= matheus;

    // Passo 7: O que sobra é caixa da empresa
    const cashbox = remaining;

    return {
      material,
      gcalhas,
      car,
      nildo,
      matheus,
      cashbox,
      totalValue,
    };
  }, [totalValue, materialCost]);

  const chartData = [
    {
      name: "Material",
      value: financialBreakdown.material,
      percentage: (
        (financialBreakdown.material / financialBreakdown.totalValue) *
        100
      ).toFixed(2),
    },
    {
      name: "GCALHAS (30%)",
      value: financialBreakdown.gcalhas,
      percentage: (
        (financialBreakdown.gcalhas / financialBreakdown.totalValue) *
        100
      ).toFixed(2),
    },
    {
      name: "Carro (30%)",
      value: financialBreakdown.car,
      percentage: (
        (financialBreakdown.car / financialBreakdown.totalValue) *
        100
      ).toFixed(2),
    },
    {
      name: "Nildo (27%)",
      value: financialBreakdown.nildo,
      percentage: (
        (financialBreakdown.nildo / financialBreakdown.totalValue) *
        100
      ).toFixed(2),
    },
    {
      name: "Matheus (25%)",
      value: financialBreakdown.matheus,
      percentage: (
        (financialBreakdown.matheus / financialBreakdown.totalValue) *
        100
      ).toFixed(2),
    },
    {
      name: "Caixa Empresa",
      value: financialBreakdown.cashbox,
      percentage: (
        (financialBreakdown.cashbox / financialBreakdown.totalValue) *
        100
      ).toFixed(2),
    },
  ];

  const COLORS = [
    "#1e40af", // Material - azul escuro
    "#ea580c", // GCALHAS - laranja
    "#f97316", // Carro - laranja claro
    "#10b981", // Nildo - verde
    "#06b6d4", // Matheus - cyan
    "#8b5cf6", // Caixa - roxo
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-orange-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Análise Financeira Detalhada</h2>
        <p className="text-blue-50">
          Visualize como o valor do serviço é dividido entre os diferentes
          custos e receitas
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Valor Total do Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-900">
              R$ {financialBreakdown.totalValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-500">Caixa da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-500">
              R$ {financialBreakdown.cashbox.toFixed(2)}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              {(
                (financialBreakdown.cashbox / financialBreakdown.totalValue) *
                100
              ).toFixed(2)}
              % do valor total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição Percentual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) =>
                    `${name}: ${percentage}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Valores em Reais</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                />
                <Bar dataKey="value" fill="#1e40af" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Passo a Passo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="border-l-4 border-l-blue-900 pl-4 py-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">
                  1. Valor do Serviço
                </span>
                <span className="text-lg font-bold text-blue-900">
                  R$ {financialBreakdown.totalValue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-l-blue-900 pl-4 py-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900">
                  2. - Custo do Material
                </span>
                <span className="text-lg font-bold text-red-600">
                  - R$ {financialBreakdown.material.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-sm">
                <span>Valor após material</span>
                <span>
                  R${" "}
                  {(
                    financialBreakdown.totalValue -
                    financialBreakdown.material
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border-l-4 border-l-orange-500 pl-4 py-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900">
                  3. - GCALHAS (30%)
                </span>
                <span className="text-lg font-bold text-red-600">
                  - R$ {financialBreakdown.gcalhas.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-sm">
                <span>Valor após GCALHAS</span>
                <span>
                  R${" "}
                  {(
                    financialBreakdown.totalValue -
                    financialBreakdown.material -
                    financialBreakdown.gcalhas
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border-l-4 border-l-orange-500 pl-4 py-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900">
                  4. - Carro (30%)
                </span>
                <span className="text-lg font-bold text-red-600">
                  - R$ {financialBreakdown.car.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-sm">
                <span>Valor após Carro</span>
                <span>
                  R${" "}
                  {(
                    financialBreakdown.totalValue -
                    financialBreakdown.material -
                    financialBreakdown.gcalhas -
                    financialBreakdown.car
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="border-l-4 border-l-green-500 pl-4 py-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900">
                  5. - Nildo - Mão de Obra (27%)
                </span>
                <span className="text-lg font-bold text-red-600">
                  - R$ {financialBreakdown.nildo.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-sm">
                <span>Valor após Nildo</span>
                <span>
                  R${" "}
                  {(
                    financialBreakdown.totalValue -
                    financialBreakdown.material -
                    financialBreakdown.gcalhas -
                    financialBreakdown.car -
                    financialBreakdown.nildo
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Step 6 */}
            <div className="border-l-4 border-l-cyan-500 pl-4 py-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900">
                  6. - Matheus - Mão de Obra (25%)
                </span>
                <span className="text-lg font-bold text-red-600">
                  - R$ {financialBreakdown.matheus.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-sm">
                <span>Valor após Matheus</span>
                <span>
                  R${" "}
                  {(
                    financialBreakdown.totalValue -
                    financialBreakdown.material -
                    financialBreakdown.gcalhas -
                    financialBreakdown.car -
                    financialBreakdown.nildo -
                    financialBreakdown.matheus
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Step 7 */}
            <div className="border-l-4 border-l-purple-500 pl-4 py-2 bg-purple-50 rounded">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">
                  7. = Caixa da Empresa
                </span>
                <span className="text-lg font-bold text-purple-600">
                  R$ {financialBreakdown.cashbox.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Este é o valor que fica para a empresa após todas as deduções
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-2 px-4 font-bold">Descrição</th>
                  <th className="text-right py-2 px-4 font-bold">Valor</th>
                  <th className="text-right py-2 px-4 font-bold">%</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={index} className="border-b border-slate-200">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">
                      R$ {item.value.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4">{item.percentage}%</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-300 bg-slate-50">
                  <td className="py-3 px-4 font-bold">Total</td>
                  <td className="text-right py-3 px-4 font-bold">
                    R$ {financialBreakdown.totalValue.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-4 font-bold">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
