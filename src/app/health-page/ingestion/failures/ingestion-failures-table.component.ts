import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FailedJob } from '../ingestion.service';
import { ReprocessState } from '../ingestion-reprocess';

/**
 * Tabela das falhas, com reprocessamento por linha. O reprocessamento re-enfileira
 * o job de verdade, então exige confirmação (não há como desfazer). A confirmação
 * é local à tabela; a chamada em si fica com o componente pai.
 */
@Component({
  selector: 'ds-ingestion-failures-table',
  templateUrl: './ingestion-failures-table.component.html',
  styleUrls: ['./ingestion-failures-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    TranslatePipe,
  ],
})
export class IngestionFailuresTableComponent {

  readonly rows = input.required<FailedJob[]>();
  /** Fase do reprocessamento por `job_id`, mantida pelo pai. */
  readonly states = input<Record<string, ReprocessState>>({});

  readonly reprocess = output<string>();

  /** Linha aguardando confirmação. */
  readonly pendingConfirm = signal<string | null>(null);

  state(jobId: string): ReprocessState {
    return this.states()[jobId] ?? { phase: 'idle' };
  }

  errorText(job: FailedJob): string {
    return typeof job.error === 'string' ? job.error : '';
  }

  askConfirm(jobId: string): void {
    this.pendingConfirm.set(jobId);
  }

  cancelConfirm(): void {
    this.pendingConfirm.set(null);
  }

  confirm(jobId: string): void {
    this.pendingConfirm.set(null);
    this.reprocess.emit(jobId);
  }
}
