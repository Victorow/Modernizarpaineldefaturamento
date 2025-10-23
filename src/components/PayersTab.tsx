import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const payerMix = [
  { payer: 'Unimed', value: 125000, percentage: 25.6, count: 3240 },
  { payer: 'Amil', value: 98000, percentage: 20.1, count: 2580 },
  { payer: 'Bradesco Saúde', value: 87000, percentage: 17.8, count: 2145 },
  { payer: 'SulAmérica', value: 72000, percentage: 14.8, count: 1890 },
  { payer: 'NotreDame', value: 58500, percentage: 12.0, count: 1650 },
  { payer: 'Particular', value: 47000, percentage: 9.6, count: 1420 },
];

const serviceRevenue = [
  { service: 'Consultas', value: 145000, percentage: 29.7, count: 4580 },
  { service: 'Exames Laboratoriais', value: 112000, percentage: 23.0, count: 2840 },
  { service: 'Imagem (US, RX, etc)', value: 98000, percentage: 20.1, count: 1650 },
  { service: 'Procedimentos', value: 78500, percentage: 16.1, count: 1280 },
  { service: 'Fisioterapia', value: 32000, percentage: 6.6, count: 980 },
  { service: 'Outros', value: 22000, percentage: 4.5, count: 595 },
];

const payerPerformance = [
  { payer: 'Unimed', avgDays: 35, collectionRate: 96.5, denialRate: 8.8 },
  { payer: 'Amil', avgDays: 42, collectionRate: 94.2, denialRate: 7.7 },
  { payer: 'Bradesco Saúde', avgDays: 38, collectionRate: 95.1, denialRate: 8.2 },
  { payer: 'SulAmérica', avgDays: 40, collectionRate: 93.8, denialRate: 7.5 },
  { payer: 'NotreDame', avgDays: 45, collectionRate: 92.5, denialRate: 7.5 },
  { payer: 'Particular', avgDays: 25, collectionRate: 98.2, denialRate: 4.4 },
];

const PAYER_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];
const SERVICE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#94a3b8'];

export function PayersTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payer Mix */}
        <Card>
          <CardHeader>
            <CardTitle>Mix de Pagadores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={payerMix}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ payer, percentage }) => `${payer}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {payerMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PAYER_COLORS[index % PAYER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {payerMix.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: PAYER_COLORS[index] }}
                      aria-hidden="true"
                    ></div>
                    <span className="text-slate-700">{item.payer}</span>
                  </div>
                  <span className="text-slate-900">R$ {(item.value / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Tipo de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  type="category" 
                  dataKey="service" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  width={120}
                />
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                />
                <Bar dataKey="value" name="Receita" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {serviceRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-slate-600">
              Total: <strong className="text-slate-900">11.925 atendimentos</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payer Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Pagador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-slate-600">Pagador</th>
                  <th className="text-right py-3 px-2 text-slate-600">Dias Médios A/R</th>
                  <th className="text-right py-3 px-2 text-slate-600">Collection Rate</th>
                  <th className="text-right py-3 px-2 text-slate-600">Taxa de Negação</th>
                  <th className="text-right py-3 px-2 text-slate-600">Performance</th>
                </tr>
              </thead>
              <tbody>
                {payerPerformance.map((payer, index) => {
                  const performanceScore = 
                    (100 - payer.avgDays) * 0.4 + 
                    payer.collectionRate * 0.4 + 
                    (100 - payer.denialRate * 10) * 0.2;
                  const performanceLabel = 
                    performanceScore >= 85 ? 'Excelente' :
                    performanceScore >= 75 ? 'Bom' :
                    performanceScore >= 65 ? 'Regular' : 'Atenção';
                  const performanceColor = 
                    performanceScore >= 85 ? 'text-green-700 bg-green-50' :
                    performanceScore >= 75 ? 'text-blue-700 bg-blue-50' :
                    performanceScore >= 65 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50';

                  return (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-2 text-slate-900">{payer.payer}</td>
                      <td className="py-3 px-2 text-right">
                        <span className={payer.avgDays <= 35 ? 'text-green-700' : payer.avgDays <= 45 ? 'text-amber-700' : 'text-red-700'}>
                          {payer.avgDays} dias
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={payer.collectionRate >= 95 ? 'text-green-700' : payer.collectionRate >= 90 ? 'text-amber-700' : 'text-red-700'}>
                          {payer.collectionRate}%
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={payer.denialRate <= 6 ? 'text-green-700' : payer.denialRate <= 8 ? 'text-amber-700' : 'text-red-700'}>
                          {payer.denialRate}%
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={`px-2 py-1 rounded text-sm ${performanceColor}`}>
                          {performanceLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-slate-700">
            <strong>Performance:</strong> Calculada com base em Dias A/R (40%), Collection Rate (40%) e Taxa de Negação (20%)
          </div>
        </CardContent>
      </Card>

      {/* Top Services by Payer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-700">Unimed - Top Serviços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Consultas</span>
              <span className="text-slate-900">R$ 42k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Exames Lab.</span>
              <span className="text-slate-900">R$ 38k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Imagem</span>
              <span className="text-slate-900">R$ 28k</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-700">Amil - Top Serviços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Exames Lab.</span>
              <span className="text-slate-900">R$ 35k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Consultas</span>
              <span className="text-slate-900">R$ 32k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Procedimentos</span>
              <span className="text-slate-900">R$ 18k</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-700">Bradesco - Top Serviços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Consultas</span>
              <span className="text-slate-900">R$ 28k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Imagem</span>
              <span className="text-slate-900">R$ 25k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Exames Lab.</span>
              <span className="text-slate-900">R$ 22k</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
