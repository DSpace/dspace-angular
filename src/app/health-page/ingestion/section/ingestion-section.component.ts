import {
  DatePipe,
  isPlatformBrowser,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
} from '@angular/core';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';

import { prefersReducedMotion } from '../ingestion-motion';
import {
  hasData,
  isBusy,
  SectionState,
} from '../ingestion-state';

/** Faixa exibida acima do conteúdo quando algo saiu do normal. */
type SectionBanner = 'error' | 'partial' | 'unavailable' | null;

/** Selo do cabeçalho: é o que se vê quando o painel está recolhido. */
type HeaderBadge = 'busy' | 'error' | 'unavailable' | 'stale' | 'count' | null;

/**
 * Painel colapsável de uma seção da aba de ingestão (accordion do ng-bootstrap).
 * Cuida de todos os estados previstos para a fonte de dados — carregamento inicial,
 * atualização, sucesso com conteúdo, resultado vazio, sem correspondência de
 * filtros, erro, dados parciais, indisponível e tentativa de reconexão — e projeta
 * o conteúdo apenas quando há o que mostrar.
 *
 * Recolhido, o cabeçalho continua dizendo o essencial (total, erro, desatualizado):
 * um problema nunca fica escondido atrás do painel fechado.
 */
@Component({
  selector: 'ds-ingestion-section',
  templateUrl: './ingestion-section.component.html',
  styleUrls: ['./ingestion-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    TranslatePipe,
  ],
})
export class IngestionSectionComponent {

  /** Identificador estável da seção (ids de acessibilidade e do painel). */
  readonly sectionId = input.required<string>();
  readonly headingKey = input.required<string>();
  readonly state = input.required<SectionState<unknown>>();
  /** Total informado pela API (selo do cabeçalho). */
  readonly count = input<number | null>(null);
  /** Mensagem de "nenhum registro" própria da seção. */
  readonly emptyKey = input.required<string>();
  /** Itens restantes após os filtros; `null` quando a seção não filtra. */
  readonly visibleCount = input<number | null>(null);
  readonly hasActiveFilters = input(false);
  /** Painel recolhido. O pai é o dono deste estado (ele vai para a URL). */
  readonly collapsed = input(true);

  /** Abriu (`true`) ou recolheu (`false`) — só em mudança real de estado. */
  readonly openChange = output<boolean>();
  readonly retry = output<void>();
  readonly clearFilters = output<void>();

  /** Animação do accordion desligada quando o sistema pede menos movimento. */
  readonly animated = !prefersReducedMotion(isPlatformBrowser(inject(PLATFORM_ID)));

  readonly busy = computed(() => isBusy(this.state()));
  readonly showSkeleton = computed(() => {
    const status = this.state().status;
    return status === 'idle' || status === 'loading';
  });
  readonly showEmpty = computed(() => this.state().status === 'empty');
  readonly showNoMatch = computed(() => {
    const state = this.state();
    return hasData(state) && state.status !== 'empty' && this.visibleCount() === 0;
  });
  readonly showBody = computed(() =>
    hasData(this.state()) && !this.showEmpty() && !this.showNoMatch(),
  );
  readonly banner = computed<SectionBanner>(() => {
    switch (this.state().status) {
      case 'error':
        return 'error';
      case 'partial':
        return 'partial';
      case 'unavailable':
        return 'unavailable';
      default:
        return null;
    }
  });

  readonly badge = computed<HeaderBadge>(() => {
    const state = this.state();
    if (isBusy(state)) {
      return 'busy';
    }
    switch (state.status) {
      case 'error':
        return 'error';
      case 'unavailable':
        return 'unavailable';
      case 'partial':
        return 'stale';
      default:
        return this.count() === null ? null : 'count';
    }
  });
}
