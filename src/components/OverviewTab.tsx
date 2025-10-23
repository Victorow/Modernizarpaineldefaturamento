import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { DrillDownDialog, type AccountDetail } from './DrillDownDialog';

const monthlyData = [
  { month: 'Jan', receita: 420000, despesas: 280000, lucro: 140000, receitaAnoAnterior: 380000, meta: 450000 },
  { month: 'Fev', receita: 435000, despesas: 295000, lucro: 140000, receitaAnoAnterior: 390000, meta: 450000 },
  { month: 'Mar', receita: 465000, despesas: 305000, lucro: 160000, receitaAnoAnterior: 410000, meta: 450000 },
  { month: 'Abr', receita: 445000, despesas: 298000, lucro: 147000, receitaAnoAnterior: 425000, meta: 450000 },
  { month: 'Mai', receita: 478000, despesas: 308000, lucro: 170000, receitaAnoAnterior: 435000, meta: 450000 },
  { month: 'Jun', receita: 487500, despesas: 312400, lucro: 175100, receitaAnoAnterior: 450000, meta: 500000 },
];

const pipelineData = [
  { stage: 'A Enviar', value: 125000, count: 245 },
  { stage: 'Enviado', value: 315000, count: 582 },
  { stage: 'Aceito/Limpo', value: 425000, count: 756 },
  { stage: 'Negado', value: 42000, count: 98 },
  { stage: 'Em Recurso', value: 28000, count: 52 },
  { stage: 'Pago', value: 487500, count: 1245 },
];

const generatePipelineAccounts = (stage: string, count: number): AccountDetail[] => {
  const statusMap: Record<string, 'pending' | 'submitted' | 'accepted' | 'denied' | 'paid'> = {
    'A Enviar': 'pending',
    'Enviado': 'submitted',
    'Aceito/Limpo': 'accepted',
    'Negado': 'denied',
    'Em Recurso': 'denied',
    'Pago': 'paid',
  };

  const accounts: AccountDetail[] = [];
  for (let i = 0; i < Math.min(count, 20); i++) {
    accounts.push({
      id: `ACC-2025-${String(i + 3000).padStart(5, '0')}`,
      patient: ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira'][i % 5],
      payer: ['Unimed', 'Amil', 'Bradesco Saúde', 'SulAmérica'][i % 4],
      service: ['Consulta', 'Exames Lab.', 'Imagem', 'Procedimento'][i % 4],
      value: Math.random() * 4000 + 400,
      date: new Date(2025, 5, Math.floor(Math.random() * 30) + 1).toLocaleDateString('pt-BR'),
      status: statusMap[stage] || 'submitted',
      days: Math.floor(Math.random() * 60),
      professional: ['Dr. Silva', 'Dra. Santos', 'Dr. Oliveira'][i % 3],
      unit: ['Unidade Centro', 'Unidade Sul'][i % 2],
    });
  }
  return accounts;
};

export function OverviewTab() {
  const [granularity, setGranularity] = useState('month');
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<{
    title: string;
    description: string;
    accounts: AccountDetail[];
  }>({ title: '', description: '', accounts: [] });

  const handlePipelineClick = (data: any) => {
    if (data && data.stage) {
      const accounts = generatePipelineAccounts(data.stage, data.count);
      setDrillDownData({
        title: `Pipeline: ${data.stage}`,
        description: `${data.count} contas em ${data.stage}`,
        accounts,
      });
      setDrillDownOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tendência de Receita, Despesas e Lucro</CardTitle>
            <div className="w-32">
              <label htmlFor="granularity" className="sr-only">Granularidade</label>
              <Select value={granularity} onValueChange={setGranularity}>
                <SelectTrigger id="granularity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Dia</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="receita" 
                name="Receita" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="receitaAnoAnterior" 
                name="Receita Ano Anterior" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#94a3b8', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                name="Meta" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="despesas" 
                name="Despesas" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="lucro" 
                name="Lucro" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline de Sinistros</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  type="category" 
                  dataKey="stage" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  width={100}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'Valor') return `R$ ${value.toLocaleString('pt-BR')}`;
                    return value;
                  }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Valor" 
                  fill="#3b82f6" 
                  radius={[0, 4, 4, 0]}
                  onClick={handlePipelineClick}
                  cursor="pointer"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-slate-600">
              Total de contas no pipeline: <strong>2.978 contas</strong>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Anual 2025</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-slate-700">Receita Total</span>
              <span className="text-blue-700">R$ 2.730.500</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-slate-700">Despesas Totais</span>
              <span className="text-red-700">R$ 1.798.400</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-slate-700">Lucro Total</span>
              <span className="text-green-700">R$ 932.100</span>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Média Mensal</span>
                <span className="text-slate-900">R$ 455.083</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Meses Ativos</span>
                <span className="text-slate-900">6 meses</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Crescimento YoY</span>
                <span className="text-green-700">+8.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Margem Média</span>
                <span className="text-slate-900">34.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DrillDownDialog
        open={drillDownOpen}
        onOpenChange={setDrillDownOpen}
        title={drillDownData.title}
        description={drillDownData.description}
        accounts={drillDownData.accounts}
      />
    </div>
  );
}
