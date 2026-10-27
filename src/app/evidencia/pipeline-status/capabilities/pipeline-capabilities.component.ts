import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CapabilityView } from '../pipeline-status.view';

/**
 * Capacidades da plataforma como cartões pequenos: o que dá para fazer agora.
 * Cada cartão diz o estado por ícone e por texto, e lista as dependências que
 * bloqueiam a capacidade quando ela está indisponível.
 */
@Component({
  selector: 'ds-pipeline-capabilities',
  templateUrl: './pipeline-capabilities.component.html',
  styleUrls: ['./pipeline-capabilities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
  ],
})
export class PipelineCapabilitiesComponent {

  readonly capabilities = input.required<CapabilityView[]>();
}
