import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { DrillDownDialog, type AccountDetail } from './DrillDownDialog';

const agingBuckets = [
  { bucket: '0-30 dias', value: 145000, count: 425, percentage: 42 },
  { bucket: '31-60 dias', value: 98000, count: 285, percentage: 28 },
  { bucket: '61-90 dias', value: 56000, count: 168, percentage: 16 },
  { bucket: '91-120 dias', value: 32000, count: 95, percentage: 9 },
  { bucket: '120+ dias', value: 15000, count: 48, percentage: 5 },
];

const agingByPayer = [
  { payer: 'Unimed', '0-30': 52000, '31-60': 35000, '61-90': 18000, '91-120': 12000, '120+': 6000 },
  { payer: 'Amil', '0-30': 38000, '31-60': 24000, '61-90': 15000, '91-120': 8000, '120+': 4000 },
  { payer: 'Bradesco', '0-30': 28000, '31-60': 18000, '61-90': 11000, '91-120': 7000, '120+': 3000 },
  { payer: 'SulAmérica', '0-30': 18000, '31-60': 14000, '61-90': 8000, '91-120': 3500, '120+': 1500 },
  { payer: 'NotreDame', '0-30': 9000, '31-60': 7000, '61-90': 4000, '91-120': 1500, '120+': 500 },
];

const topOldestAccounts = [
  { patient: 'João Silva', payer: 'Unimed', value: 3500, days: 148, service: 'Consulta Cardiologia' },
  { patient: 'Maria Santos', payer: 'Amil', value: 4200, days: 142, service: 'Exames Laboratoriais' },
  { patient: 'Pedro Oliveira', payer: 'Bradesco', value: 2800, days: 135, service: 'Ultrassonografia' },
  { patient: 'Ana Costa', payer: 'Unimed', value: 3100, days: 128, service: 'Fisioterapia' },
  { patient: 'Carlos Ferreira', payer: 'SulAmérica', value: 2500, days: 125, service: 'Ressonância' },
];

export function AgingTab() {
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<{
    title: string;
    description: string;
    accounts: AccountDetail[];
  }>({ title: '', description: '', accounts: [] });

  const handleAccountClick = (account: typeof topOldestAccounts[0]) => {
    // Simular abertura de detalhes de uma conta específica
    const mockAccount: AccountDetail = {
      id: `ACC-2025-${Math.floor(Math.random() * 10000)}`,
      patient: account.patient,
      payer: account.payer,
      service: account.service,
      value: account.value,
      date: new Date(Date.now() - account.days * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      status: 'submitted',
      days: account.days,
      professional: 'Dr. Silva',
      unit: 'Unidade Centro',
    };
    
    setDrillDownData({
      title: `Conta: ${account.patient}`,
      description: `Detalhes da conta com ${account.days} dias em A/R`,
      accounts: [mockAccount],
    });
    setDrillDownOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Alert for aging over 90 days */}
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          R$ 47.000 (14% do A/R) está com mais de 90 dias. Priorize cobrança imediata nas contas listadas abaixo.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aging Buckets */}
        <Card>
          <CardHeader>
            <CardTitle>Aging por Faixa Etária</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agingBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="bucket" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
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
                <Bar 
                  dataKey="value" 
                  name="Valor" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {agingBuckets.map((bucket, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-slate-700">{bucket.bucket}</span>
                  <Badge variant={index >= 3 ? 'destructive' : 'secondary'}>
                    {bucket.count} contas
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Recebível</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-slate-600">Total A/R</div>
              <div className="text-blue-700">R$ 346.000</div>
              <div className="text-sm text-slate-600 mt-1">1.021 contas em aberto</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-slate-600">Corrente</div>
                <div className="text-slate-900">R$ 145k</div>
                <div className="text-sm text-green-700">42%</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="text-slate-600">31-90 dias</div>
                <div className="text-slate-900">R$ 154k</div>
                <div className="text-sm text-amber-700">44%</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-slate-600">91-120 dias</div>
                <div className="text-slate-900">R$ 32k</div>
                <div className="text-sm text-red-700">9%</div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <div className="text-slate-600">120+ dias</div>
                <div className="text-slate-900">R$ 15k</div>
                <div className="text-sm text-red-700">5%</div>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Dias Médios em A/R</span>
                <span className="text-slate-900">38 dias</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Meta</span>
                <span className="text-slate-900">35 dias</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Variação vs. Meta</span>
                <span className="text-red-700">+3 dias (8,6%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aging by Payer Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Aging por Pagador (Mapa de Calor)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agingByPayer}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="payer" 
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
              <Bar dataKey="0-30" name="0-30 dias" stackId="a" fill="#10b981" />
              <Bar dataKey="31-60" name="31-60 dias" stackId="a" fill="#3b82f6" />
              <Bar dataKey="61-90" name="61-90 dias" stackId="a" fill="#f59e0b" />
              <Bar dataKey="91-120" name="91-120 dias" stackId="a" fill="#ef4444" />
              <Bar dataKey="120+" name="120+ dias" stackId="a" fill="#7f1d1d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Oldest Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Contas Mais Antigas (Prioridade de Cobrança)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-slate-600">Paciente</th>
                  <th className="text-left py-3 px-2 text-slate-600">Pagador</th>
                  <th className="text-left py-3 px-2 text-slate-600">Serviço</th>
                  <th className="text-right py-3 px-2 text-slate-600">Valor</th>
                  <th className="text-right py-3 px-2 text-slate-600">Dias</th>
                  <th className="text-right py-3 px-2 text-slate-600">Ação</th>
                </tr>
              </thead>
              <tbody>
                {topOldestAccounts.map((account, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-2 text-slate-900">{account.patient}</td>
                    <td className="py-3 px-2 text-slate-700">{account.payer}</td>
                    <td className="py-3 px-2 text-slate-700">{account.service}</td>
                    <td className="py-3 px-2 text-right text-slate-900">
                      R$ {account.value.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant="destructive">{account.days} dias</Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button 
                        className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1"
                        aria-label={`Ver detalhes da conta de ${account.patient}`}
                        onClick={() => handleAccountClick(account)}
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
