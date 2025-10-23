import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Button } from './components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { Download, RefreshCw, Save, FileSpreadsheet, FileText } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { KPISection } from './components/KPISection';
import { OverviewTab } from './components/OverviewTab';
import { DenialsTab } from './components/DenialsTab';
import { AgingTab } from './components/AgingTab';
import { PayersTab } from './components/PayersTab';
import { SavedViews, type ViewFilters } from './components/SavedViews';
import {
  exportToCSV,
  exportToExcel,
  prepareKPIExport,
  prepareAgingExport,
  prepareDenialsExport,
  preparePayersExport,
} from './utils/exportUtils';

export default function App() {
  const [period, setPeriod] = useState('month');
  const [unit, setUnit] = useState('all');
  const [professional, setProfessional] = useState('all');
  const [payer, setPayer] = useState('all');
  const [lastUpdated] = useState(new Date().toLocaleString('pt-BR'));
  const [savedViewsOpen, setSavedViewsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');

  const handleExportCSV = () => {
    const filters = { period, unit, professional, payer };
    let data;
    
    switch (currentTab) {
      case 'denials':
        data = prepareDenialsExport();
        break;
      case 'aging':
        data = prepareAgingExport();
        break;
      case 'payers':
        data = preparePayersExport();
        break;
      default:
        data = prepareKPIExport(filters);
    }
    
    exportToCSV(data);
    toast.success('Dados exportados para CSV com sucesso!');
  };

  const handleExportExcel = () => {
    const filters = { period, unit, professional, payer };
    let data;
    
    switch (currentTab) {
      case 'denials':
        data = prepareDenialsExport();
        break;
      case 'aging':
        data = prepareAgingExport();
        break;
      case 'payers':
        data = preparePayersExport();
        break;
      default:
        data = prepareKPIExport(filters);
    }
    
    exportToExcel(data);
    toast.success('Dados exportados para Excel com sucesso!');
  };

  const handleLoadView = (filters: ViewFilters) => {
    setPeriod(filters.period);
    setUnit(filters.unit);
    setProfessional(filters.professional);
    setPayer(filters.payer);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-slate-900">Painel de Faturamento</h1>
            <p className="text-slate-600 mt-1">
              Última atualização: {lastUpdated}
              <span className="ml-3 inline-flex items-center gap-1 text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></span>
                Dados validados
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
              aria-label="Atualizar dados"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSavedViewsOpen(true)}
              aria-label="Gerenciar visões salvas"
            >
              <Save className="w-4 h-4 mr-2" />
              Visões
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  aria-label="Exportar dados"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exportar Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[140px]">
            <label htmlFor="period-filter" className="sr-only">Período</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period-filter" aria-label="Selecionar período">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label htmlFor="unit-filter" className="sr-only">Unidade</label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit-filter" aria-label="Selecionar unidade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Unidades</SelectItem>
                <SelectItem value="unit1">Unidade Centro</SelectItem>
                <SelectItem value="unit2">Unidade Sul</SelectItem>
                <SelectItem value="unit3">Unidade Norte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label htmlFor="professional-filter" className="sr-only">Profissional</label>
            <Select value={professional} onValueChange={setProfessional}>
              <SelectTrigger id="professional-filter" aria-label="Selecionar profissional">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Profissionais</SelectItem>
                <SelectItem value="dr1">Dr. Silva</SelectItem>
                <SelectItem value="dr2">Dra. Santos</SelectItem>
                <SelectItem value="dr3">Dr. Oliveira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label htmlFor="payer-filter" className="sr-only">Pagador</label>
            <Select value={payer} onValueChange={setPayer}>
              <SelectTrigger id="payer-filter" aria-label="Selecionar pagador">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Pagadores</SelectItem>
                <SelectItem value="unimed">Unimed</SelectItem>
                <SelectItem value="amil">Amil</SelectItem>
                <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                <SelectItem value="particular">Particular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <KPISection />

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-6">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="revenue"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Receitas/Despesas
          </TabsTrigger>
          <TabsTrigger 
            value="denials"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Negações
          </TabsTrigger>
          <TabsTrigger 
            value="aging"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            A/R & Aging
          </TabsTrigger>
          <TabsTrigger 
            value="payers"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Pagadores/Serviços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="denials" className="mt-6">
          <DenialsTab />
        </TabsContent>

        <TabsContent value="aging" className="mt-6">
          <AgingTab />
        </TabsContent>

        <TabsContent value="payers" className="mt-6">
          <PayersTab />
        </TabsContent>
      </Tabs>

      {/* Saved Views Dialog */}
      <SavedViews
        open={savedViewsOpen}
        onOpenChange={setSavedViewsOpen}
        currentFilters={{ period, unit, professional, payer }}
        onLoadView={handleLoadView}
      />
    </div>
  );
}
