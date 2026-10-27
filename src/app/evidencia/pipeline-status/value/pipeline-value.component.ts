import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MetricValue } from '../pipeline-status.view';

/**
 * Renderiza um valor de métrica: número formatado no locale da aplicação com a
 * unidade certa, palavra traduzida (sim/não, disponível) ou valor cru preservado
 * (nome de modelo, coleção). Concentra a formatação num lugar só, então nenhum
 * template do painel repete essa lógica — e um objeto nunca cai na tela como
 * `[object Object]`.
 */
@Component({
  selector: 'ds-pipeline-value',
  templateUrl: './pipeline-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
  ],
})
export class PipelineValueComponent {

  readonly value = input.required<MetricValue>();

  /** Formatação numérica no locale ativo (separadores de milhar e decimal). */
  private readonly decimal = new DecimalPipe(inject(LOCALE_ID));

  readonly formatted = computed(() => this.format(this.value()));

  private format(value: MetricValue): string {
    const num = value.num;
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      return '—';
    }
    switch (value.kind) {
      case 'int':
        return this.decimal.transform(num, '1.0-0');
      case 'decimal':
        return this.decimal.transform(num, '1.0-2');
      case 'percent':
        return `${this.decimal.transform(num, '1.0-1')}%`;
      case 'bytes':
        return this.formatBytes(num);
      case 'megabytes':
        return num >= 1024
          ? `${this.decimal.transform(num / 1024, '1.0-1')} GB`
          : `${this.decimal.transform(num, '1.0-1')} MB`;
      case 'ms':
        return num >= 1000
          ? `${this.decimal.transform(num / 1000, '1.0-1')} s`
          : `${this.decimal.transform(num, '1.0-0')} ms`;
      case 'seconds':
        return this.formatSeconds(num);
      case 'celsius':
        return `${this.decimal.transform(num, '1.0-0')} °C`;
      default:
        return this.decimal.transform(num, '1.0-2');
    }
  }

  private formatBytes(num: number): string {
    const gigabyte = 1024 ** 3;
    const megabyte = 1024 ** 2;
    if (num >= gigabyte) {
      return `${this.decimal.transform(num / gigabyte, '1.0-2')} GB`;
    }
    if (num >= megabyte) {
      return `${this.decimal.transform(num / megabyte, '1.0-1')} MB`;
    }
    if (num >= 1024) {
      return `${this.decimal.transform(num / 1024, '1.0-0')} kB`;
    }
    return `${this.decimal.transform(num, '1.0-0')} B`;
  }

  private formatSeconds(num: number): string {
    if (num < 60) {
      return `${this.decimal.transform(num, '1.0-0')} s`;
    }
    if (num < 3600) {
      return `${this.decimal.transform(num / 60, '1.0-0')} min`;
    }
    if (num < 86400) {
      return `${this.decimal.transform(num / 3600, '1.0-1')} h`;
    }
    return `${this.decimal.transform(num / 86400, '1.0-1')} d`;
  }
}
