import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../host';
import { HeaderView } from '../pipeline-status.view';
import { PipelineValueComponent } from '../value/pipeline-value.component';

/**
 * Cabeçalho de saúde geral: estado da plataforma, contagem por estado, quando foi
 * a última verificação (e há quanto tempo), quanto a consulta levou e o botão de
 * atualizar.
 */
@Component({
  selector: 'ds-pipeline-health-header',
  templateUrl: './pipeline-health-header.component.html',
  styleUrls: ['./pipeline-health-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BtnDisabledDirective,
    DatePipe,
    PipelineValueComponent,
    TranslatePipe,
  ],
})
export class PipelineHealthHeaderComponent {

  readonly header = input.required<HeaderView>();
  /** Uma atualização está em andamento (spinner no botão). */
  readonly refreshing = input(false);

  readonly refresh = output<void>();
}
