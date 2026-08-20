import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import {
  IngestionJob,
  statusBadgeClass,
  statusLabelKey,
} from '../ingestion-stages';
import { IngestionStepperComponent } from '../stepper/ingestion-stepper.component';

/**
 * Card de um job em andamento. Mostra o mínimo necessário — situação, arquivo,
 * estágio e o momento da última mudança — com uma única ação destacada (abrir o
 * item). O identificador completo fica acessível pelo `title`, sem esticar o card.
 */
@Component({
  selector: 'ds-ingestion-job-card',
  templateUrl: './ingestion-job-card.component.html',
  styleUrls: ['./ingestion-job-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    IngestionStepperComponent,
    RouterLink,
    TranslatePipe,
  ],
})
export class IngestionJobCardComponent {

  readonly job = input.required<IngestionJob>();

  readonly badgeClass = computed(() => statusBadgeClass(this.job().status));
  readonly statusKey = computed(() => statusLabelKey(this.job().status));
  readonly title = computed(() => this.job().filename ?? this.job().job_id);
}
