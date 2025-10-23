export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
}

/**
 * Exporta dados para CSV
 */
export function exportToCSV(data: ExportData): void {
  const { headers, rows, filename } = data;

  // Criar o conteúdo CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // Escapar células que contêm vírgulas ou aspas
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    )
  ].join('\n');

  // Adicionar BOM para suporte UTF-8 no Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Criar link de download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Exporta dados para Excel (formato XLSX básico via CSV)
 */
export function exportToExcel(data: ExportData): void {
  // Para uma implementação básica, usamos CSV com extensão .xls
  // Para XLSX real, seria necessário uma biblioteca como SheetJS
  const { headers, rows, filename } = data;
  
  const csvContent = [
    headers.join('\t'),
    ...rows.map(row => row.join('\t'))
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'application/vnd.ms-excel;charset=utf-8;' 
  });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Formata valor monetário para exportação
 */
export function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formata data para exportação
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

/**
 * Prepara dados de KPIs para exportação
 */
export function prepareKPIExport(filters: {
  period: string;
  unit: string;
  professional: string;
  payer: string;
}): ExportData {
  return {
    headers: [
      'KPI',
      'Valor',
      'Variação (%)',
      'Meta',
      '% da Meta',
    ],
    rows: [
      ['Receita Mensal', formatCurrency(487500), '8.3', formatCurrency(500000), '97.5'],
      ['Despesas', formatCurrency(312400), '-2.1', formatCurrency(300000), '104.1'],
      ['Lucro Líquido', formatCurrency(175100), '12.5', formatCurrency(180000), '97.3'],
      ['Dias em A/R', '38 dias', '-5.0', '35 dias', '108.6'],
      ['Taxa de Negação', '8.2%', '-1.2', '6%', '136.7'],
      ['Clean Claim Rate', '89.5%', '3.2', '95%', '94.2'],
      ['Net Collection Rate', '94.8%', '1.5', '98%', '96.7'],
    ],
    filename: `KPIs_${filters.period}_${new Date().toISOString().split('T')[0]}`,
  };
}

/**
 * Prepara dados de aging para exportação
 */
export function prepareAgingExport(): ExportData {
  return {
    headers: [
      'Faixa',
      'Valor',
      'Quantidade',
      'Percentual',
    ],
    rows: [
      ['0-30 dias', formatCurrency(145000), '425', '42%'],
      ['31-60 dias', formatCurrency(98000), '285', '28%'],
      ['61-90 dias', formatCurrency(56000), '168', '16%'],
      ['91-120 dias', formatCurrency(32000), '95', '9%'],
      ['120+ dias', formatCurrency(15000), '48', '5%'],
    ],
    filename: `Aging_AR_${new Date().toISOString().split('T')[0]}`,
  };
}

/**
 * Prepara dados de negações para exportação
 */
export function prepareDenialsExport(): ExportData {
  return {
    headers: [
      'Motivo',
      'Quantidade',
      'Valor',
      'Percentual',
    ],
    rows: [
      ['Informação Incompleta', '245', formatCurrency(18500), '25%'],
      ['Código Incorreto', '186', formatCurrency(14200), '19%'],
      ['Autorização Ausente', '167', formatCurrency(12800), '17%'],
      ['Duplicata', '142', formatCurrency(10900), '14%'],
      ['Fora do Prazo', '128', formatCurrency(9800), '13%'],
      ['Outros', '118', formatCurrency(9000), '12%'],
    ],
    filename: `Negacoes_${new Date().toISOString().split('T')[0]}`,
  };
}

/**
 * Prepara dados de pagadores para exportação
 */
export function preparePayersExport(): ExportData {
  return {
    headers: [
      'Pagador',
      'Receita',
      'Quantidade',
      'Percentual',
      'Dias A/R',
      'Collection Rate',
      'Taxa Negação',
    ],
    rows: [
      ['Unimed', formatCurrency(125000), '3240', '25.6%', '35', '96.5%', '8.8%'],
      ['Amil', formatCurrency(98000), '2580', '20.1%', '42', '94.2%', '7.7%'],
      ['Bradesco Saúde', formatCurrency(87000), '2145', '17.8%', '38', '95.1%', '8.2%'],
      ['SulAmérica', formatCurrency(72000), '1890', '14.8%', '40', '93.8%', '7.5%'],
      ['NotreDame', formatCurrency(58500), '1650', '12.0%', '45', '92.5%', '7.5%'],
      ['Particular', formatCurrency(47000), '1420', '9.6%', '25', '98.2%', '4.4%'],
    ],
    filename: `Pagadores_${new Date().toISOString().split('T')[0]}`,
  };
}
