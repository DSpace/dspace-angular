import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';

import {
  activeFilterChips,
  API_LIMITS,
  clearFilter,
  DEFAULT_FILTERS,
  FilterChip,
  filtersAreDefault,
  IngestionFilters,
  IngestionSort,
} from '../ingestion-filters';
import {
  JOB_STATUSES,
  STAGES,
} from '../ingestion-stages';

/** Espera antes de aplicar a busca textual. */
const SEARCH_DEBOUNCE_MS = 300;

/**
 * Barra de busca, filtros e ordenação das três listas. Os mesmos controles valem
 * para todas as seções, com os mesmos rótulos e comportamento. Os filtros ativos
 * aparecem como chips removíveis individualmente, além do "limpar tudo".
 */
@Component({
  selector: 'ds-ingestion-filters',
  templateUrl: './ingestion-filters.component.html',
  styleUrls: ['./ingestion-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
  ],
})
export class IngestionFiltersComponent {

  readonly filters = input.required<IngestionFilters>();
  /** Limite pedido à API (conjunto de trabalho). */
  readonly limit = input.required<number>();

  readonly filtersChange = output<IngestionFilters>();
  readonly limitChange = output<number>();

  readonly statuses = JOB_STATUSES;
  readonly stages = STAGES;
  readonly limits = API_LIMITS;
  readonly sorts: IngestionSort[] = ['recent', 'oldest'];

  readonly chips = computed<FilterChip[]>(() => activeFilterChips(this.filters()));
  readonly isDefault = computed(() => filtersAreDefault(this.filters()));

  private readonly searchBox = viewChild<ElementRef<HTMLInputElement>>('searchBox');
  private readonly query$ = new Subject<string>();
  /** Enquanto o usuário digita, o campo não é reescrito pelo estado externo. */
  private typing = false;

  constructor() {
    this.query$.pipe(
      debounceTime(SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe((q: string) => {
      this.typing = false;
      this.emit({ ...this.filters(), q });
    });

    // Reflete limpezas vindas de fora (chips, "limpar filtros" da seção, URL)
    // sem atropelar o que está sendo digitado.
    effect(() => {
      const q = this.filters().q;
      const box = this.searchBox()?.nativeElement;
      if (box && !this.typing && box.value !== q) {
        box.value = q;
      }
    });
  }

  onSearchInput(event: Event): void {
    this.typing = true;
    this.query$.next((event.target as HTMLInputElement).value);
  }

  /** Enter aplica a busca na hora, sem esperar o debounce. */
  onSubmit(event: Event): void {
    event.preventDefault();
    this.typing = false;
    this.emit({ ...this.filters(), q: this.searchBox()?.nativeElement.value ?? '' });
  }

  onStatusChange(event: Event): void {
    this.emit({ ...this.filters(), status: (event.target as HTMLSelectElement).value });
  }

  onStageChange(event: Event): void {
    this.emit({ ...this.filters(), stage: (event.target as HTMLSelectElement).value });
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.emit({ ...this.filters(), sort: value === 'oldest' ? 'oldest' : 'recent' });
  }

  onLimitChange(event: Event): void {
    const value = Number.parseInt((event.target as HTMLSelectElement).value, 10);
    if (!Number.isNaN(value)) {
      this.limitChange.emit(value);
    }
  }

  removeChip(chip: FilterChip): void {
    this.emit(clearFilter(this.filters(), chip.key));
  }

  clearAll(): void {
    this.typing = false;
    this.emit({ ...DEFAULT_FILTERS });
  }

  /** Chave i18n do rótulo do filtro (usada no aria-label do chip). */
  chipLabelKey(chip: FilterChip): string {
    return `health-page.ingestion.filters.${chip.key}.label`;
  }

  private emit(filters: IngestionFilters): void {
    this.filtersChange.emit(filters);
  }
}
