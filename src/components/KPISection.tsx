import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DrillDownDialog, type AccountDetail } from './DrillDownDialog';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  target?: number;
  targetLabel?: string;
  format?: 'currency' | 'percentage' | 'days' | 'number';
  onClick?: () => void;
}

function KPICard({ title, value, change, changeLabel, target, targetLabel, format = 'currency', onClick }: KPICardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  // Para algumas métricas, negativo é bom (ex: dias em A/R, taxa de negação)
  const invertedMetrics = ['Dias em A/R', 'Taxa de Negação', 'Custo p/ Cobrar'];
  const shouldInvert = invertedMetrics.includes(title);
  
  const effectivePositive = shouldInvert ? isNegative : isPositive;
  const effectiveNegative = shouldInvert ? isPositive : isNegative;

  const trendColor = effectivePositive ? 'text-green-700' : effectiveNegative ? 'text-red-700' : 'text-slate-600';
  const trendBg = effectivePositive ? 'bg-green-50' : effectiveNegative ? 'bg-red-50' : 'bg-slate-50';

  return (
    <Card 
      className={onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-slate-900">{value}</span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${trendBg}`}>
              {isPositive && <TrendingUp className="w-3 h-3" aria-hidden="true" />}
              {isNegative && <TrendingDown className="w-3 h-3" aria-hidden="true" />}
              {isNeutral && <Minus className="w-3 h-3" aria-hidden="true" />}
              <span className={trendColor}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
            <span className="text-slate-600">{changeLabel}</span>
          </div>

          {target !== undefined && (
            <div className="text-slate-600">
              Meta: {format === 'percentage' ? `${target}%` : format === 'days' ? `${target} dias` : format === 'number' ? target : `R$ ${target.toLocaleString('pt-BR')}`}
              <span className="ml-2">
                ({targetLabel})
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data for drill-down
const generateMockAccounts = (type: string): AccountDetail[] => {
  const accounts: AccountDetail[] = [];
  const count = type === 'revenue' ? 25 : type === 'denials' ? 15 : 10;
  
  for (let i = 0; i < count; i++) {
    accounts.push({
      id: `ACC-2025-${String(i + 1000).padStart(5, '0')}`,
      patient: ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira'][i % 5],
      payer: ['Unimed', 'Amil', 'Bradesco Saúde', 'SulAmérica'][i % 4],
      service: ['Consulta', 'Exames Lab.', 'Imagem', 'Procedimento'][i % 4],
      value: Math.random() * 5000 + 500,
      date: new Date(2025, 5, Math.floor(Math.random() * 30) + 1).toLocaleDateString('pt-BR'),
      status: type === 'denials' ? 'denied' : ['submitted', 'accepted', 'paid'][i % 3] as any,
      days: Math.floor(Math.random() * 90),
      denialReason: type === 'denials' ? ['Informação Incompleta', 'Código Incorreto', 'Autorização Ausente'][i % 3] : undefined,
      professional: ['Dr. Silva', 'Dra. Santos', 'Dr. Oliveira'][i % 3],
      unit: ['Unidade Centro', 'Unidade Sul'][i % 2],
    });
  }
  
  return accounts;
};

export function KPISection() {
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<{
    title: string;
    description: string;
    accounts: AccountDetail[];
  }>({ title: '', description: '', accounts: [] });

  const handleKPIClick = (type: string, title: string, description: string) => {
    const accounts = generateMockAccounts(type);
    setDrillDownData({ title, description, accounts });
    setDrillDownOpen(true);
  };

  return (
    <section aria-labelledby="kpi-heading">
      <h2 id="kpi-heading" className="sr-only">Indicadores-chave de desempenho</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Receita Mensal"
          value="R$ 487.500"
          change={8.3}
          changeLabel="vs. mês anterior"
          target={500000}
          targetLabel="97,5% da meta"
          onClick={() => handleKPIClick('revenue', 'Detalhes de Receita Mensal', 'Contas que compõem a receita do mês atual')}
        />
        
        <KPICard
          title="Despesas"
          value="R$ 312.400"
          change={-2.1}
          changeLabel="vs. mês anterior"
          target={300000}
          targetLabel="104,1% do orçado"
        />
        
        <KPICard
          title="Lucro Líquido"
          value="R$ 175.100"
          change={12.5}
          changeLabel="vs. mês anterior"
          target={180000}
          targetLabel="97,3% da meta"
        />
        
        <KPICard
          title="Dias em A/R"
          value="38 dias"
          change={-5.0}
          changeLabel="vs. mês anterior"
          target={35}
          targetLabel="8,6% acima"
          format="days"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <KPICard
          title="Taxa de Negação"
          value="8.2%"
          change={-1.2}
          changeLabel="vs. mês anterior"
          target={6}
          targetLabel="36,7% acima"
          format="percentage"
          onClick={() => handleKPIClick('denials', 'Contas Negadas', 'Lista de contas com negação no período atual')}
        />
        
        <KPICard
          title="Clean Claim Rate"
          value="89.5%"
          change={3.2}
          changeLabel="vs. mês anterior"
          target={95}
          targetLabel="94,2% da meta"
          format="percentage"
        />
        
        <KPICard
          title="Net Collection Rate"
          value="94.8%"
          change={1.5}
          changeLabel="vs. mês anterior"
          target={98}
          targetLabel="96,7% da meta"
          format="percentage"
        />
      </div>

      <DrillDownDialog
        open={drillDownOpen}
        onOpenChange={setDrillDownOpen}
        title={drillDownData.title}
        description={drillDownData.description}
        accounts={drillDownData.accounts}
        onExport={() => {
          console.log('Exportar contas drill-down');
        }}
      />
    </section>
  );
}
