import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ConfigGroupView } from '../pipeline-status.view';
import { PipelineValueComponent } from '../value/pipeline-value.component';

/**
 * Configuração técnica em seção recolhível: versão do pipeline, embedding,
 * extração, chunking, busca, serviço e tempo de atividade. Rótulos formatados
 * para leitura; valores (modelos, coleções, estratégias) preservados como vêm.
 */
@Component({
  selector: 'ds-pipeline-config',
  templateUrl: './pipeline-config.component.html',
  styleUrls: ['./pipeline-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PipelineValueComponent,
    TranslatePipe,
  ],
})
export class PipelineConfigComponent {

  readonly groups = input.required<ConfigGroupView[]>();

  readonly expanded = signal(false);

  toggle(): void {
    this.expanded.update((open: boolean) => !open);
  }
}
