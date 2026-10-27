import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { componentIcon } from '../pipeline-status.presenter';
import { ComponentView } from '../pipeline-status.view';
import { PipelineValueComponent } from '../value/pipeline-value.component';

/**
 * Cartão de um componente da infraestrutura. Fechado mostra o essencial (nome,
 * papel, estado, mensagem, latência, até três métricas e as barras que fizerem
 * sentido); "Ver detalhes" abre o resto do `detail` em listas de chave e valor —
 * nunca um objeto cru na tela.
 */
@Component({
  selector: 'ds-pipeline-component-card',
  templateUrl: './pipeline-component-card.component.html',
  styleUrls: ['./pipeline-component-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PipelineValueComponent,
    TranslatePipe,
  ],
})
export class PipelineComponentCardComponent {

  readonly component = input.required<ComponentView>();

  readonly expanded = signal(false);

  readonly icon = computed(() => componentIcon(this.component().key));
  readonly hasDetail = computed(() => {
    const detail = this.component().detail;
    return detail.rows.length > 0 || detail.groups.length > 0;
  });

  toggle(): void {
    this.expanded.update((open: boolean) => !open);
  }
}
