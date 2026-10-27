import {
  AiCitation,
  AiSummaryChunk,
  blocksToPlainText,
  groupCitationsBySource,
  isAiSummaryPayload,
  normalizeAiSummary,
  parseInline,
  parseMarkdownBlocks,
  splitCitations,
  tidyCitationPunctuation,
} from './ai-summary.model';

describe('ai-summary.model', () => {

  describe('isAiSummaryPayload', () => {

    it('aceita corpo com resumo geral', () => {
      expect(isAiSummaryPayload({ summary: 'texto' })).toBeTrue();
    });

    it('aceita corpo com seções', () => {
      expect(isAiSummaryPayload({ sections: [] })).toBeTrue();
    });

    it('aceita o corpo publicado da API, que traz `mappings`', () => {
      expect(isAiSummaryPayload({ mappings: [], retrieval: {} })).toBeTrue();
    });

    it('recusa corpo que não é síntese', () => {
      expect(isAiSummaryPayload('<html>erro do proxy</html>')).toBeFalse();
      expect(isAiSummaryPayload(null)).toBeFalse();
      expect(isAiSummaryPayload({ detail: 'Not Found' })).toBeFalse();
    });
  });

  describe('normalizeAiSummary', () => {

    it('lê o snake_case da API', () => {
      const result = normalizeAiSummary({
        summary: 'Principais evidências [1]',
        citations: [{ n: 1, section: '5.1', page: 138, snippet: 'trecho', item_uuid: 'uuid-1', item_handle: '123456789/160' }],
        filters_used: { year: '2024' },
        evidence_count: 10,
      });

      expect(result.summary).toBe('Principais evidências [1]');
      expect(result.evidenceCount).toBe(10);
      expect(result.filtersUsed).toEqual([{ key: 'year', value: '2024' }]);
      expect(result.citations[0].itemUuid).toBe('uuid-1');
      expect(result.citations[0].itemHandle).toBe('123456789/160');
    });

    it('lê o corpo publicado da API (`mappings`/`applied_filters`/`retrieval`)', () => {
      const result = normalizeAiSummary({
        query: 'agricultura',
        language: 'pt-BR',
        applied_filters: {},
        retrieval: { type: 'hybrid', fusion: 'rrf', top: 3, evidence_count: 3 },
        summary: 'Segundo o Censo 2017 [1]',
        mappings: [{
          index: 1,
          chunk_id: '9d674252',
          document_id: '2022_CMAS_Política de Desoneração do Biodiesel',
          dspace_uuid: '890a4efc-d249-46a1-89f4-9220ccb049df',
          item_handle: '123456789/91',
          section: '4.1.2 Inclusão social',
          page: 31,
          score: 0.5333,
          snippet: 'De acordo com o Censo 2017…',
        }],
      });

      expect(result.citations.length).toBe(1);
      expect(result.citations[0].n).toBe(1);
      expect(result.citations[0].title).toBe('2022_CMAS_Política de Desoneração do Biodiesel');
      expect(result.citations[0].itemUuid).toBe('890a4efc-d249-46a1-89f4-9220ccb049df');
      expect(result.citations[0].itemHandle).toBe('123456789/91');
      expect(result.citations[0].page).toBe(31);
      // `evidence_count` mora dentro de `retrieval`, não na raiz.
      expect(result.evidenceCount).toBe(3);
      expect(result.filtersUsed).toEqual([]);
    });

    it('numera as citações pela posição quando a API não manda `n`', () => {
      const result = normalizeAiSummary({
        summary: 'x',
        citations: [{ section: 'a' }, { section: 'b' }],
      });

      expect(result.citations.map((c: AiCitation) => c.n)).toEqual([1, 2]);
    });

    it('usa o total de citações quando não há evidence_count', () => {
      const result = normalizeAiSummary({ summary: 'x', citations: [{ section: 'a' }] });

      expect(result.evidenceCount).toBe(1);
    });

    it('aceita filtros como lista, além de objeto', () => {
      const result = normalizeAiSummary({
        summary: 'x',
        filters_used: [{ key: 'ods', value: '4' }, { key: 'vazio', value: '' }],
      });

      expect(result.filtersUsed).toEqual([{ key: 'ods', value: '4' }]);
    });

    it('junta filtro de múltiplos valores numa string só', () => {
      const result = normalizeAiSummary({ summary: 'x', filters_used: { criteria: ['eficiência', 'eficácia'] } });

      expect(result.filtersUsed).toEqual([{ key: 'criteria', value: 'eficiência, eficácia' }]);
    });

    it('descarta seção sem texto', () => {
      const result = normalizeAiSummary({
        sections: [{ key: 'results', title: 'Resultados', summary: 'texto' }, { key: 'vazia', summary: '' }],
      });

      expect(result.sections.length).toBe(1);
      expect(result.sections[0].key).toBe('results');
    });

    it('não estoura com corpo vazio', () => {
      const result = normalizeAiSummary({});

      expect(result).toEqual({ summary: '', sections: [], citations: [], filtersUsed: [], evidenceCount: 0 });
    });
  });

  describe('groupCitationsBySource', () => {

    function cite(n: number, over: Partial<AiCitation> = {}): AiCitation {
      return { n, section: '', page: n, snippet: '', title: 'Relatório', itemUuid: 'uuid-1', itemHandle: null, ...over };
    }

    it('junta num documento só as citações que vieram dele', () => {
      const sources = groupCitationsBySource([cite(1), cite(2), cite(3, { itemUuid: 'uuid-2', title: 'Outro' })]);

      expect(sources.length).toBe(2);
      expect(sources[0].name).toBe('Relatório');
      expect(sources[0].citations.map((c: AiCitation) => c.n)).toEqual([1, 2]);
      expect(sources[1].citations.map((c: AiCitation) => c.n)).toEqual([3]);
    });

    it('agrupa pelo handle quando não há UUID', () => {
      const sources = groupCitationsBySource([
        cite(1, { itemUuid: null, itemHandle: '123456789/91' }),
        cite(2, { itemUuid: null, itemHandle: '123456789/91' }),
      ]);

      expect(sources.length).toBe(1);
    });

    it('não junta documentos distintos sem origem conhecida', () => {
      const sources = groupCitationsBySource([
        cite(1, { itemUuid: null, itemHandle: null, title: 'A' }),
        cite(2, { itemUuid: null, itemHandle: null, title: 'B' }),
      ]);

      expect(sources.map((source) => source.name)).toEqual(['A', 'B']);
    });

    it('adota o nome que aparecer, ainda que só o segundo trecho o traga', () => {
      const sources = groupCitationsBySource([
        cite(1, { title: null, section: '' }),
        cite(2, { title: 'Relatório 2022' }),
      ]);

      expect(sources[0].name).toBe('Relatório 2022');
    });

    it('não estoura sem citação nenhuma', () => {
      expect(groupCitationsBySource([])).toEqual([]);
    });
  });

  describe('parseMarkdownBlocks', () => {

    const citations: AiCitation[] = [
      { n: 1, section: 'a', page: 1, snippet: '', title: null, itemUuid: null, itemHandle: null },
    ];

    it('converte o Markdown que a síntese realmente devolve', () => {
      const blocks = parseMarkdownBlocks(
        'A seguir, uma síntese.\n\n**Agricultura familiar**\n- Censo 2017 [1]\n- Norte e Nordeste [1]',
        citations,
      );

      expect(blocks.map((block) => block.kind)).toEqual(['paragraph', 'paragraph', 'list']);
      // O título vem em negrito, sem `#`: vira um parágrafo com um trecho forte.
      expect(blocks[1].chunks).toEqual([{ kind: 'strong', text: 'Agricultura familiar' }]);
      expect(blocks[2].ordered).toBeFalse();
      expect(blocks[2].items.length).toBe(2);
      expect(blocks[2].items[0].some((chunk) => chunk.kind === 'citation')).toBeTrue();
    });

    it('lê título com `#` e guarda o nível', () => {
      const blocks = parseMarkdownBlocks('### Resultados', citations);

      expect(blocks[0].kind).toBe('heading');
      expect(blocks[0].level).toBe(3);
    });

    it('separa lista numerada de lista com marcador', () => {
      const blocks = parseMarkdownBlocks('- um\n1. dois', citations);

      expect(blocks.map((block) => block.ordered)).toEqual([false, true]);
    });

    it('junta as linhas seguidas de um parágrafo, como manda o Markdown', () => {
      const blocks = parseMarkdownBlocks('primeira linha\nsegunda linha', citations);

      expect(blocks.length).toBe(1);
      expect(blocks[0].chunks).toEqual([{ kind: 'text', text: 'primeira linha segunda linha' }]);
    });

    it('não estoura com texto vazio', () => {
      expect(parseMarkdownBlocks('', citations)).toEqual([]);
    });
  });

  describe('parseInline', () => {

    const citations: AiCitation[] = [
      { n: 1, section: 'a', page: 1, snippet: '', title: null, itemUuid: null, itemHandle: null },
    ];

    it('marca negrito, itálico e código', () => {
      expect(parseInline('**forte** e *leve* e `cru`', citations)).toEqual([
        { kind: 'strong', text: 'forte' },
        { kind: 'text', text: ' e ' },
        { kind: 'em', text: 'leve' },
        { kind: 'text', text: ' e ' },
        { kind: 'code', text: 'cru' },
      ]);
    });

    it('mantém a citação clicável dentro de um trecho em negrito', () => {
      expect(parseInline('**resultado [1]**', citations)).toEqual([
        { kind: 'strong', text: 'resultado' },
        { kind: 'citation', text: '[1]', n: 1 },
      ]);
    });

    it('fecha a frase antes do marcador, não depois dele', () => {
      // Sem isto o ponto sobra solto atrás do botão: `trabalho [1] .`
      expect(parseInline('para o trabalho [1]. A análise', citations)).toEqual([
        { kind: 'text', text: 'para o trabalho.' },
        { kind: 'citation', text: '[1]', n: 1 },
        { kind: 'text', text: ' A análise' },
      ]);
    });

    it('não lê citação dentro de código, que é literal', () => {
      expect(parseInline('`array[1]`', citations)).toEqual([{ kind: 'code', text: 'array[1]' }]);
    });
  });

  describe('tidyCitationPunctuation', () => {

    const cite = (n: number): AiSummaryChunk => ({ kind: 'citation', text: `[${n}]`, n });

    it('passa a pontuação para a frente de uma série de marcadores', () => {
      expect(tidyCitationPunctuation([
        { kind: 'text', text: 'do PNE ' },
        cite(3),
        cite(4),
        { kind: 'text', text: '. A lei' },
      ])).toEqual([
        { kind: 'text', text: 'do PNE.' },
        cite(3),
        cite(4),
        { kind: 'text', text: ' A lei' },
      ]);
    });

    it('não põe a pontuação em negrito por a frase acabar em negrito', () => {
      expect(tidyCitationPunctuation([
        { kind: 'strong', text: 'Meta 1' },
        cite(1),
        { kind: 'text', text: ': universalizar' },
      ])).toEqual([
        { kind: 'strong', text: 'Meta 1' },
        { kind: 'text', text: ':' },
        cite(1),
        { kind: 'text', text: ' universalizar' },
      ]);
    });

    it('tira o espaço antes do marcador mesmo sem pontuação depois', () => {
      expect(tidyCitationPunctuation([
        { kind: 'text', text: 'no ambiente escolar ' },
        cite(5),
      ])).toEqual([
        { kind: 'text', text: 'no ambiente escolar' },
        cite(5),
      ]);
    });

    it('não mexe em marcador que abre a linha', () => {
      expect(tidyCitationPunctuation([cite(1), { kind: 'text', text: ' abre' }]))
        .toEqual([cite(1), { kind: 'text', text: ' abre' }]);
    });

    it('deixa o código em paz, que ali o texto é literal', () => {
      expect(tidyCitationPunctuation([
        { kind: 'text', text: 'veja ' },
        cite(1),
        { kind: 'code', text: '.map()' },
      ])).toEqual([
        { kind: 'text', text: 'veja' },
        cite(1),
        { kind: 'code', text: '.map()' },
      ]);
    });
  });

  describe('splitCitations', () => {

    const citations = [
      { n: 1, section: 'a', page: null, snippet: '', title: null, itemUuid: null, itemHandle: null },
      { n: 2, section: 'b', page: null, snippet: '', title: null, itemUuid: null, itemHandle: null },
    ];

    it('separa marcadores do texto corrido', () => {
      const chunks = splitCitations('Antes [1] depois [2].', citations);

      expect(chunks).toEqual([
        { kind: 'text', text: 'Antes ' },
        { kind: 'citation', text: '[1]', n: 1 },
        { kind: 'text', text: ' depois ' },
        { kind: 'citation', text: '[2]', n: 2 },
        { kind: 'text', text: '.' },
      ]);
    });

    it('mantém como texto o marcador sem fonte correspondente', () => {
      const chunks = splitCitations('Só isto [9].', citations);

      expect(chunks).toEqual([{ kind: 'text', text: 'Só isto [9].' }]);
    });

    it('lida com texto sem citação', () => {
      expect(splitCitations('sem marcador', citations)).toEqual([{ kind: 'text', text: 'sem marcador' }]);
    });

    it('lida com texto vazio', () => {
      expect(splitCitations('', citations)).toEqual([]);
    });
  });

  describe('blocksToPlainText', () => {
    const cites: AiCitation[] = [
      { n: 1, section: null, page: 1, snippet: '', title: 'Doc', itemUuid: null, itemHandle: null },
      { n: 2, section: null, page: 2, snippet: '', title: 'Doc', itemUuid: null, itemHandle: null },
    ];

    it('tira a marcação do Markdown e mantém os marcadores de citação', () => {
      const blocks = parseMarkdownBlocks('## Marco legal\n\nO PNE tem **20 metas** e mais [1][2]. Fim\n\n- Um item [1]\n- Outro', cites);

      expect(blocksToPlainText(blocks)).toBe('Marco legal\n\nO PNE tem 20 metas e mais.[1][2] Fim\n\n- Um item[1]\n- Outro');
    });

    it('numera os itens de lista ordenada', () => {
      const blocks = parseMarkdownBlocks('1. Primeiro\n2. Segundo', cites);

      expect(blocksToPlainText(blocks)).toBe('1. Primeiro\n2. Segundo');
    });

    it('devolve vazio sem blocos', () => {
      expect(blocksToPlainText([])).toBe('');
    });
  });
});
