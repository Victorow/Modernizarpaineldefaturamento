import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Download, ExternalLink } from 'lucide-react';
import { exportToCSV, type ExportData } from '../utils/exportUtils';
import { toast } from 'sonner@2.0.3';

export interface AccountDetail {
  id: string;
  patient: string;
  payer: string;
  service: string;
  value: number;
  date: string;
  status: 'pending' | 'submitted' | 'accepted' | 'denied' | 'paid';
  days: number;
  denialReason?: string;
  professional?: string;
  unit?: string;
}

interface DrillDownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  accounts: AccountDetail[];
  onExport?: () => void;
}

const statusLabels: Record<string, string> = {
  pending: 'A Enviar',
  submitted: 'Enviado',
  accepted: 'Aceito',
  denied: 'Negado',
  paid: 'Pago',
};

const statusColors: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-700',
  submitted: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  denied: 'bg-red-100 text-red-700',
  paid: 'bg-emerald-100 text-emerald-700',
};

export function DrillDownDialog({ open, onOpenChange, title, description, accounts, onExport }: DrillDownDialogProps) {
  const totalValue = accounts.reduce((sum, acc) => sum + acc.value, 0);

  const handleExportAccounts = () => {
    const exportData: ExportData = {
      headers: ['ID', 'Paciente', 'Pagador', 'Serviço', 'Valor', 'Data', 'Status', 'Dias A/R', 'Profissional', 'Unidade', 'Motivo Negação'],
      rows: accounts.map(acc => [
        acc.id,
        acc.patient,
        acc.payer,
        acc.service,
        `R$ ${acc.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        acc.date,
        statusLabels[acc.status],
        acc.days.toString(),
        acc.professional || '',
        acc.unit || '',
        acc.denialReason || '',
      ]),
      filename: `Contas_${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}`,
    };

    exportToCSV(exportData);
    toast.success(`${accounts.length} contas exportadas com sucesso!`);
    
    if (onExport) onExport();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="flex items-center justify-between py-3 border-b">
          <div className="flex gap-6">
            <div>
              <span className="text-slate-600">Total de Contas:</span>
              <span className="ml-2 text-slate-900">{accounts.length}</span>
            </div>
            <div>
              <span className="text-slate-600">Valor Total:</span>
              <span className="ml-2 text-slate-900">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportAccounts}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Lista
          </Button>
        </div>

        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-slate-900">{account.patient}</h4>
                    <p className="text-sm text-slate-600">ID: {account.id}</p>
                  </div>
                  <Badge className={statusColors[account.status]}>
                    {statusLabels[account.status]}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600">Pagador:</span>
                    <p className="text-slate-900">{account.payer}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Serviço:</span>
                    <p className="text-slate-900">{account.service}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Valor:</span>
                    <p className="text-slate-900">R$ {account.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Data:</span>
                    <p className="text-slate-900">{account.date}</p>
                  </div>
                </div>

                {account.professional && (
                  <div className="mt-2 text-sm">
                    <span className="text-slate-600">Profissional:</span>
                    <span className="ml-2 text-slate-900">{account.professional}</span>
                  </div>
                )}

                {account.denialReason && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                    <span className="text-red-700">Motivo da Negação:</span>
                    <span className="ml-2 text-red-900">{account.denialReason}</span>
                  </div>
                )}

                {account.days > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="text-slate-600">Dias em A/R:</span>
                    <Badge 
                      variant={account.days > 90 ? 'destructive' : account.days > 60 ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {account.days} dias
                    </Badge>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t flex justify-end">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver detalhes completos
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
