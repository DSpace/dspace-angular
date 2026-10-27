import { AsyncPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { SortOptions } from '@dspace/core/cache/models/sort-options.model';

// Importações dos serviços oficiais do DSpace para varredura completa
import { ItemDataService } from '../../../../../../app/core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../../../../../app/core/shared/operators';
import { AiSummaryComponent } from '../../../../../../app/evidencia/ai-summary/ai-summary.component';
import {
  AiSummaryDocument,
  AiSummaryService,
} from '../../../../../../app/evidencia/ai-summary/ai-summary.service';
import {
  AI_SUMMARY_STORAGE_KEYS,
  readStored,
  removeStored,
  writeStored,
} from '../../../../../../app/evidencia/ai-summary/ai-summary.storage';

import {
  fadeIn,
  fadeInOut,
} from '../../../../../../app/shared/animations/fade';
import { ErrorComponent } from '../../../../../../app/shared/error/error.component';
import { ObjectCollectionComponent } from '../../../../../../app/shared/object-collection/object-collection.component';
import { SearchExportCsvComponent } from '../../../../../../app/shared/search/search-export-csv/search-export-csv.component';
import { SearchLabelsComponent } from '../../../../../../app/shared/search/search-labels/search-labels.component';
import { SearchResultsSkeletonComponent } from '../../../../../../app/shared/search/search-results/search-results-skeleton/search-results-skeleton.component';
import { SearchResultsComponent as BaseComponent } from '../../../../../../app/shared/search/search-results/search-results.component';
import { SearchSettingsComponent } from '../search-settings/search-settings.component';

/**
 * O que precisa sobreviver ao F5 para a aba de síntese voltar como estava: de qual
 * busca ela era e sobre quais documentos. A resposta em si fica no cache do
 * `AiSummaryService`.
 */
interface StoredAiSummaryView {
  query: string;
  searchType: string;
  documents: AiSummaryDocument[];
}

@Component({
  selector: 'ds-themed-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: [
    '../../../../../../app/shared/search/search-results/search-results.component.scss',
    './search-results.component.scss',
  ],
  animations: [fadeIn, fadeInOut],
  imports: [
    AiSummaryComponent,
    AsyncPipe,
    ErrorComponent,
    NgbDropdownModule,
    NgxSkeletonLoaderModule,
    ObjectCollectionComponent,
    RouterLink,
    SearchExportCsvComponent,
    SearchLabelsComponent,
    SearchResultsSkeletonComponent,
    SearchSettingsComponent,
    TranslateModule,
  ],
})
export class SearchResultsComponent extends BaseComponent implements OnChanges {

  @Input() sortOptionsList: SortOptions[];

  selectedCount = 0;
  /** Marcado quando todos os itens da página estão selecionados */
  allSelected = false;
  isExporting = false;
  isExportingDocx = false;
  isExportingPdf = false;

  /**
   * Aba visível. "Resultados" é a inicial: a síntese custa uma inferência de LLM
   * e ninguém a pediu ainda ao chegar na busca. A exceção é o F5 com a síntese
   * aberta — ver `restoreAiSummaryView`.
   */
  readonly activeTab = signal<'results' | 'ai-summary'>('results');

  /**
   * Itens marcados na lista quando a aba de síntese foi aberta.
   *
   * Fica num sinal e não numa leitura do DOM porque a aba de resultados sai da
   * tela ao trocar de aba: quando o painel de síntese pergunta pela seleção, as
   * caixas de seleção já não existem mais.
   */
  readonly selectedDocuments = signal<AiSummaryDocument[]>([]);

  private itemDataService = inject(ItemDataService);
  private host = inject(ElementRef<HTMLElement>);

  /**
   * A aba de síntese aparece nesta instalação? Desligada por padrão — ver
   * `aiSummary.enabled` no app config. Lido uma vez: configuração não muda em
   * tempo de execução, e o template consulta isso a cada verificação.
   */
  readonly aiSummaryEnabled = inject(AiSummaryService).enabled;

  /** O primeiro `searchConfig` é a montagem da tela; os seguintes são busca ou
   *  filtro trocados. Só o primeiro pode reabrir a síntese via F5. */
  private firstSearchConfig = true;

  ngOnChanges(changes: SimpleChanges): void {
    // Os checkboxes são recriados quando os resultados mudam, então o estado volta a ser lido deles
    if (changes.searchResults) {
      setTimeout(() => this.updateSelectedCount());
    }
    if (!changes.searchConfig) {
      return;
    }
    if (this.firstSearchConfig) {
      this.firstSearchConfig = false;
      // F5 na síntese aberta volta a ela, se for a mesma busca e a mesma seleção.
      this.restoreAiSummaryView();
      return;
    }
    // Busca alterada ou filtro aplicado depois da montagem: a seleção que a
    // síntese resumia veio das caixas da lista, que é recarregada e volta em
    // branco. Manter o painel aberto o deixaria falando de documentos que já
    // saíram do resultado, então ele é limpo e escondido para ficar em sincronia
    // com a busca e os filtros atuais.
    this.clearAiSummary();
  }

  showTab(tab: 'results' | 'ai-summary'): void {
    if (tab === 'ai-summary') {
      // Última chance de ler as caixas de seleção: a troca de aba desmonta a
      // lista de resultados.
      const documents = this.readSelectedDocuments();
      // A síntese só existe sobre uma seleção. Sem itens marcados não há o que
      // resumir, então o clique não abre a aba.
      if (documents.length === 0) {
        return;
      }
      this.selectedDocuments.set(documents);
      this.selectedCount = documents.length;
      this.activeTab.set('ai-summary');
      // O F5 volta à síntese com a mesma seleção.
      this.storeAiSummaryView();
    } else {
      // A lista é remontada com as caixas em branco, então o contador volta a
      // zero junto — senão a exportação segue habilitada sobre uma seleção que
      // já não existe na tela.
      this.selectedCount = 0;
      this.allSelected = false;
      this.selectedDocuments.set([]);
      this.activeTab.set('results');
      removeStored(AI_SUMMARY_STORAGE_KEYS.view);
    }
  }

  /**
   * Esvazia a síntese e volta à lista de resultados.
   *
   * Chamado a cada mudança de busca ou filtro: a seleção deixa de valer e o
   * painel não pode continuar aberto sobre ela.
   */
  private clearAiSummary(): void {
    this.selectedCount = 0;
    this.allSelected = false;
    this.selectedDocuments.set([]);
    this.activeTab.set('results');
    removeStored(AI_SUMMARY_STORAGE_KEYS.view);
  }

  /**
   * Depois de um F5, reabre a síntese se ela estava aberta **para esta mesma
   * busca**, com a mesma seleção — o cache do serviço devolve o texto sem outra
   * chamada à API.
   *
   * Busca diferente é navegação nova, não F5: o estado guardado sai, para uma
   * volta futura àquela consulta não abrir a síntese sozinha.
   */
  private restoreAiSummaryView(): void {
    const query = this.searchConfig?.query?.trim() ?? '';
    if (!this.aiSummaryEnabled || query === '') {
      return;
    }

    const stored = readStored<StoredAiSummaryView>(AI_SUMMARY_STORAGE_KEYS.view);
    if (stored === null) {
      return;
    }
    const sameSearch = stored.query === query && stored.searchType === this.currentSearchType();
    // A síntese só se restaura sobre uma seleção: sem documentos guardados não há
    // o que reabrir, mesma regra da abertura pela aba.
    if (!sameSearch || !Array.isArray(stored.documents) || stored.documents.length === 0) {
      removeStored(AI_SUMMARY_STORAGE_KEYS.view);
      return;
    }
    this.selectedDocuments.set(stored.documents);
    this.selectedCount = stored.documents.length;
    this.activeTab.set('ai-summary');
  }

  private storeAiSummaryView(): void {
    const view: StoredAiSummaryView = {
      query: this.searchConfig?.query?.trim() ?? '',
      searchType: this.currentSearchType(),
      documents: this.selectedDocuments(),
    };
    writeStored(AI_SUMMARY_STORAGE_KEYS.view, view);
  }

  private currentSearchType(): string {
    return this.searchConfig?.searchType ?? '';
  }

  @HostListener('change', ['$event'])
  onChange(event: Event) {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('item-checkbox')) {
      this.updateSelectedCount();
    }
  }

  /** Checkboxes dos itens desta lista de resultados */
  private itemCheckboxes(): HTMLInputElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll('.item-checkbox'));
  }

  /** Ids dos itens marcados, usados na exportação */
  private selectedItemIds(): string[] {
    return this.itemCheckboxes()
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.id.replace('checkbox-', ''));
  }

  /**
   * A seleção no formato que a síntese pede: UUID e, quando a página de
   * resultados o conhece, o handle do item.
   *
   * O handle vem do resultado já carregado, não do DOM — a lista só imprime o
   * UUID —, e é opcional: a API acha o documento pelo UUID, o handle apenas
   * dispensa a tradução do outro lado.
   */
  private readSelectedDocuments(): AiSummaryDocument[] {
    return this.selectedItemIds()
      .map((uuid: string) => ({ uuid, handle: this.handleOf(uuid) }));
  }

  /** Handle do item na página de resultados atual; `null` quando não se sabe. */
  private handleOf(uuid: string): string | null {
    const page = this.searchResults?.payload?.page ?? [];
    for (const result of page) {
      const dso = result?.indexableObject as { uuid?: string, handle?: string };
      if (dso?.uuid === uuid) {
        return dso.handle ?? null;
      }
    }
    return null;
  }

  updateSelectedCount() {
    // Com a aba de síntese aberta a lista não está na tela: contar as caixas daria
    // zero e apagaria a seleção que a síntese está usando.
    if (this.activeTab() === 'ai-summary') {
      return;
    }
    const checkboxes = this.itemCheckboxes();
    this.selectedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
    this.allSelected = checkboxes.length > 0 && this.selectedCount === checkboxes.length;
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.itemCheckboxes().forEach((checkbox) => (checkbox.checked = isChecked));
    this.updateSelectedCount();
  }

  async exportSelectedToCsv() {
    const selectedIds = this.selectedItemIds();

    if (selectedIds.length === 0) return;

    this.isExporting = true;

    try {
      const fullItemsPromises = selectedIds.map((id) => {
        const request$ = this.itemDataService.findById(id).pipe(
          getFirstCompletedRemoteData(),
          map((rd) => (rd.hasSucceeded ? rd.payload : null)),
        );
        return firstValueFrom(request$);
      });

      const fullItems = await Promise.all(fullItemsPromises);
      const validItems = fullItems.filter((item) => item !== null);

      const allKeysSet = new Set<string>();
      validItems.forEach((item: any) => {
        if (item && item.metadata) {
          Object.keys(item.metadata).forEach((key) => allKeysSet.add(key));
        }
      });

      const headerKeys = Array.from(allKeysSet).sort();

      const escapeCsv = (text: string) => {
        if (!text) return '""';
        return `"${text.replace(/"/g, '""')}"`;
      };

      const csvRows = [];
      const headers = ['id', 'collection', 'handle', ...headerKeys];
      csvRows.push(headers.map((h) => escapeCsv(h)).join(','));

      validItems.forEach((item: any) => {
        const row = [];

        row.push(escapeCsv(item.uuid || item.id || ''));
        row.push(escapeCsv(item.owningCollection?.id || ''));
        row.push(escapeCsv(item.handle || ''));

        headerKeys.forEach((key) => {
          const values = item.allMetadataValues
            ? item.allMetadataValues(key)
            : [];
          const finalValue = values.length > 0 ? values.join('||') : '';
          row.push(escapeCsv(finalValue));
        });

        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `exportacao_completa_dspace.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro na varredura de metadados na API:', error);
    } finally {
      this.isExporting = false;
    }
  }

  async exportSelectedToDocx() {
    const selectedIds = this.selectedItemIds();

    if (selectedIds.length === 0) return;

    this.isExportingDocx = true;

    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } = await import('docx');

      const fullItemsPromises = selectedIds.map((id) => {
        const request$ = this.itemDataService.findById(id).pipe(
          getFirstCompletedRemoteData(),
          map((rd) => (rd.hasSucceeded ? rd.payload : null)),
        );
        return firstValueFrom(request$);
      });

      const fullItems = await Promise.all(fullItemsPromises);
      const validItems = fullItems.filter((item) => item !== null);

      const allKeysSet = new Set<string>();
      validItems.forEach((item: any) => {
        if (item?.metadata) {
          Object.keys(item.metadata).forEach((key) => allKeysSet.add(key));
        }
      });
      const allKeys = Array.from(allKeysSet).sort();

      const getValues = (item: any, key: string): string => {
        const values = item.allMetadataValues ? item.allMetadataValues(key) : [];
        return values.filter((v: string) => !!v).join(' || ');
      };

      const fieldParagraph = (label: string, value: string) =>
        new Paragraph({
          children: [
            new TextRun({ text: `${label}: `, bold: true }),
            new TextRun({ text: value }),
          ],
          spacing: { after: 80 },
        });

      const separator = new Paragraph({
        border: { bottom: { color: 'CCCCCC', style: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 200, after: 200 },
        children: [],
      });

      const sections: any[] = [];

      validItems.forEach((item: any, index: number) => {
        const titulo = getValues(item, 'dc.title');

        sections.push(
          new Paragraph({
            text: titulo || item.uuid || '',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: index === 0 ? 0 : 100, after: 120 },
          }),
        );

        const idVal = item.uuid || item.id || '';
        const collectionVal = item.owningCollection?.id || '';
        const handleVal = item.handle || '';

        if (idVal) { sections.push(fieldParagraph('id', idVal)); }
        if (collectionVal) { sections.push(fieldParagraph('collection', collectionVal)); }
        if (handleVal) { sections.push(fieldParagraph('handle', handleVal)); }

        allKeys.forEach((key) => {
          if (key === 'dc.title') return;
          const value = getValues(item, key);
          if (value) { sections.push(fieldParagraph(key, value)); }
        });

        if (index < validItems.length - 1) {
          sections.push(separator);
        }
      });

      const doc = new Document({
        sections: [{ children: sections }],
      });

      const buffer = await Packer.toBlob(doc);
      const today = new Date().toISOString().split('T')[0];
      const url = URL.createObjectURL(buffer);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `exportacao_${today}.docx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar DOCX:', error);
    } finally {
      this.isExportingDocx = false;
    }
  }

  async exportSelectedToPdf() {
    const selectedIds = this.selectedItemIds();

    if (selectedIds.length === 0) return;

    // Ativa o spinner de loading no botão
    this.isExportingPdf = true;

    try {
      // 1. Busca os itens completos na API do DSpace
      const fullItemsPromises = selectedIds.map((id) => {
        const request$ = this.itemDataService.findById(id).pipe(
          getFirstCompletedRemoteData(),
          map((rd) => (rd.hasSucceeded ? rd.payload : null)),
        );
        return firstValueFrom(request$);
      });

      const fullItems = await Promise.all(fullItemsPromises);
      const validItems = fullItems.filter((item) => item !== null);

      // 2. Extrai todas as chaves de metadados presentes
      const allKeysSet = new Set<string>();
      validItems.forEach((item: any) => {
        if (item?.metadata) {
          Object.keys(item.metadata).forEach((key) => allKeysSet.add(key));
        }
      });
      const allKeys = Array.from(allKeysSet).sort();

      // 3. Constrói o HTML puro focado em tipografia e impressão (Print CSS)
      let htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Exportação de Resultados</title>
          <style>
            /* CSS Otimizado para Geração de PDF nativo */
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px; }
            h1 { font-size: 22px; border-bottom: 2px solid #2B4E72; padding-bottom: 10px; margin-bottom: 30px; }
            .item-container { margin-bottom: 40px; page-break-inside: avoid; }
            .item-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #2B4E72; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
            th { width: 25%; color: #666; font-weight: normal; }
            td { font-weight: bold; }
            
            /* Regras estritas para quando o navegador for "imprimir" */
            @media print {
              body { padding: 0; }
              @page { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <h1>Resultados da Busca - DSpace</h1>
      `;

      // 4. Preenche o HTML com os dados dos itens
      validItems.forEach((item: any, index: number) => {
        const titleValues = item.allMetadataValues ? item.allMetadataValues('dc.title') : [];
        const title = titleValues.length > 0 ? titleValues.join(' || ') : 'Sem Título';
        
        htmlContent += `
          <div class="item-container">
            <div class="item-title">${index + 1}. ${title}</div>
            <table>
              <tbody>
                <tr><th>ID</th><td>${item.uuid || item.id || ''}</td></tr>
                <tr><th>Coleção</th><td>${item.owningCollection?.id || ''}</td></tr>
                <tr><th>Handle</th><td>${item.handle || ''}</td></tr>
        `;

        // Preenche os demais metadados dinamicamente
        allKeys.forEach((key) => {
          if (key === 'dc.title') return; // Ignora o título, pois já foi no cabeçalho
          const values = item.allMetadataValues ? item.allMetadataValues(key) : [];
          if (values.length > 0) {
            htmlContent += `<tr><th>${key}</th><td>${values.join(' || ')}</td></tr>`;
          }
        });

        htmlContent += `
              </tbody>
            </table>
          </div>
        `;
      });

      // 5. Adiciona o script que dispara o Print automaticamente
      htmlContent += `
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      // 6. Abre a nova aba e injeta o documento para o navegador processar
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close(); // Essencial para disparar o window.onload
      } else {
        // Fallback caso o navegador bloqueie pop-ups
        alert('Por favor, permita a abertura de pop-ups neste site para gerar o arquivo PDF.');
      }

    } catch (error) {
      console.error('Erro na exportação para PDF no Front-end:', error);
    } finally {
      // Desativa o spinner independente de sucesso ou erro
      this.isExportingPdf = false;
    }
  }
}
