import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FlowStepView } from '../pipeline-status.view';
import { PipelineValueComponent } from '../value/pipeline-value.component';

/**
 * Fluxo do pipeline: DSpace → MinerU → MinIO → BGE-M3 → Qdrant → Busca.
 * Lista ordenada de verdade (`<ol>`), com conectores em CSS — horizontal a partir
 * do desktop, vertical no celular. Cada etapa carrega o estado e uma métrica.
 */
@Component({
  selector: 'ds-pipeline-flow',
  templateUrl: './pipeline-flow.component.html',
  styleUrls: ['./pipeline-flow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PipelineValueComponent,
    TranslatePipe,
  ],
})
export class PipelineFlowComponent {

  readonly steps = input.required<FlowStepView[]>();
}
