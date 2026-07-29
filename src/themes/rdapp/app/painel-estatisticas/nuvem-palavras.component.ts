import {
  isPlatformBrowser,
  NgStyle,
} from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

import { FacetValue } from './painel-estatisticas.service';

interface TermoNuvem { label: string; count: number; estilo: { [k: string]: string }; }

/**
 * Nuvem de palavras-chave em orbitas: a mais frequente no centro, maior e mais
 * escura; as demais em espiral, com fonte e cor conforme a frequencia. Recebe a
 * lista ja agregada por @Input e cuida do proprio layout e redimensionamento
 * (ResizeObserver, o que cobre resize de janela e troca de aba).
 */
@Component({
  selector: 'ds-nuvem-palavras',
  imports: [
    NgStyle,
  ],
  templateUrl: './nuvem-palavras.component.html',
  styleUrls: ['./nuvem-palavras.component.scss'],
})
export class NuvemPalavrasComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() palavras: FacetValue[] = [];

  nuvem: TermoNuvem[] = [];
  nuvemGen = 0;
  dica = { visivel: false, x: 0, y: 0, nome: '', count: 0 };

  @ViewChild('nuvemBox') nuvemBox?: ElementRef<HTMLDivElement>;

  private ro?: ResizeObserver;
  private viewPronta = false;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  trackNuvem = (i: number): string => `${this.nuvemGen}:${i}`;

  ngAfterViewInit(): void {
    this.viewPronta = true;
    this.montarNuvem(true);
    if (this.isBrowser && typeof ResizeObserver !== 'undefined' && this.nuvemBox) {
      // Resize (janela ou troca de aba): reposiciona sem reanimar, evita piscada.
      this.ro = new ResizeObserver(() => this.montarNuvem(false));
      this.ro.observe(this.nuvemBox.nativeElement);
    }
  }

  ngOnChanges(): void {
    // Nova lista de palavras: refaz com animacao, se a view ja existe.
    if (this.viewPronta) { this.montarNuvem(true); }
  }

  ngOnDestroy(): void { this.ro?.disconnect(); }

  // ---- Tooltip (segue o cursor) ------------------------------------------
  mostrarDica(ev: MouseEvent, p: { label: string; count: number }): void {
    this.dica.nome = p.label;
    this.dica.count = p.count;
    this.dica.visivel = true;
    this.moverDica(ev);
  }
  moverDica(ev: MouseEvent): void {
    const r = this.nuvemBox?.nativeElement.getBoundingClientRect();
    if (!r) { return; }
    this.dica.x = ev.clientX - r.left + 12;
    this.dica.y = ev.clientY - r.top - 12;
  }
  esconderDica(): void { this.dica.visivel = false; }

  private montarNuvem(animar = true): void {
    if (!this.isBrowser) { return; }
    const box = this.nuvemBox?.nativeElement;
    const ws = this.palavras.slice(0, 28);
    if (!box || !ws.length) { this.nuvem = []; return; }

    const larguraCaixa = box.clientWidth || 800;
    const alturaCaixa = 440;
    const maxC = ws[0].count;
    const minC = ws[ws.length - 1].count;
    const span = Math.max(1, maxC - minC);
    const remDe = (c: number) => 0.9 + ((c - minC) / span) * 1.95;
    const paleta = ['#28408b', '#00a88f', '#0f49bd', '#1e6f90', '#7a5cc0', '#2f8f7f', '#c26b3e'];

    const ctx = document.createElement('canvas').getContext('2d');
    const colocadas: { x: number; y: number; w: number; h: number }[] = [];
    const brutas: { label: string; count: number; x: number; y: number; rem: number; cor: string; peso: number; idx: number }[] = [];
    const colide = (x: number, y: number, w: number, h: number) =>
      colocadas.some((p) => Math.abs(x - p.x) < (w + p.w) / 2 + 6 && Math.abs(y - p.y) < (h + p.h) / 2 + 4);

    ws.forEach((word, idx) => {
      const rem = remDe(word.count);
      const fpx = rem * 16;
      const peso = idx === 0 ? 800 : 600;
      if (ctx) { ctx.font = `${peso} ${fpx}px rawline, Arial, sans-serif`; }
      const w = ctx ? ctx.measureText(word.label).width : word.label.length * fpx * 0.55;
      const h = fpx * 1.15;

      // Espiral de Arquimedes a partir do centro (alongada na horizontal): primeira
      // posicao livre, garantindo que nada se sobreponha.
      let achou = false;
      let x = 0;
      let y = 0;
      for (let t = 0; t < 160; t += 0.22) {
        const r = 5 * t;
        x = Math.cos(t) * r * 1.7;
        y = Math.sin(t) * r;
        if (Math.abs(x) + w / 2 > larguraCaixa / 2 - 8) { continue; }
        if (Math.abs(y) + h / 2 > alturaCaixa / 2 - 8) { continue; }
        if (!colide(x, y, w, h)) { achou = true; break; }
      }
      if (!achou) { return; }

      colocadas.push({ x, y, w, h });
      brutas.push({ label: word.label, count: word.count, x, y, rem, cor: paleta[idx % paleta.length], peso, idx });
    });

    // Incrementa a geracao apenas quando queremos reanimar (filtro/carga).
    // No resize, mantemos a geracao para os elementos serem reaproveitados
    // e apenas reposicionados, sem reiniciar a animacao (evita a piscada).
    if (animar) { this.nuvemGen++; }
    this.nuvem = brutas.map((b) => ({
      label: b.label, count: b.count,
      estilo: {
        left: `calc(50% + ${b.x.toFixed(0)}px)`,
        top: `calc(50% + ${b.y.toFixed(0)}px)`,
        transform: 'translate(-50%, -50%)',
        fontSize: `${b.rem.toFixed(2)}rem`,
        color: b.cor,
        fontWeight: `${b.peso}`,
        zIndex: `${100 - b.idx}`,
        animationDelay: `${(b.idx * 0.05).toFixed(3)}s`,
      },
    }));
  }
}
