import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import {
  Page,
  PAGE_SIZES,
} from '../ingestion-filters';

/**
 * Rodapé de paginação de uma lista. Paginação por página inteira mantém a
 * quantidade de nós renderizados baixa (máximo de 50), sem precisar virtualizar.
 */
@Component({
  selector: 'ds-ingestion-pagination',
  templateUrl: './ingestion-pagination.component.html',
  styleUrls: ['./ingestion-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BtnDisabledDirective,
    TranslatePipe,
  ],
})
export class IngestionPaginationComponent {

  readonly page = input.required<Page<unknown>>();
  /** Sufixo dos ids/labels, para vários paginadores na mesma tela. */
  readonly sectionId = input.required<string>();
  /** Total devolvido pela API antes dos filtros (para avisar do recorte). */
  readonly fetched = input<number | null>(null);
  /** Limite pedido à API: se `fetched` o alcançou, há registros fora do recorte. */
  readonly limit = input<number | null>(null);

  readonly pageChange = output<number>();
  readonly sizeChange = output<number>();

  readonly sizes = PAGE_SIZES;
  readonly isFirst = computed(() => this.page().page <= 1);
  readonly isLast = computed(() => this.page().page >= this.page().totalPages);
  readonly truncated = computed(() => {
    const fetched = this.fetched();
    const limit = this.limit();
    return fetched !== null && limit !== null && fetched >= limit;
  });

  go(page: number): void {
    this.pageChange.emit(page);
  }

  onSizeChange(event: Event): void {
    const size = Number.parseInt((event.target as HTMLSelectElement).value, 10);
    if (!Number.isNaN(size)) {
      this.sizeChange.emit(size);
    }
  }
}
