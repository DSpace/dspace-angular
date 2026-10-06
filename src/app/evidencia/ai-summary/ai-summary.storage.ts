/**
 * Estado da síntese que sobrevive ao F5.
 *
 * `sessionStorage`, não `localStorage`: o F5 preserva, fechar a aba do navegador
 * esquece — e cada aba tem a sua, então duas buscas abertas lado a lado não
 * trocam de síntese uma com a outra.
 *
 * Nada aqui pode quebrar a tela. No SSR não existe `window`; em navegação privada
 * ou com o armazenamento bloqueado o acesso lança; com a cota cheia a escrita
 * lança. Em todos esses casos a leitura volta vazia e a escrita não faz nada — o
 * painel só perde a memória, como era antes.
 */

/** Chaves usadas no `sessionStorage`. */
export const AI_SUMMARY_STORAGE_KEYS = {
  /** Respostas da API, por `cacheKey`. */
  responses: 'evidencia.ai-summary.responses',
  /** Aba aberta e seleção de documentos da busca atual. */
  view: 'evidencia.ai-summary.view',
  /** Modo escolhido (resumo geral / por seção). */
  mode: 'evidencia.ai-summary.mode',
} as const;

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Valor guardado em `key`, ou `null` se não há, não se lê ou não é JSON. */
export function readStored<T>(key: string): T | null {
  try {
    const raw = storage()?.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

/** Guarda `value` em `key`; falha em silêncio. */
export function writeStored(key: string, value: unknown): void {
  try {
    storage()?.setItem(key, JSON.stringify(value));
  } catch {
    // Cota cheia ou armazenamento bloqueado: segue sem persistir.
  }
}

/** Remove `key`; falha em silêncio. */
export function removeStored(key: string): void {
  try {
    storage()?.removeItem(key);
  } catch {
    // Armazenamento bloqueado: não há o que remover.
  }
}
