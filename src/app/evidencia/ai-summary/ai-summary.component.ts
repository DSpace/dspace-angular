import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import {
  of,
  Subject,
} from 'rxjs';
import {
  catchError,
  switchMap,
  tap,
} from 'rxjs/operators';

import {
  AiCitation,
  AiSource,
  AiSummaryBlock,
  AiSummaryResponse,
  blocksToPlainText,
  groupCitationsBySource,
  parseMarkdownBlocks,
} from './ai-summary.model';
import {
  AiSummaryDocument,
  AiSummaryError,
  AiSummaryMode,
  AiSummaryParams,
  AiSummaryService,
  subjectKey,
  toAiSummaryError,
} from './ai-summary.service';
import {
  AI_SUMMARY_STORAGE_KEYS,
  readStored,
  writeStored,
} from './ai-summary.storage';
import {
  aiSummaryErrorKey,
  I18N,
  isRetryable,
  isUnavailable,
} from './ai-summary.view';
import { AiSummaryPdfService } from './ai-summary-pdf.service';

/** Uma seção já pronta para o template, com o Markdown convertido em blocos. */
/** Resultado da última cópia; volta a `idle` sozinho depois de um instante. */
export type AiCopyState = 'idle' | 'copied' | 'failed';

/** Quanto tempo o botão mostra "Copiado" antes de voltar ao rótulo normal. */
const COPY_FEEDBACK_MS = 2000;

/**
 * Chaves de filtro que a API declara ter usado mas que não mostramos na lista
 * "Filtros aplicados". `roles` é um recorte interno da recuperação, não uma
 * escolha do usuário, então polui o contexto sem informar nada. Comparadas em
 * minúsculas e sem espaços.
 */
const AI_SUMMARY_HIDDEN_FILTER_KEYS = new Set<string>(['roles']);

/** O modo guardado, se for um dos que existem; senão o resumo geral. */
function readStoredMode(): AiSummaryMode {
  const stored = readStored<string>(AI_SUMMARY_STORAGE_KEYS.mode);
  return stored === 'by_section' ? 'by_section' : 'basic';
}

interface SectionView {
  key: string;
  title: string;
  blocks: AiSummaryBlock[];
}

/**
 * Painel de síntese por IA da busca.
 *
 * Sintetiza as evidências recuperadas para a consulta atual, com as citações
 * ligadas ao trecho que as sustenta. Dois modos: resumo geral e por seção do
 * relatório.
 *
 * Com documentos marcados na lista de resultados (`documents`), a síntese se
 * restringe a eles; sem seleção, fala da busca inteira.
 *
 * **A chamada só sai quando a aba está aberta** (`active`). Cada síntese custa uma
 * inferência de LLM e uma recuperação no Qdrant, que disputa a mesma GPU do
 * pipeline de ingestão — gerar isso a cada busca sairia caro sem ninguém ter
 * pedido. Alternar de aba e voltar também não refaz a chamada: o serviço guarda a
 * resposta por consulta+filtros+modo+idioma.
 */
@Component({
  selector: 'ds-ai-summary',
  templateUrl: './ai-summary.component.html',
  styleUrls: ['./ai-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbPopover,
    NgTemplateOutlet,
    TranslatePipe,
  ],
})
export class AiSummaryComponent {

  /** Consulta atual da busca. Vazia = nada a sintetizar. */
  readonly query = input('');
  /** Modo de recuperação da busca (`lexical`/`semantic`/`hybrid`). */
  readonly searchType = input('');
  /** Filtros facetados aplicados, no formato que a API espera. */
  readonly filters = input<Record<string, string>>({});
  /**
   * Documentos marcados na lista de resultados. Vazio = síntese sobre a busca
   * inteira; com seleção, a síntese fala só dos documentos escolhidos.
   */
  readonly documents = input<AiSummaryDocument[]>([]);
  /** A aba está aberta? É o gatilho do carregamento. */
  readonly active = input(false);

  /** Prefixo i18n exposto ao template. */
  readonly i18n = I18N;

  private readonly service = inject(AiSummaryService);

  /**
   * Modo escolhido. Sobrevive ao F5: a resposta guardada é por modo, e voltar
   * sempre ao geral pediria uma síntese nova a quem estava lendo a por seção.
   */
  readonly mode = signal<AiSummaryMode>(readStoredMode());
  readonly data = signal<AiSummaryResponse | null>(null);
  readonly error = signal<AiSummaryError | null>(null);
  readonly loading = signal(false);

  private readonly pdf = inject(AiSummaryPdfService);
  private readonly translate = inject(TranslateService);
  private readonly load$ = new Subject<AiSummaryParams>();
  /** Assunto da última síntese pedida, para saber quando a tela precisa esvaziar. */
  private lastSubject: string | null = null;

  /** Carregando sem nada na tela. */
  readonly firstLoad = computed(() => this.loading() && this.data() === null);
  /**
   * Recarregando com a síntese anterior ainda na tela — é o que acontece ao
   * trocar de modo. O aviso é uma linha a mais, não a troca do painel por um
   * spinner: quem estava lendo continua lendo.
   */
  readonly refreshing = computed(() => this.loading() && this.data() !== null);
  /** Falhou e não há síntese anterior para mostrar. */
  readonly blankError = computed(() => this.error() !== null && this.data() === null);
  /** A API respondeu, mas não havia evidência suficiente. */
  readonly empty = computed(() => {
    const data = this.data();
    return data !== null && data.summary.trim() === '' && data.sections.length === 0;
  });

  /**
   * Quantos documentos a seleção restringe. Zero = síntese da busca inteira; o
   * cabeçalho do painel diz qual dos dois está sendo lido, senão a mesma consulta
   * devolve dois textos diferentes sem explicação visível.
   */
  readonly documentCount = computed(() => this.documents().length);

  /** Teto de documentos que a API aceita numa síntese por seleção. */
  readonly maxDocuments = this.service.maxDocuments;

  /**
   * A seleção passou do teto da API?
   *
   * O 422 que viria daí é fatal (sem "tentar de novo") e a mensagem dele não diz
   * o que fazer. Avisar antes custa uma comparação e poupa a viagem.
   */
  readonly tooManyDocuments = computed(() => this.documentCount() > this.maxDocuments);

  /**
   * Chave da linha de escopo. Duas, porque `ngx-translate` não faz plural: com um
   * documento marcado a frase no plural sairia errada em todas as três línguas.
   */
  readonly scopeKey = computed(() => this.documentCount() === 1
    ? `${I18N}.scope.selected-one`
    : `${I18N}.scope.selected-many`);

  readonly errorKey = computed(() => aiSummaryErrorKey(this.error()));
  readonly canRetry = computed(() => isRetryable(this.error()));
  /** O endpoint não existe nesta instalação: quem hospeda a aba deve escondê-la. */
  readonly unavailable = computed(() => isUnavailable(this.error()));

  readonly citations = computed<AiCitation[]>(() => this.data()?.citations ?? []);
  /**
   * As fontes agrupadas por documento: a API numera trechos, e o mesmo relatório
   * costuma responder por várias citações.
   */
  readonly sources = computed<AiSource[]>(() => groupCitationsBySource(this.citations()));
  readonly filtersUsed = computed(() => (this.data()?.filtersUsed ?? [])
    .filter((filter) => !AI_SUMMARY_HIDDEN_FILTER_KEYS.has(filter.key.trim().toLowerCase())));
  readonly evidenceCount = computed(() => this.data()?.evidenceCount ?? 0);

  /** Texto do resumo geral, convertido do Markdown da API em blocos. */
  readonly blocks = computed<AiSummaryBlock[]>(() => {
    const data = this.data();
    return data === null ? [] : parseMarkdownBlocks(data.summary, data.citations);
  });

  /** Seções do modo "por seção", cada uma com o próprio texto quebrado. */
  readonly sections = computed<SectionView[]>(() => {
    const data = this.data();
    if (data === null) {
      return [];
    }
    return data.sections.map((section) => ({
      key: section.key,
      title: section.title,
      blocks: parseMarkdownBlocks(section.summary, data.citations),
    }));
  });

  /**
   * A síntese vai ser desenhada em seções?
   *
   * Pedir `mode=by_section` **não garante** seções de volta: a API publicada hoje
   * responde esse modo com o texto em `summary` e `sections` vazio. Desenhar a
   * grade só porque o modo está selecionado punha na tela um painel em branco
   * entre a contagem de evidências e as fontes — o pior estado possível, que
   * parece ter carregado e não ter nada. O modo escolhe a grade; o que chegou
   * decide se ela tem o que mostrar.
   */
  readonly sectioned = computed(() => this.mode() === 'by_section' && this.sections().length > 0);

  /**
   * O que o botão "Copiar" põe na área de transferência: exatamente o texto que
   * está na tela — as seções com o título na frente, quando é a grade que aparece.
   */
  readonly plainText = computed(() => this.sectioned()
    ? this.sections()
      .map((section: SectionView) => `${section.title}\n\n${blocksToPlainText(section.blocks)}`)
      .join('\n\n')
    : blocksToPlainText(this.blocks()));

  readonly copyState = signal<AiCopyState>('idle');
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.copyTimer !== null) {
        clearTimeout(this.copyTimer);
      }
    });

    this.load$.pipe(
      tap((params: AiSummaryParams) => {
        const subject = subjectKey(params);
        if (subject !== this.lastSubject) {
          // Outra consulta: a síntese anterior deixa de valer e sai da tela, em
          // vez de ficar sob um cabeçalho que já mudou. Trocar só de modo não
          // esvazia nada — a síntese fica até a nova chegar (ver `refreshing`),
          // senão o painel cai de mil pixels para cem e a página salta debaixo
          // de quem estava lendo.
          this.data.set(null);
          this.lastSubject = subject;
        }
        this.loading.set(true);
        this.error.set(null);
      }),
      // switchMap: trocar de modo enquanto uma síntese está em voo descarta a
      // anterior, para uma resposta atrasada não sobrescrever a mais recente.
      switchMap((params: AiSummaryParams) => this.service.summarize(params).pipe(
        tap((response: AiSummaryResponse) => {
          this.data.set(response);
          this.error.set(null);
        }),
        catchError((err: unknown) => {
          this.error.set(toAiSummaryError(err));
          this.data.set(null);
          return of(null);
        }),
      )),
      tap(() => this.loading.set(false)),
      takeUntilDestroyed(),
    ).subscribe();

    // Carrega quando a aba abre e sempre que consulta, filtros ou modo mudarem —
    // mas nunca com a aba fechada.
    effect(() => {
      const params = this.params();
      if (this.active() && params !== null) {
        this.load$.next(params);
      }
    });
  }

  setMode(mode: AiSummaryMode): void {
    this.mode.set(mode);
    writeStored(AI_SUMMARY_STORAGE_KEYS.mode, mode);
  }

  /** Descarta o que está em cache e refaz a síntese. */
  retry(): void {
    const params = this.params();
    if (params === null) {
      return;
    }
    this.service.forget(params);
    this.load$.next(params);
  }

  /**
   * Copia a síntese como texto puro. O retorno fica no próprio botão — "Copiado"
   * ou "Não foi possível copiar" — e some sozinho: um toast para isso seria mais
   * barulho que o gesto merece.
   */
  copy(): Promise<void> {
    const done = (state: AiCopyState): void => {
      this.copyState.set(state);
      if (this.copyTimer !== null) {
        clearTimeout(this.copyTimer);
      }
      this.copyTimer = setTimeout(() => this.copyState.set('idle'), COPY_FEEDBACK_MS);
    };
    // `navigator.clipboard` só existe em contexto seguro (HTTPS/localhost) e no navegador.
    const clipboard = typeof navigator === 'undefined' ? undefined : navigator.clipboard;
    if (clipboard === undefined) {
      done('failed');
      return Promise.resolve();
    }
    return clipboard.writeText(this.plainText()).then(() => done('copied'), () => done('failed'));
  }

  /** A citação de número `n`; `null` quando o texto cita algo que não veio. */
  citation(n: number | undefined): AiCitation | null {
    return this.citations().find((entry: AiCitation) => entry.n === n) ?? null;
  }

  /**
   * Abre a evidência da citação: o PDF de origem na página citada, do mesmo jeito
   * que o botão de página do `ds-document-more-results`.
   */
  openEvidence(citation: AiCitation): void {
    this.pdf.open(citation);
  }

  /**
   * Nível ARIA de um título do Markdown. `#`/`##` ficam em `base` e o resto um
   * degrau abaixo — a mesma escala de dois passos do SCSS, para que o leitor de
   * tela ouça a hierarquia que a tela mostra. Nunca passa de 6.
   */
  headingLevel(base: number, level: number | undefined): number {
    return Math.min(6, base + ((level ?? 2) <= 2 ? 0 : 1));
  }

  /** Há documento para abrir? Governa a exibição do botão de página. */
  canOpen(citation: AiCitation): boolean {
    return this.pdf.canOpen(citation);
  }

  /**
   * Rótulo do botão da citação: "Página N" quando se sabe a página — o mesmo que
   * o `ds-document-more-results` mostra —, senão só o convite a abrir o documento.
   */
  pageLabel(citation: AiCitation): string {
    return citation.page === null ? `${I18N}.citation.open-item` : `${I18N}.citation.page-link`;
  }

  /**
   * Parâmetros da síntese atual; `null` quando não há consulta — buscar sem termo
   * não tem o que sintetizar.
   */
  private params(): AiSummaryParams | null {
    const query = this.query().trim();
    if (query === '' || this.tooManyDocuments()) {
      return null;
    }
    return {
      query,
      searchType: this.searchType(),
      mode: this.mode(),
      language: this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'pt-BR',
      filters: this.filters(),
      documents: this.documents(),
    };
  }
}
