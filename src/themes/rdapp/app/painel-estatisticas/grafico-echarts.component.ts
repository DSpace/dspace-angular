import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import {
  BarChart,
  HeatmapChart,
  LineChart,
  TreemapChart,
} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import {
  type EChartsType,
  init,
  use,
} from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

// Registro unico dos modulos ECharts usados pelo painel (entry modular,
// tree-shaking). O entry classico 'echarts' expoe tipos com "export =",
// rejeitado pelo tsconfig do projeto (module es2020 sem skipLibCheck).
use([
  BarChart,
  LineChart,
  HeatmapChart,
  TreemapChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

/**
 * Wrapper de apresentacao para um grafico ECharts.
 * Recebe a opcao pronta por @Input e cuida sozinho do ciclo de vida: cria a
 * instancia, aplica setOption, redimensiona (via ResizeObserver, o que cobre
 * resize de janela e troca de aba) e descarta. Emite a instancia em (pronto)
 * para casos que precisam do objeto, como o cruzamento do heatmap.
 * A altura vem da classe CSS aplicada ao elemento no template do pai (ex: .grafico).
 */
@Component({
  selector: 'ds-grafico-echarts',
  template: '',
  styles: [':host { display: block; width: 100%; }'],
})
export class GraficoEchartsComponent implements OnChanges, OnDestroy {

  @Input() opcao: any = null;
  @Output() pronto = new EventEmitter<EChartsType>();

  private chart: EChartsType | null = null;
  private ro?: ResizeObserver;
  private readonly isBrowser: boolean;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(): void {
    if (!this.isBrowser) { return; }
    if (this.opcao == null) {
      this.destruir();
      return;
    }
    if (!this.chart) {
      this.chart = init(this.el.nativeElement);
      this.observarResize();
      this.pronto.emit(this.chart);
    }
    // notMerge = true: substitui a opcao por inteiro, evitando series antigas
    // quando os dados encolhem apos um filtro.
    this.chart.setOption(this.opcao, true);
  }

  ngOnDestroy(): void { this.destruir(); }

  private observarResize(): void {
    if (typeof ResizeObserver === 'undefined') { return; }
    this.ro = new ResizeObserver(() => this.chart?.resize());
    this.ro.observe(this.el.nativeElement);
  }

  private destruir(): void {
    this.ro?.disconnect();
    this.ro = undefined;
    this.chart?.dispose();
    this.chart = null;
  }
}
