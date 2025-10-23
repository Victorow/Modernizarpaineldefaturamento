import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Save, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export interface ViewFilters {
  period: string;
  unit: string;
  professional: string;
  payer: string;
}

export interface SavedView {
  id: string;
  name: string;
  profile: 'financeiro' | 'faturista' | 'gestor' | 'custom';
  filters: ViewFilters;
  createdAt: string;
}

interface SavedViewsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: ViewFilters;
  onLoadView: (filters: ViewFilters) => void;
}

const STORAGE_KEY = 'clinic_billing_saved_views';

const profileLabels = {
  financeiro: 'Financeiro',
  faturista: 'Faturista',
  gestor: 'Gestor',
  custom: 'Personalizado',
};

const profileColors = {
  financeiro: 'bg-blue-100 text-blue-700',
  faturista: 'bg-green-100 text-green-700',
  gestor: 'bg-purple-100 text-purple-700',
  custom: 'bg-slate-100 text-slate-700',
};

export function SavedViews({ open, onOpenChange, currentFilters, onLoadView }: SavedViewsProps) {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [newViewName, setNewViewName] = useState('');
  const [newViewProfile, setNewViewProfile] = useState<SavedView['profile']>('custom');
  const [showSaveForm, setShowSaveForm] = useState(false);

  useEffect(() => {
    loadSavedViews();
  }, []);

  const loadSavedViews = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedViews(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar visões salvas:', error);
      toast.error('Erro ao carregar visões salvas');
    }
  };

  const saveView = () => {
    if (!newViewName.trim()) {
      toast.error('Digite um nome para a visão');
      return;
    }

    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      profile: newViewProfile,
      filters: currentFilters,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedViews, newView];
    setSavedViews(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    setNewViewName('');
    setNewViewProfile('custom');
    setShowSaveForm(false);
    
    toast.success(`Visão "${newViewName}" salva com sucesso!`);
  };

  const deleteView = (id: string) => {
    const view = savedViews.find(v => v.id === id);
    const updated = savedViews.filter(v => v.id !== id);
    setSavedViews(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    if (view) {
      toast.success(`Visão "${view.name}" excluída`);
    }
  };

  const loadView = (view: SavedView) => {
    onLoadView(view.filters);
    onOpenChange(false);
    toast.success(`Visão "${view.name}" carregada`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Visões Salvas</DialogTitle>
          <DialogDescription>
            Salve e gerencie configurações de filtros para acesso rápido
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Save New View Form */}
          {showSaveForm ? (
            <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
              <h4 className="text-slate-900">Salvar Visão Atual</h4>
              
              <div className="space-y-2">
                <Label htmlFor="view-name">Nome da Visão</Label>
                <Input
                  id="view-name"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="Ex: Visão Mensal Unimed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="view-profile">Perfil</Label>
                <Select value={newViewProfile} onValueChange={(value: SavedView['profile']) => setNewViewProfile(value)}>
                  <SelectTrigger id="view-profile">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="faturista">Faturista</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-blue-50 rounded text-sm">
                <div className="text-slate-700">Filtros atuais:</div>
                <div className="mt-1 space-y-1 text-slate-600">
                  <div>Período: <strong>{currentFilters.period}</strong></div>
                  <div>Unidade: <strong>{currentFilters.unit}</strong></div>
                  <div>Profissional: <strong>{currentFilters.professional}</strong></div>
                  <div>Pagador: <strong>{currentFilters.payer}</strong></div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveView} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Visão
                </Button>
                <Button variant="outline" onClick={() => setShowSaveForm(false)} size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowSaveForm(true)} className="w-full" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Salvar Visão Atual
            </Button>
          )}

          {/* Saved Views List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedViews.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Nenhuma visão salva ainda
              </div>
            ) : (
              savedViews.map((view) => (
                <div
                  key={view.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-slate-900">{view.name}</h4>
                      <p className="text-xs text-slate-500">
                        Criado em {new Date(view.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className={profileColors[view.profile]}>
                      {profileLabels[view.profile]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-slate-600">Período:</span>
                      <span className="ml-2 text-slate-900">{view.filters.period}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Unidade:</span>
                      <span className="ml-2 text-slate-900">{view.filters.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Profissional:</span>
                      <span className="ml-2 text-slate-900">{view.filters.professional}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Pagador:</span>
                      <span className="ml-2 text-slate-900">{view.filters.payer}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadView(view)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Carregar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteView(view.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
