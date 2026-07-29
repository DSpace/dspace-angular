import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface OpcaoFiltro { rotulo: string; valor: string; count: number; }
export interface GrupoFiltro { nome: string; titulo: string; opcoes: OpcaoFiltro[]; }

/**
 * Barra lateral de filtros (apresentacao). Recebe os grupos e a selecao atual
 * por @Input e emite intencao de alterar/limpar por @Output. O estado de dados
 * (selecionados) e a montagem da query continuam no componente pai; aqui vive
 * apenas o estado visual: qual grupo esta aberto e o texto de busca por grupo.
 */
@Component({
  selector: 'ds-filtros-sidebar',
  imports: [
    FormsModule,
  ],
  templateUrl: './filtros-sidebar.component.html',
  styleUrls: ['./filtros-sidebar.component.scss'],
})
export class FiltrosSidebarComponent implements OnChanges {

  @Input() grupos: GrupoFiltro[] = [];
  @Input() selecionados: { [nome: string]: Set<string> } = {};

  @Output() alternarFiltro = new EventEmitter<{ nome: string; valor: string }>();
  @Output() limpar = new EventEmitter<void>();

  // Estado apenas visual (nao afeta os dados).
  abertos: { [nome: string]: boolean } = {};
  buscaOpcao: { [nome: string]: string } = {};

  ngOnChanges(): void {
    this.grupos.forEach((g) => {
      if (this.abertos[g.nome] === undefined) { this.abertos[g.nome] = false; }
      if (this.buscaOpcao[g.nome] === undefined) { this.buscaOpcao[g.nome] = ''; }
    });
  }

  toggleGrupo(nome: string): void { this.abertos[nome] = !this.abertos[nome]; }

  estaSelecionado(nome: string, valor: string): boolean {
    return this.selecionados[nome]?.has(valor) ?? false;
  }

  totalFiltros(): number {
    return Object.values(this.selecionados).reduce((t, s) => t + s.size, 0);
  }

  opcoesVisiveis(g: GrupoFiltro): OpcaoFiltro[] {
    const termo = (this.buscaOpcao[g.nome] ?? '').toLowerCase().trim();
    return termo ? g.opcoes.filter((o) => o.rotulo.toLowerCase().includes(termo)) : g.opcoes;
  }
}
