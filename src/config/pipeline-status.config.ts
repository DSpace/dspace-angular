import { Config } from './config.interface';

/**
 * Config do painel de infraestrutura evidencIA/RDAPP (health page, aba
 * "Infraestrutura"). Aponta para a API que expõe `GET <baseUrl><statusPath>`.
 *
 * Defaults neutros (mesma origem) ficam em `DefaultAppConfig`: cada instalação
 * declara o próprio host no `config.yml` ou via `DSPACE_PIPELINESTATUS_BASEURL`.
 */
export class PipelineStatusConfig implements Config {
  /**
   * Base da API. `/` = mesma origem da UI. Pode incluir prefixo de path.
   */
  public baseUrl: string;

  /**
   * Caminho do endpoint agregado de status, concatenado a `baseUrl`.
   */
  public statusPath: string;

  /**
   * Teto da requisição em ms. A checagem completa varre o MinIO e consulta o
   * Celery, então é lenta por natureza.
   */
  public timeoutMs: number;

  /**
   * Executa probes de escrita na checagem (mais lento).
   */
  public probe: boolean;

  /**
   * Inclui a varredura de artefatos do MinIO na checagem.
   */
  public artifacts: boolean;
}
