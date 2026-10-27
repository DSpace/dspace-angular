/**
 * Tipos da resposta de `GET /api/search/summarize` do `evidencia_pipe` e a
 * normalização dela.
 *
 * A API fala snake_case e o contrato ainda está se firmando, então a leitura é
 * **tolerante**: campo ausente vira valor neutro, nunca exceção. É o mesmo
 * espírito do cliente da busca semântica, que aceita dois formatos de resposta.
 *
 * Funções puras — testáveis sem `TestBed`.
 */

/** Uma evidência citada no texto, referenciada por `[n]`. */
export interface AiCitation {
  /** Número exibido entre colchetes; casa com o marcador no texto da síntese. */
  n: number;
  /** Seção do documento de onde o trecho veio. */
  section: string;
  /** Página de origem; `null` quando o chunk não carrega página. */
  page: number | null;
  /** Trecho de evidência recuperado do chunk. */
  snippet: string;
  /**
   * Título do documento. A API não devolve título de metadado: o mais próximo é
   * o `document_id` do pipeline (ex.: `2022_CMAS_Política de Desoneração...`), que
   * é o que se usa aqui. Sem nem isso, a UI cai na seção.
   */
  title: string | null;
  /** UUID do item DSpace de origem: gera o link `/items/{uuid}`. */
  itemUuid: string | null;
  /** Handle do item DSpace de origem, usado quando não há UUID. */
  itemHandle: string | null;
}

/** Uma seção da síntese no modo "por seção do relatório". */
export interface AiSummarySection {
  /** Identificador estável da seção (ex.: `evaluation_results`). */
  key: string;
  /** Rótulo já pronto para exibição, vindo da API. */
  title: string;
  /** Texto sintético da seção, com os mesmos marcadores `[n]`. */
  summary: string;
}

/** Um filtro que valeu para a síntese, exibido no cabeçalho do painel. */
export interface AiSummaryFilter {
  /** Nome do parâmetro (ex.: `year`). */
  key: string;
  /** Valor aplicado. */
  value: string;
}

/** Resposta normalizada, pronta para o template. */
export interface AiSummaryResponse {
  /** Texto da síntese no modo geral; vazio no modo por seção. */
  summary: string;
  /** Seções da síntese no modo por seção; vazio no modo geral. */
  sections: AiSummarySection[];
  /** Fontes numeradas, na ordem das citações. */
  citations: AiCitation[];
  /** Filtros que a API declarou ter usado. */
  filtersUsed: AiSummaryFilter[];
  /** Quantas evidências foram analisadas. */
  evidenceCount: number;
}

/**
 * A resposta tem forma de síntese?
 *
 * Aceita corpo com `summary`, `sections` ou `mappings` — os dois modos e o
 * formato publicado da API. Serve para rejeitar um 200 com corpo inesperado
 * (proxy, página de erro, HTML).
 */
export function isAiSummaryPayload(payload: unknown): boolean {
  if (payload === null || typeof payload !== 'object') {
    return false;
  }
  const record = payload as Record<string, unknown>;
  return typeof record.summary === 'string' || Array.isArray(record.sections) || Array.isArray(record.mappings);
}

/**
 * Converte o corpo cru da API na forma usada pelo componente.
 *
 * A API publicada chama as fontes de `mappings`, os filtros de `applied_filters` e
 * guarda o total de evidências dentro de `retrieval`. Os nomes `citations`,
 * `filters_used` e `evidence_count` continuam sendo aceitos: são o contrato que
 * esta pasta assumiu antes de o endpoint existir, e ler os dois custa nada.
 */
export function normalizeAiSummary(payload: unknown): AiSummaryResponse {
  const record = (payload ?? {}) as Record<string, unknown>;
  const retrieval = readRecord(record.retrieval);
  const citations = readCitations(record.citations ?? record.mappings);
  return {
    summary: readString(record.summary),
    sections: readSections(record.sections),
    citations,
    filtersUsed: readFilters(record.filters_used ?? record.filtersUsed ?? record.applied_filters),
    evidenceCount: readCount(
      record.evidence_count ?? record.evidenceCount ?? retrieval.evidence_count,
      citations.length,
    ),
  };
}

/**
 * Divide o texto da síntese em partes, separando os marcadores `[n]` do texto
 * corrido. O template precisa disso para transformar cada marcador num botão de
 * citação sem recorrer a `innerHTML`.
 *
 * Um marcador que não tenha citação correspondente continua sendo texto — não
 * vira botão que abriria um popover vazio.
 */
export function splitCitations(text: string, citations: AiCitation[]): AiSummaryChunk[] {
  const known = new Set(citations.map((citation: AiCitation) => citation.n));
  const chunks: AiSummaryChunk[] = [];
  const pattern = /\[(\d{1,3})\]/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const n = Number(match[1]);
    if (!known.has(n)) {
      continue;
    }
    if (match.index > cursor) {
      chunks.push({ kind: 'text', text: text.slice(cursor, match.index) });
    }
    chunks.push({ kind: 'citation', text: match[0], n });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) {
    chunks.push({ kind: 'text', text: text.slice(cursor) });
  }
  return chunks;
}

/**
 * O que um pedaço de texto é: corrido, enfatizado, monoespaçado ou um marcador de
 * citação.
 */
export type AiInlineKind = 'text' | 'strong' | 'em' | 'code' | 'citation';

/** Um documento citado, com todos os números que apontam para ele. */
export interface AiSource {
  /** Identidade do documento: o que agrupa as citações. */
  key: string;
  /** Rótulo exibido na lista de fontes. */
  name: string;
  /** As citações deste documento, na ordem em que aparecem no texto. */
  citations: AiCitation[];
}

/**
 * Agrupa as citações por documento de origem.
 *
 * A API numera cada **trecho**, então o mesmo relatório costuma aparecer em
 * `[1]`, `[3]` e `[5]`. Repetir o nome dele três vezes na lista de fontes
 * esconde quantos documentos a síntese realmente usou — agrupado, cada linha é
 * um documento e os números ao lado levam a cada trecho.
 */
export function groupCitationsBySource(citations: AiCitation[]): AiSource[] {
  const sources = new Map<string, AiSource>();

  for (const citation of citations) {
    // O UUID identifica o documento; sem ele, o handle; sem nenhum dos dois, o
    // próprio rótulo — duas citações sem origem conhecida só se juntam se
    // vierem com o mesmo nome.
    const name = citation.title || citation.section || '';
    const key = citation.itemUuid ?? citation.itemHandle ?? `label:${name}`;
    const found = sources.get(key);
    if (found === undefined) {
      sources.set(key, { key, name, citations: [citation] });
    } else {
      found.citations.push(citation);
      // Um trecho sem seção pode chegar antes do que traz o nome do documento.
      if (found.name === '' && name !== '') {
        found.name = name;
      }
    }
  }

  return [...sources.values()];
}

/**
 * Quebra o texto da síntese nos blocos do Markdown que o LLM produz.
 *
 * Reconhece título (`#`…`######`), lista com marcador (`-`, `*`, `+`) e lista
 * numerada (`1.`, `1)`); o resto vira parágrafo, com as linhas seguidas unidas
 * como manda o Markdown. Linha em branco separa blocos.
 */
export function parseMarkdownBlocks(text: string, citations: AiCitation[]): AiSummaryBlock[] {
  const blocks: AiSummaryBlock[] = [];
  // Parágrafo e lista se acumulam por várias linhas: só fecham na linha em branco
  // ou quando começa um bloco de outro tipo.
  let paragraph: string[] = [];
  let list: AiSummaryBlock | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: 'paragraph', chunks: parseInline(paragraph.join(' '), citations) });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list !== null) {
      blocks.push(list);
      list = null;
    }
  };

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (trimmed === '') {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading !== null) {
      flushParagraph();
      flushList();
      blocks.push({ kind: 'heading', level: heading[1].length, chunks: parseInline(heading[2], citations) });
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(trimmed);
    const numbered = /^\d{1,3}[.)]\s+(.*)$/.exec(trimmed);
    const item = bullet ?? numbered;
    if (item !== null) {
      flushParagraph();
      const ordered = bullet === null;
      // Trocar de marcador para numeração (ou o contrário) começa outra lista.
      if (list === null || list.ordered !== ordered) {
        flushList();
        list = { kind: 'list', ordered, items: [] };
      }
      list.items.push(parseInline(item[1], citations));
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks;
}

/**
 * Classifica o conteúdo de uma linha: ênfase, código e marcadores de citação.
 *
 * Uma citação dentro de um trecho enfatizado continua sendo citação — perde o
 * negrito, mas segue clicável, que é o que importa.
 */
export function parseInline(text: string, citations: AiCitation[]): AiSummaryChunk[] {
  const chunks: AiSummaryChunk[] = [];
  const pattern = /\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\n]+)\*|`([^`]+)`/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  const pushPlain = (value: string) => {
    if (value !== '') {
      chunks.push(...splitCitations(value, citations));
    }
  };

  while ((match = pattern.exec(text)) !== null) {
    pushPlain(text.slice(cursor, match.index));
    const [kind, content] = match[1] !== undefined ? ['strong', match[1]] as const
      : match[2] !== undefined ? ['strong', match[2]] as const
        : match[3] !== undefined ? ['em', match[3]] as const
          : ['code', match[4]] as const;
    // Código é literal por definição: `[1]` ali é texto, não citação.
    if (kind === 'code') {
      chunks.push({ kind, text: content });
    } else {
      chunks.push(...splitCitations(content, citations)
        .map((chunk: AiSummaryChunk) => chunk.kind === 'text' ? { ...chunk, kind } : chunk));
    }
    cursor = match.index + match[0].length;
  }
  pushPlain(text.slice(cursor));
  // A pontuação só se acerta com a linha inteira montada: um marcador pode nascer
  // dentro de um trecho em negrito e a vírgula que o segue, fora dele.
  return tidyCitationPunctuation(chunks);
}

/** Pontuação que fecha a frase e, por convenção editorial, precede o marcador. */
const CLOSING_PUNCTUATION = /^[.,;:!?)]+/;

/**
 * Reposiciona a pontuação em volta dos marcadores de citação.
 *
 * O LLM escreve `…para o trabalho [1][2]. A análise…`. Desenhar cada marcador
 * como um botão de verdade quebra a linha em elementos separados, e o ponto
 * sobra solto atrás deles: `…para o trabalho [1] [2] . A análise…` — o detalhe
 * que mais denuncia texto montado por máquina, e ele aparece em todo parágrafo.
 *
 * A convenção de referência é a inversa: a pontuação fecha a frase, o marcador
 * vem depois dela. Então o espaço antes do marcador sai e a pontuação que o
 * segue passa para a frente — `…para o trabalho.[1][2] A análise…`.
 */
export function tidyCitationPunctuation(chunks: AiSummaryChunk[]): AiSummaryChunk[] {
  const out: AiSummaryChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    // Marcador na abertura da linha não tem frase anterior para fechar.
    if (chunks[i].kind !== 'citation' || out.length === 0) {
      out.push({ ...chunks[i] });
      continue;
    }

    // Os marcadores costumam vir em série (`[1][2]`): a pontuação fecha a série
    // toda, não o primeiro deles.
    let end = i;
    while (end + 1 < chunks.length && chunks[end + 1].kind === 'citation') {
      end++;
    }

    // Dentro de `code` nada se move: ali o texto é literal.
    const next = chunks[end + 1];
    const punctuation = next !== undefined && next.kind !== 'code'
      ? CLOSING_PUNCTUATION.exec(next.text)?.[0] ?? ''
      : '';

    const previous = out[out.length - 1];
    previous.text = previous.text.replace(/\s+$/, '');
    if (punctuation !== '') {
      if (previous.kind === 'text') {
        previous.text += punctuation;
      } else {
        // Pontuação não herda a ênfase do trecho anterior: um ponto em negrito
        // porque a frase acabou em negrito seria erro de composição.
        out.push({ kind: 'text', text: punctuation });
      }
    }

    for (let n = i; n <= end; n++) {
      out.push({ ...chunks[n] });
    }
    if (next !== undefined) {
      out.push({ ...next, text: next.text.slice(punctuation.length) });
    }
    i = end + 1;
  }

  // Um trecho que era só o espaço antes do marcador não precisa de elemento.
  return out.filter((chunk: AiSummaryChunk) => chunk.kind === 'citation' || chunk.text !== '');
}

/** Um pedaço do texto da síntese, já classificado para o template. */
export interface AiSummaryChunk {
  kind: AiInlineKind;
  text: string;
  /** Número da citação; presente só quando `kind === 'citation'`. */
  n?: number;
}

/**
 * Um bloco do texto da síntese: parágrafo, título ou lista.
 *
 * O LLM responde em Markdown (títulos em `**negrito**`, itens em `- `), e mostrar
 * isso cru deixa os asteriscos na tela. A conversão é feita **em estrutura**, não
 * em HTML: o template continua desenhando cada citação como um botão Angular de
 * verdade, com popover e navegação — o que `innerHTML` não permitiria.
 *
 * Cobre o que a síntese realmente usa (títulos, listas, ênfase, código). Markdown
 * fora disso — tabelas, citações em bloco, links — fica como texto corrido, que é
 * o mesmo que se vê hoje, nunca um erro.
 */
export interface AiSummaryBlock {
  kind: 'paragraph' | 'heading' | 'list';
  /** Nível do título (1–6); só em `heading`. */
  level?: number;
  /** A lista é numerada? Só em `list`. */
  ordered?: boolean;
  /** Conteúdo de parágrafo e título. */
  chunks?: AiSummaryChunk[];
  /** Conteúdo de cada item, em `list`. */
  items?: AiSummaryChunk[][];
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** Um objeto aninhado da resposta; `{}` quando ausente ou de outro tipo. */
function readRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function readSections(value: unknown): AiSummarySection[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((entry: unknown): entry is Record<string, unknown> => entry !== null && typeof entry === 'object')
    .map((entry: Record<string, unknown>, index: number) => ({
      key: readString(entry.key) || `section-${index + 1}`,
      title: readString(entry.title) || readString(entry.key),
      summary: readString(entry.summary),
    }))
    .filter((section: AiSummarySection) => section.summary !== '');
}

function readCitations(value: unknown): AiCitation[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((entry: unknown): entry is Record<string, unknown> => entry !== null && typeof entry === 'object')
    .map((entry: Record<string, unknown>, index: number) => ({
      // Sem número explícito, a posição na lista é a numeração — é assim que o
      // texto da síntese referencia as fontes. Em `mappings` o campo é `index`.
      n: readPositiveInt(entry.n ?? entry.index) ?? index + 1,
      section: readString(entry.section),
      page: readPositiveInt(entry.page),
      snippet: readString(entry.snippet),
      // `document_id` é o nome do documento de origem no pipeline — é o que mais
      // se parece com um título entre o que a API manda.
      title: readString(entry.title) || readString(entry.document_id) || null,
      itemUuid: readString(entry.item_uuid ?? entry.itemUuid ?? entry.dspace_uuid) || null,
      itemHandle: readString(entry.item_handle ?? entry.itemHandle) || null,
    }));
}

/**
 * Aceita tanto o objeto `{ year: '2024' }` quanto a lista
 * `[{ key: 'year', value: '2024' }]` — o contrato ainda não está fechado.
 */
function readFilters(value: unknown): AiSummaryFilter[] {
  if (Array.isArray(value)) {
    return value
      .filter((entry: unknown): entry is Record<string, unknown> => entry !== null && typeof entry === 'object')
      .map((entry: Record<string, unknown>) => ({
        key: readString(entry.key),
        value: readString(entry.value),
      }))
      .filter((filter: AiSummaryFilter) => filter.key !== '' && filter.value !== '');
  }
  if (value === null || typeof value !== 'object') {
    return [];
  }
  return Object.entries(value as Record<string, unknown>)
    .map(([key, entry]: [string, unknown]) => ({ key, value: stringifyFilterValue(entry) }))
    .filter((filter: AiSummaryFilter) => filter.value !== '');
}

function stringifyFilterValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((entry: unknown) => stringifyFilterValue(entry)).filter((entry: string) => entry !== '').join(', ');
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return '';
}

function readPositiveInt(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
}

function readCount(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

/** O texto de uma linha como se lê na tela: marcadores ficam `[n]`, ênfase sai. */
function chunksToText(chunks: AiSummaryChunk[] = []): string {
  return chunks.map((chunk: AiSummaryChunk) => chunk.text).join('').trim();
}

/**
 * A síntese em texto puro, para a área de transferência.
 *
 * Sai do que a tela mostra, não do Markdown da API: colado num e-mail ou num
 * documento, `**` e `###` viram lixo. Os marcadores `[n]` ficam — sem eles o texto
 * copiado afirma coisas sem dizer de onde vieram. Blocos separados por linha em
 * branco; itens de lista com `- ` (ou `1. ` nas numeradas).
 */
export function blocksToPlainText(blocks: AiSummaryBlock[]): string {
  return blocks.map((block: AiSummaryBlock) => {
    if (block.kind === 'list') {
      return (block.items ?? [])
        .map((item: AiSummaryChunk[], i: number) => `${block.ordered ? `${i + 1}.` : '-'} ${chunksToText(item)}`)
        .join('\n');
    }
    return chunksToText(block.chunks);
  }).filter((text: string) => text !== '').join('\n\n');
}
