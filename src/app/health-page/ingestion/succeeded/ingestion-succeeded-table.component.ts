import {
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { SucceededJob } from '../ingestion.service';

/**
 * Tabela dos jobs concluídos. Carregada sob demanda (`@defer`) porque é uma
 * informação secundária: a seção de jobs em andamento é o conteúdo principal.
 */
@Component({
  selector: 'ds-ingestion-succeeded-table',
  templateUrl: './ingestion-succeeded-table.component.html',
  styleUrls: ['./ingestion-succeeded-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslatePipe,
  ],
})
export class IngestionSucceededTableComponent {

  readonly rows = input.required<SucceededJob[]>();
}
