import {
  activeFilterChips,
  applyFilters,
  clearFilter,
  DEFAULT_FILTERS,
  filtersAreDefault,
  filtersFromParams,
  filtersToParams,
  IngestionFilters,
  intFromParam,
  paginate,
} from './ingestion-filters';
import { IngestionJob } from './ingestion-stages';

const JOBS: IngestionJob[] = [
  { job_id: 'a', status: 'processando', stage: 'mineru', filename: 'tese.pdf', updated_at: '2026-08-10T10:00:00Z' },
  { job_id: 'b', status: 'na_fila', filename: 'ata.pdf', updated_at: '2026-08-11T10:00:00Z' },
  { job_id: 'c', status: 'erro', stage: 'llm', filename: 'edital.pdf', error: 'timeout no LLM', updated_at: '2026-08-09T10:00:00Z' },
  { job_id: 'd', status: 'concluido', filename: 'relatorio.pdf', item_uuid: 'uuid-1' },
];

function filters(overrides: Partial<IngestionFilters> = {}): IngestionFilters {
  return { ...DEFAULT_FILTERS, ...overrides };
}

describe('ingestion-filters', () => {

  describe('busca textual', () => {
    it('encontra por nome de arquivo, id, item e mensagem de erro', () => {
      expect(applyFilters(JOBS, filters({ q: 'tese' })).map((j) => j.job_id)).toEqual(['a']);
      expect(applyFilters(JOBS, filters({ q: 'uuid-1' })).map((j) => j.job_id)).toEqual(['d']);
      expect(applyFilters(JOBS, filters({ q: 'timeout' })).map((j) => j.job_id)).toEqual(['c']);
      expect(applyFilters(JOBS, filters({ q: 'B' })).map((j) => j.job_id)).toEqual(['b']);
    });

    it('devolve lista vazia quando nada corresponde', () => {
      expect(applyFilters(JOBS, filters({ q: 'inexistente' }))).toEqual([]);
    });
  });

  describe('filtros de situação e estágio', () => {
    it('filtra por situação normalizada', () => {
      expect(applyFilters(JOBS, filters({ status: 'erro' })).map((j) => j.job_id)).toEqual(['c']);
    });

    it('filtra por estágio', () => {
      expect(applyFilters(JOBS, filters({ stage: 'mineru' })).map((j) => j.job_id)).toEqual(['a']);
    });

    it('combina busca e filtros', () => {
      expect(applyFilters(JOBS, filters({ q: 'pdf', status: 'na_fila' })).map((j) => j.job_id)).toEqual(['b']);
    });
  });

  describe('ordenação', () => {
    it('ordena do mais recente para o mais antigo por padrão', () => {
      expect(applyFilters(JOBS, filters()).map((j) => j.job_id)).toEqual(['b', 'a', 'c', 'd']);
    });

    it('inverte a ordem quando pedido', () => {
      expect(applyFilters(JOBS, filters({ sort: 'oldest' })).map((j) => j.job_id)).toEqual(['d', 'c', 'a', 'b']);
    });

    it('não muta a lista original', () => {
      const original = JOBS.map((j) => j.job_id);
      applyFilters(JOBS, filters({ sort: 'oldest' }));

      expect(JOBS.map((j) => j.job_id)).toEqual(original);
    });
  });

  describe('paginação', () => {
    const items = Array.from({ length: 23 }, (_, i: number) => i + 1);

    it('recorta a página pedida e informa a faixa', () => {
      const page = paginate(items, 2, 10);

      expect(page.items).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
      expect(page.from).toBe(11);
      expect(page.to).toBe(20);
      expect(page.totalPages).toBe(3);
    });

    it('corrige a página quando o conjunto encolhe', () => {
      const page = paginate(items.slice(0, 5), 3, 10);

      expect(page.page).toBe(1);
      expect(page.items.length).toBe(5);
    });

    it('lida com lista vazia', () => {
      const page = paginate([], 1, 10);

      expect(page.total).toBe(0);
      expect(page.from).toBe(0);
      expect(page.to).toBe(0);
      expect(page.totalPages).toBe(1);
    });
  });

  describe('chips de filtros ativos', () => {
    it('não gera chip com os valores padrão', () => {
      expect(activeFilterChips(filters())).toEqual([]);
      expect(filtersAreDefault(filters())).toBeTrue();
    });

    it('gera um chip por filtro ativo', () => {
      const chips = activeFilterChips(filters({ q: 'tese', status: 'erro', sort: 'oldest' }));

      expect(chips.map((c) => c.key)).toEqual(['q', 'status', 'sort']);
      expect(chips[0].translated).toBeFalse();
      expect(chips[1].translated).toBeTrue();
    });

    it('limpa um filtro sem afetar os demais', () => {
      const cleared = clearFilter(filters({ q: 'tese', status: 'erro' }), 'status');

      expect(cleared.status).toBe('');
      expect(cleared.q).toBe('tese');
    });
  });

  describe('estado na URL', () => {
    it('faz round-trip dos filtros', () => {
      const original = filters({ q: 'tese', status: 'erro', stage: 'llm', sort: 'oldest' });

      expect(filtersFromParams(filtersToParams(original))).toEqual(original);
    });

    it('omite os valores padrão da URL', () => {
      expect(filtersToParams(filters())).toEqual({ q: null, status: null, stage: null, sort: null });
    });

    it('descarta valores inválidos', () => {
      const parsed = filtersFromParams({ status: 'inventado', stage: 'inventado', sort: 'inventado' });

      expect(parsed).toEqual(DEFAULT_FILTERS);
    });

    it('lê inteiros com valor padrão e lista de permitidos', () => {
      expect(intFromParam({ size: '25' }, 'size', 10, [10, 25, 50])).toBe(25);
      expect(intFromParam({ size: '7' }, 'size', 10, [10, 25, 50])).toBe(10);
      expect(intFromParam({}, 'pa', 1)).toBe(1);
      expect(intFromParam({ pa: '-3' }, 'pa', 1)).toBe(1);
    });
  });
});
