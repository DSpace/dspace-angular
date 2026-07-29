import {
  DecimalPipe,
  isPlatformBrowser,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { EChartsType } from 'echarts/core';
import { forkJoin } from 'rxjs';

import {
  FiltrosSidebarComponent,
  GrupoFiltro,
  OpcaoFiltro,
} from './filtros-sidebar.component';
import { GraficoEchartsComponent } from './grafico-echarts.component';
import { NuvemPalavrasComponent } from './nuvem-palavras.component';
import {
  FacetValue,
  PainelEstatisticasService,
} from './painel-estatisticas.service';

interface SerieEvolucao { nome: string; dados: number[]; }

const CORES_ODS: { [n: number]: string } = {
  1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
  6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
  11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
  16: '#00689D', 17: '#19486A', 18: '#8b5cf6',
};

// Nomes oficiais dos ODS (inclui o 18 - Igualdade Etnico-Racial, adotado no Brasil).
// Usados como fallback quando o ODS nao aparece nos dados (barra zerada).
const NOMES_ODS: { [n: number]: string } = {
  1: 'Erradicação da Pobreza', 2: 'Fome Zero e Agricultura Sustentável',
  3: 'Saúde e Bem-Estar', 4: 'Educação de Qualidade', 5: 'Igualdade de Gênero',
  6: 'Água Potável e Saneamento', 7: 'Energia Limpa e Acessível',
  8: 'Trabalho Decente e Crescimento Econômico', 9: 'Indústria, Inovação e Infraestrutura',
  10: 'Redução das Desigualdades', 11: 'Cidades e Comunidades Sustentáveis',
  12: 'Consumo e Produção Responsáveis', 13: 'Ação Contra a Mudança Global do Clima',
  14: 'Vida na Água', 15: 'Vida Terrestre', 16: 'Paz, Justiça e Instituições Eficazes',
  17: 'Parcerias e Meios de Implementação', 18: 'Igualdade Étnico-Racial',
};

// Escala do heatmap da HU: vermelho (baixo) -> laranja -> amarelo -> verde (alto).
const ESCALA_HEATMAP = ['#d80000', '#f07800', '#f2c200', '#8bc34a', '#1a9850'];
// Paleta para as linhas da evolucao.
const CORES_LINHAS = ['#1f4ea3', '#0a97d9', '#1aa179', '#f0a500', '#a21942', '#6f42c1', '#fd6925'];

@Component({
  selector: 'ds-painel-estatisticas',
  templateUrl: './painel-estatisticas.component.html',
  styleUrls: ['./painel-estatisticas.component.scss'],
  imports: [
    DecimalPipe,
    FiltrosSidebarComponent,
    GraficoEchartsComponent,
    NuvemPalavrasComponent,
    RouterLink,
  ],
  providers: [PainelEstatisticasService],
})
export class PainelEstatisticasComponent implements OnInit {

  private isBrowser: boolean;

  loading = true;
  recarregando = false;
  erro: string | null = null;
  aba: 'acervo' | 'visualizacoes' = 'acervo';

  grupos: GrupoFiltro[] = [];
  selecionados: { [nome: string]: Set<string> } = {};

  totalAvaliacoes = 0;
  totalInstituicoes = 0;

  ods: FacetValue[] = [];
  odsNaoInformado = 0;
  areaTematica: FacetValue[] = [];
  instituicao: FacetValue[] = [];
  tipoDocumento: FacetValue[] = [];
  abrangencia: FacetValue[] = [];
  politicaPublica: FacetValue[] = [];
  palavrasChave: FacetValue[] = [];

  anos: string[] = [];
  evolucaoSeries: SerieEvolucao[] = [];
  matrizDocs: string[] = [];
  matrizAvals: string[] = [];
  matrizData: number[][] = [];
  matrizMax = 0;

  // Opcoes ECharts calculadas apos cada carga; ligadas aos <ds-grafico-echarts>.
  opcaoOdsVM: any = null;
  opcaoAreaVM: any = null;
  opcaoInstVM: any = null;
  opcaoAbrVM: any = null;
  opcaoTipoVM: any = null;
  opcaoAnoVM: any = null;
  opcaoMatrizVM: any = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private stats: PainelEstatisticasService,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) { return; }
    this.carregar();
  }

  // ---- Filtros -----------------------------------------------------------

  toggleFiltro(nome: string, valor: string): void {
    const conj = this.selecionados[nome] ?? new Set<string>();
    if (conj.has(valor)) {
      conj.delete(valor);
    } else {
      conj.add(valor);
    }
    this.selecionados[nome] = conj;
    this.recarregar();
  }
  limparFiltros(): void {
    Object.keys(this.selecionados).forEach((k) => this.selecionados[k].clear());
    this.recarregar();
  }
  private recarregar(): void { this.recarregando = true; this.carregar(); }

  private paramsFiltro(excluir?: string): string {
    let p = '';
    Object.keys(this.selecionados).forEach((nome) => {
      if (nome === excluir || this.selecionados[nome].size === 0) { return; }
      if (nome === 'dateIssued') {
        const anos = [...this.selecionados[nome]].sort();
        const intervalo = `[${anos[0]} TO ${anos[anos.length - 1]}]`;
        p += `&f.dateIssued=${encodeURIComponent(intervalo)},equals`;
      } else {
        this.selecionados[nome].forEach((valor) => {
          p += `&f.${nome}=${encodeURIComponent(valor)},equals`;
        });
      }
    });
    return p;
  }

  // ---- Carregamento ------------------------------------------------------

  private carregar(): void {
    forkJoin({
      total: this.stats.fetchTotalItens(this.paramsFiltro()),
      totalOds: this.stats.fetchTotalItens(this.paramsFiltro('ods')),
      comOds: this.stats.fetchComOds(this.paramsFiltro('ods')),
      ods: this.stats.fetchFacet('ods', this.paramsFiltro('ods')),
      areaTematica: this.stats.fetchFacet('areaTematica', this.paramsFiltro('areaTematica')),
      instituicao: this.stats.fetchFacet('instituicao', this.paramsFiltro('instituicao')),
      tipoDocumento: this.stats.fetchFacet('tipoDocumento', this.paramsFiltro('tipoDocumento')),
      abrangencia: this.stats.fetchFacet('abrangencia', this.paramsFiltro('abrangencia')),
      politicaPublica: this.stats.fetchFacet('politicaPublica', this.paramsFiltro('politicaPublica')),
      itens: this.stats.fetchItens(this.paramsFiltro()),
      itensAno: this.stats.fetchItens(this.paramsFiltro('dateIssued')),
    }).subscribe({
      next: (r) => {
        this.totalAvaliacoes = r.total;
        this.ods = r.ods;
        // Avaliacoes sem nenhum ODS (Nao Informado). Calculado no servidor:
        // total no mesmo escopo do facet (sem o filtro de ODS) menos as que
        // tem ao menos um ODS. Independe do teto de paginacao de fetchItens.
        this.odsNaoInformado = Math.max(0, r.totalOds - r.comOds);
        this.areaTematica = r.areaTematica;
        this.instituicao = r.instituicao;
        this.tipoDocumento = r.tipoDocumento;
        this.abrangencia = r.abrangencia;
        this.politicaPublica = r.politicaPublica;
        this.totalInstituicoes = r.instituicao.length;

        this.agregarEvolucao(r.itens);
        this.agregarMatriz(r.itens);
        this.agregarPalavras(r.itens);
        this.construirOpcoes(r);

        this.recomputarGraficos();
        this.loading = false;
        this.recarregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Nao foi possivel carregar os indicadores. Verifique se o backend esta no ar em ' + this.stats.apiBase;
        this.loading = false;
        this.recarregando = false;
      },
    });
  }

  private construirOpcoes(r: any): void {
    const anoOpcoes: OpcaoFiltro[] = this.contarAnos(r.itensAno ?? [])
      .map((a) => ({ rotulo: a.ano, valor: a.ano, count: a.count }))
      .reverse();

    this.grupos = [
      { nome: 'dateIssued', titulo: 'Ano de Publicação', opcoes: anoOpcoes },
      { nome: 'tipoDocumento', titulo: 'Tipo de Documento', opcoes: this.paraOpcoes(r.tipoDocumento) },
      { nome: 'politicaPublica', titulo: 'Política Pública', opcoes: this.paraOpcoes(r.politicaPublica) },
      { nome: 'areaTematica', titulo: 'Área Temática', opcoes: this.paraOpcoes(r.areaTematica) },
      { nome: 'instituicao', titulo: 'Instituição', opcoes: this.paraOpcoes(r.instituicao) },
      { nome: 'abrangencia', titulo: 'Abrangência Territorial', opcoes: this.paraOpcoes(r.abrangencia) },
      { nome: 'ods', titulo: 'ODS', opcoes: this.paraOpcoes(r.ods) },
    ];
    this.grupos.forEach((g) => {
      if (!this.selecionados[g.nome]) { this.selecionados[g.nome] = new Set<string>(); }
    });
  }

  private paraOpcoes(dados: FacetValue[]): OpcaoFiltro[] {
    return dados.map((v) => ({ rotulo: v.label, valor: v.label, count: v.count }));
  }

  private contarAnos(itens: any[]): { ano: string; count: number }[] {
    const porAno: { [ano: string]: number } = {};
    itens.forEach((it) => {
      (it?.metadata?.['dc.date.issued'] ?? []).forEach((v: any) => {
        const ano = (v?.value ?? '').substring(0, 4);
        if (/^\d{4}$/.test(ano)) { porAno[ano] = (porAno[ano] || 0) + 1; }
      });
    });
    return Object.keys(porAno).sort().map((ano) => ({ ano, count: porAno[ano] }));
  }

  // ---- Render ------------------------------------------------------------

  trocarAba(aba: 'acervo' | 'visualizacoes'): void {
    this.aba = aba;
  }

  private recomputarGraficos(): void {
    this.opcaoOdsVM = this.opcaoOds();
    this.opcaoAreaVM = this.opcaoBarras(this.areaTematica, '#2f6fd1');
    this.opcaoInstVM = this.opcaoTreemap(this.instituicao);
    this.opcaoAbrVM = this.opcaoBarras(this.abrangencia, '#f0a500');
    this.opcaoTipoVM = this.opcaoBarras(this.tipoDocumento, '#1f4ea3');
    this.opcaoAnoVM = this.opcaoLinhaTempo();
    this.opcaoMatrizVM = this.opcaoMatriz();
  }

  // ---- Agregacoes --------------------------------------------------------

  /** Evolucao por ano, uma serie (linha) por instituicao. */
  private agregarEvolucao(itens: any[]): void {
    const porInst: { [inst: string]: { [ano: string]: number } } = {};
    const totalInst: { [inst: string]: number } = {};
    const anosSet = new Set<string>();

    itens.forEach((it) => {
      const anos = (it?.metadata?.['dc.date.issued'] ?? [])
        .map((v: any) => (v?.value ?? '').substring(0, 4))
        .filter((a: string) => /^\d{4}$/.test(a));
      if (!anos.length) { return; }
      const ano = anos[0];
      anosSet.add(ano);
      const insts = (it?.metadata?.['local.instituicao'] ?? []).map((v: any) => v.value);
      (insts.length ? insts : ['Não informado']).forEach((inst: string) => {
        porInst[inst] = porInst[inst] || {};
        porInst[inst][ano] = (porInst[inst][ano] || 0) + 1;
        totalInst[inst] = (totalInst[inst] || 0) + 1;
      });
    });

    this.anos = [...anosSet].sort();
    const insts = Object.keys(totalInst).sort((a, b) => totalInst[b] - totalInst[a]);
    this.evolucaoSeries = insts.map((inst) => ({
      nome: inst,
      dados: this.anos.map((a) => porInst[inst][a] || 0),
    }));
  }

  /** Matriz Tipo de Documento x Tipo de Avaliacao, eixos ordenados por total. */
  private agregarMatriz(itens: any[]): void {
    const pares: { [k: string]: number } = {};
    const totalDoc: { [d: string]: number } = {};
    const totalAval: { [a: string]: number } = {};
    itens.forEach((it) => {
      const td = (it?.metadata?.['local.tipodocumento'] ?? []).map((v: any) => v.value);
      const ta = (it?.metadata?.['local.tipoavaliacao'] ?? []).map((v: any) => v.value);
      td.forEach((d: string) => ta.forEach((a: string) => {
        pares[`${d}||${a}`] = (pares[`${d}||${a}`] || 0) + 1;
        totalDoc[d] = (totalDoc[d] || 0) + 1;
        totalAval[a] = (totalAval[a] || 0) + 1;
      }));
    });
    // Documentos de maior total no TOPO (Y ascendente: maior no fim do array = topo).
    // Avaliacoes de maior total a ESQUERDA (X descendente: maior no inicio = esquerda).
    // Resultado: as celulas mais quentes se concentram no canto superior ESQUERDO.
    this.matrizDocs = Object.keys(totalDoc).sort((a, b) => totalDoc[a] - totalDoc[b]);
    this.matrizAvals = Object.keys(totalAval).sort((a, b) => totalAval[b] - totalAval[a]);
    this.matrizData = [];
    this.matrizMax = 0;
    this.matrizDocs.forEach((d, y) => {
      this.matrizAvals.forEach((a, x) => {
        const v = pares[`${d}||${a}`] || 0;
        this.matrizMax = Math.max(this.matrizMax, v);
        this.matrizData.push([x, y, v]);
      });
    });
  }

  /** Nuvem por FREQUENCIA: conta dc.subject nos itens e pega os mais frequentes. */
  private agregarPalavras(itens: any[]): void {
    const cont: { [t: string]: number } = {};
    itens.forEach((it) => {
      (it?.metadata?.['dc.subject'] ?? []).forEach((v: any) => {
        const t = (v?.value ?? '').trim();
        if (t) { cont[t] = (cont[t] || 0) + 1; }
      });
    });
    this.palavrasChave = Object.keys(cont)
      .map((t) => ({ label: t, count: cont[t] } as FacetValue))
      .sort((a, b) => b.count - a.count)
      .slice(0, 40);
  }

  /** Sigla curta de uma instituicao ("... - CMAP" -> "CMAP"). */
  private sigla(nome: string): string {
    const partes = nome.split(' - ');
    return partes.length > 1 ? partes[partes.length - 1] : nome;
  }

  // ---- Opcoes de cada grafico -------------------------------------------

  private opcaoOds(): any {
    if (!this.totalAvaliacoes) { return null; }
    const dados = this.odsCompleto;
    return {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const o = dados[params[0].dataIndex];
          return `${o.label}<br/><b>${o.count}</b> avaliações`;
        },
      },
      grid: { left: 40, right: 16, top: 16, bottom: 40 },
      xAxis: { type: 'category', data: dados.map((o) => (o.ni ? 'N/I' : String(o.num))), axisLabel: { interval: 0 } },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: dados.map((o) => ({ value: o.count, name: o.label, itemStyle: { color: o.cor } })),
      }],
    };
  }

  private opcaoBarras(dados: FacetValue[], cor: string): any {
    if (!dados.length) { return null; }
    const invertido = [...dados].reverse();
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 8, right: 24, top: 8, bottom: 8, containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: invertido.map((v) => v.label), axisLabel: { width: 220, overflow: 'truncate' } },
      series: [{
        type: 'bar',
        data: invertido.map((v) => v.count),
        itemStyle: { color: cor, borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right' },
      }],
    };
  }

  private opcaoTreemap(dados: FacetValue[]): any {
    if (!dados.length) { return null; }
    return {
      tooltip: { formatter: (info: any) => `${info.name}<br/>${info.value} avaliações` },
      series: [{
        type: 'treemap', roam: false, breadcrumb: { show: false },
        label: { show: true, formatter: '{b}\n{c}' },
        data: dados.map((v) => ({ name: v.label, value: v.count })),
      }],
    };
  }

  /** Linha do tempo: uma linha por instituicao (ordem cronologica no eixo X). */
  private opcaoLinhaTempo(): any {
    if (!this.anos.length) { return null; }
    return {
      tooltip: { trigger: 'axis' },
      legend: { type: 'scroll', top: 0, textStyle: { fontSize: 11 } },
      grid: { left: 8, right: 24, top: 44, bottom: 8, containLabel: true },
      xAxis: { type: 'category', data: this.anos, boundaryGap: false },
      yAxis: { type: 'value' },
      series: this.evolucaoSeries.map((s, i) => ({
        name: this.sigla(s.nome),
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: s.dados,
        lineStyle: { width: 2, color: CORES_LINHAS[i % CORES_LINHAS.length] },
        itemStyle: { color: CORES_LINHAS[i % CORES_LINHAS.length] },
      })),
    };
  }

  /** Heatmap em tons de uma unica cor, eixos ja ordenados por quantidade. */
  private opcaoMatriz(): any {
    if (!this.matrizData.length) { return null; }
    return {
      // showContent:false esconde o balao mas mantem o ponteiro, que rotula em cada
      // eixo o documento e a avaliacao da celula. transitionDuration:0 remove a
      // transicao de movimento da etiqueta, que era a real origem da piscada.
      tooltip: { trigger: 'item', showContent: false, transitionDuration: 0 },
      axisPointer: { animation: false },
      grid: { left: 8, right: 64, top: 8, bottom: 40, containLabel: true },
      xAxis: {
        type: 'category', data: this.matrizAvals, splitArea: { show: false },
        axisPointer: { show: true, type: 'line', label: { show: true, margin: 4 }, animation: false, triggerEmphasis: false, lineStyle: { width: 0, opacity: 0 } },
        axisLabel: { interval: 0, fontSize: 11, formatter: (_v: string, i: number) => String(i + 1) },
      },
      yAxis: {
        type: 'category', data: this.matrizDocs, splitArea: { show: false },
        axisPointer: { show: true, type: 'line', label: { show: true, margin: 4 }, animation: false, triggerEmphasis: false, lineStyle: { width: 0, opacity: 0 } },
        axisLabel: { width: 200, overflow: 'break' },
      },
      // Escala na lateral direita, vertical e sem alcas arrastaveis, para nao encostar no eixo X.
      visualMap: {
        min: 0, max: this.matrizMax || 1, calculable: false,
        orient: 'vertical', right: 8, top: 'center', itemWidth: 12, itemHeight: 150,
        text: [String(this.matrizMax || 1), '0'], textStyle: { fontSize: 11, color: '#6c757d' },
        inRange: { color: ESCALA_HEATMAP },
      },
      series: [{
        // Todas as celulas sao exibidas, inclusive as zeradas. Como 0 e o menor valor,
        // caem na ponta vermelha da escala, como na matriz totalmente preenchida da HU.
        type: 'heatmap',
        data: this.matrizData,
        label: { show: true, fontSize: 11 },
        stateAnimation: { duration: 0 },
        emphasis: { focus: 'none', itemStyle: { borderColor: '#102a54', borderWidth: 2 } },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
      }],
    };
  }

  /**
   * Ao passar o mouse numa celula, destaca a LINHA e a COLUNA inteiras (a cruz de
   * celulas que liga aos eixos), usando dispatchAction (leve, sem redesenhar).
   */
  ligarCruzMatriz(chart: EChartsType): void {
    const larg = this.matrizAvals.length;
    const alt = this.matrizDocs.length;
    chart.on('mouseover', (p: any) => {
      if (p.componentType !== 'series' || !Array.isArray(p.data)) { return; }
      const hx = p.data[0];
      const hy = p.data[1];
      const indices: number[] = [];
      for (let x = 0; x < larg; x++) { indices.push(hy * larg + x); }
      for (let y = 0; y < alt; y++) { if (y !== hy) { indices.push(y * larg + hx); } }
      chart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
      chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: indices });
    });
    chart.on('globalout', () => {
      chart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
    });
  }

  private numeroOds(label: string): number {
    const m = label.match(/^\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  /** Legenda do heatmap: numero do eixo X -> nome completo da avaliacao. */
  get legendaMatriz(): { num: number; nome: string }[] {
    return this.matrizAvals.map((a, i) => ({ num: i + 1, nome: a }));
  }

  /**
   * ODS completo para o grafico e a legenda: faixa fixa de 1 a 18 (zero nos ausentes,
   * com o nome oficial de fallback) mais a coluna "Nao Informado" ao final.
   */
  get odsCompleto(): { num: number; label: string; count: number; cor: string; ni: boolean }[] {
    const porNum: { [n: number]: FacetValue } = {};
    this.ods.forEach((v) => { porNum[this.numeroOds(v.label)] = v; });
    const arr: { num: number; label: string; count: number; cor: string; ni: boolean }[] = [];
    for (let n = 1; n <= 18; n++) {
      const fv = porNum[n];
      arr.push({
        num: n,
        label: fv ? fv.label : `${n} - ${NOMES_ODS[n] ?? 'ODS ' + n}`,
        count: fv ? fv.count : 0,
        cor: CORES_ODS[n] ?? '#999999',
        ni: false,
      });
    }
    arr.push({ num: 19, label: 'Não Informado', count: this.odsNaoInformado, cor: '#9aa5b1', ni: true });
    return arr;
  }

  /** Legenda dos ODS: 1 a 18 mais "Nao Informado", cada um com sua cor. */
  get legendaOds(): { num: number; label: string; cor: string }[] {
    return this.odsCompleto.map((o) => ({ num: o.num, label: o.label, cor: o.cor }));
  }
}
