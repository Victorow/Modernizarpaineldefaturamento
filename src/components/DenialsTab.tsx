import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle } from 'lucide-react';
import { DrillDownDialog, type AccountDetail } from './DrillDownDialog';

const denialsByReason = [
  { reason: 'Informação Incompleta', count: 245, value: 18500, percentage: 25 },
  { reason: 'Código Incorreto', count: 186, value: 14200, percentage: 19 },
  { reason: 'Autorização Ausente', count: 167, value: 12800, percentage: 17 },
  { reason: 'Duplicata', count: 142, value: 10900, percentage: 14 },
  { reason: 'Fora do Prazo', count: 128, value: 9800, percentage: 13 },
  { reason: 'Outros', count: 118, value: 9000, percentage: 12 },
];

const denialsByPayer = [
  { payer: 'Unimed', denied: 285, total: 3240, rate: 8.8 },
  { payer: 'Amil', denied: 198, total: 2580, rate: 7.7 },
  { payer: 'Bradesco Saúde', denied: 175, total: 2145, rate: 8.2 },
  { payer: 'SulAmérica', denied: 142, total: 1890, rate: 7.5 },
  { payer: 'NotreDame', denied: 124, total: 1650, rate: 7.5 },
  { payer: 'Particular', denied: 62, total: 1420, rate: 4.4 },
];

const appealSuccess = [
  { month: 'Jan', total: 220, successful: 165, rate: 75 },
  { month: 'Fev', total: 235, successful: 182, rate: 77 },
  { month: 'Mar', total: 248, successful: 194, rate: 78 },
  { month: 'Abr', total: 242, successful: 189, rate: 78 },
  { month: 'Mai', total: 256, successful: 207, rate: 81 },
  { month: 'Jun', total: 264, successful: 219, rate: 83 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

const generateDenialAccounts = (reason: string, count: number): AccountDetail[] => {
  const accounts: AccountDetail[] = [];
  for (let i = 0; i < Math.min(count, 20); i++) {
    accounts.push({
      id: `ACC-2025-${String(i + 2000).padStart(5, '0')}`,
      patient: ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira'][i % 5],
      payer: ['Unimed', 'Amil', 'Bradesco Saúde', 'SulAmérica'][i % 4],
      service: ['Consulta', 'Exames Lab.', 'Imagem', 'Procedimento'][i % 4],
      value: Math.random() * 3000 + 300,
      date: new Date(2025, 5, Math.floor(Math.random() * 30) + 1).toLocaleDateString('pt-BR'),
      status: 'denied',
      days: Math.floor(Math.random() * 60),
      denialReason: reason,
      professional: ['Dr. Silva', 'Dra. Santos', 'Dr. Oliveira'][i % 3],
      unit: ['Unidade Centro', 'Unidade Sul'][i % 2],
    });
  }
  return accounts;
};

export function DenialsTab() {
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<{
    title: string;
    description: string;
    accounts: AccountDetail[];
  }>({ title: '', description: '', accounts: [] });

  const handleReasonClick = (reason: string, count: number) => {
    const accounts = generateDenialAccounts(reason, count);
    setDrillDownData({
      title: `Negações: ${reason}`,
      description: `${count} contas negadas por ${reason}`,
      accounts,
    });
    setDrillDownOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Alert for high denial rate */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          A taxa de negação está 36,7% acima da meta. Priorize revisão de "Informação Incompleta" e "Código Incorreto" que representam 44% das negações.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Denials by Reason */}
        <Card>
          <CardHeader>
            <CardTitle>Negações por Motivo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={denialsByReason}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ reason, percentage }) => `${reason}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {denialsByReason.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {denialsByReason.slice(0, 3).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleReasonClick(item.reason, item.count)}
                  className="w-full flex items-center justify-between text-sm p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
                  aria-label={`Ver detalhes de ${item.count} negações por ${item.reason}`}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                      aria-hidden="true"
                    ></div>
                    <span className="text-slate-700">{item.reason}</span>
                  </div>
                  <span className="text-slate-900">{item.count} contas</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Denials by Payer */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Negação por Pagador</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={denialsByPayer}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="payer" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'Taxa') return `${value.toFixed(1)}%`;
                    return value;
                  }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                />
                <Bar dataKey="rate" name="Taxa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-slate-600">
              Meta de taxa de negação: <strong className="text-green-700">6%</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appeal Success Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Sucesso em Recursos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appealSuccess}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
              />
              <Legend />
              <Bar dataKey="total" name="Total de Recursos" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="successful" name="Recursos Bem-Sucedidos" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-slate-600">Total de Recursos (Jun)</div>
              <div className="text-slate-900">264 contas</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-slate-600">Bem-Sucedidos</div>
              <div className="text-green-700">219 contas (83%)</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-slate-600">Tendência</div>
              <div className="text-blue-700">+8% vs. Jan</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
