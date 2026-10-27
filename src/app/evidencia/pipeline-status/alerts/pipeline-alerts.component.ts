import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AlertView } from '../pipeline-status.view';

/**
 * Área de alertas. Só aparece quando há algo a dizer: impedimentos, avisos,
 * componentes degradados/indisponíveis, jobs com falha, filas sem worker e
 * opcionais não configurados — estes últimos como informação, não como erro.
 */
@Component({
  selector: 'ds-pipeline-alerts',
  templateUrl: './pipeline-alerts.component.html',
  styleUrls: ['./pipeline-alerts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
  ],
})
export class PipelineAlertsComponent {

  readonly alerts = input.required<AlertView[]>();

  /** Ícone por severidade; o texto sempre acompanha. */
  icon(alert: AlertView): string {
    switch (alert.severity) {
      case 'danger':
        return 'fa-times-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      default:
        return 'fa-info-circle';
    }
  }
}
