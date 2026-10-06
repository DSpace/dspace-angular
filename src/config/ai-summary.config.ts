import { Config } from './config.interface';

/**
 * Config da aba "Síntese por IA" da busca. Aponta para a API que expõe
 * `GET <baseUrl><summarizePath>` (o mesmo `evidencia_pipe` da busca semântica e da
 * ingestão).
 *
 * Os defaults ficam em `DefaultAppConfig`; cada instalação ajusta a aba no
 * `config.yml`/`config.<env>.yml` ou via `DSPACE_AISUMMARY_ENABLED`.
 */
export class AiSummaryConfig implements Config {
  /**
   * A aba aparece? Ligada por padrão: o endpoint de síntese já está publicado na
   * API RDAPP. Uma instalação sem ele desliga a aba aqui.
   */
  public enabled: boolean;

  /**
   * Base da API. Vazio = usa o host da API RDAPP já definido no frontend
   * (`src/app/health-page/evidencia-api.ts`), que é onde a síntese mora.
   */
  public baseUrl: string;

  /**
   * Caminho do endpoint de síntese, concatenado a `baseUrl`.
   */
  public summarizePath: string;

  /**
   * Teto da requisição em ms. A síntese passa por um LLM: é lenta por natureza.
   */
  public timeoutMs: number;

  /**
   * Quantas evidências a API deve considerar ao sintetizar.
   */
  public limit: number;

  /**
   * Quantas evidências **por documento** quando a síntese é restrita aos itens
   * marcados na lista de resultados. Nesse caso a API trata `limit` como o `k` de
   * cada documento, e não como o total.
   */
  public limitPerDocument: number;

  /**
   * Teto de documentos numa síntese por seleção; espelha o `SUMMARY_MAX_DOCUMENTS`
   * da API (20). Acima disso a API responde 422 na validação do corpo.
   */
  public maxDocuments: number;
}
