import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import {
  Observable,
  of,
  throwError,
  TimeoutError,
} from 'rxjs';
import {
  catchError,
  mergeMap,
  timeout,
} from 'rxjs/operators';

import { APP_CONFIG } from './host';
import {
  PIPELINE_STATUS_DEFAULTS,
  pipelineStatusEndpoint,
  resolvePipelineStatusConfig,
} from './pipeline-status.config';
import {
  isPipelineStatusResponse,
  PipelineStatusResponse,
} from './pipeline-status.model';

/**
 * Endpoint com a configuração padrão (mesma origem). O endpoint real é resolvido
 * por chamada em `getStatus`, considerando `AppConfig` e as opções recebidas.
 */
export const PIPELINE_STATUS_ENDPOINT = pipelineStatusEndpoint(PIPELINE_STATUS_DEFAULTS);

/** A checagem completa é lenta (varre MinIO, consulta o Celery): teto generoso. */
export const PIPELINE_STATUS_TIMEOUT_MS = PIPELINE_STATUS_DEFAULTS.timeoutMs;

/** Por que a consulta falhou — a UI mostra mensagens diferentes para cada caso. */
export type PipelineErrorKind = 'network' | 'http' | 'timeout' | 'invalid';

export interface PipelineStatusError {
  kind: PipelineErrorKind;
  /** Status HTTP quando houver; 0 em falha de rede/CORS. */
  status: number;
}

/**
 * Opções da consulta: os query params da API mais os overrides de endpoint, que
 * vencem a configuração da aplicação (é o que permite duas instâncias do painel
 * apontarem para clusters diferentes na mesma tela).
 */
export interface PipelineStatusOptions {
  /** Ignora o cache da API e refaz a checagem. */
  fresh?: boolean;
  /** Executa probes de escrita (mais lento). */
  probe?: boolean | null;
  /** Inclui a varredura de artefatos do MinIO. */
  artifacts?: boolean | null;
  /** Base da API, sobrepondo o `AppConfig`. */
  baseUrl?: string | null;
  /** Caminho do endpoint, sobrepondo o `AppConfig`. */
  statusPath?: string | null;
  /** Teto da requisição, sobrepondo o `AppConfig`. */
  timeoutMs?: number | null;
}

/**
 * Cliente de `GET /api/status`. Só transporte: valida o formato da resposta e
 * classifica a falha, sem nenhuma regra de apresentação — quem traduz isso em
 * rótulos, ícones e métricas é o `pipeline-status.presenter`.
 */
@Injectable({ providedIn: 'root' })
export class PipelineStatusService {

  private readonly http = inject(HttpClient);
  /**
   * Opcional de propósito: a pasta funciona numa instalação que não provê
   * `APP_CONFIG` (e nos testes, que não o provêem).
   */
  private readonly appConfig = inject(APP_CONFIG, { optional: true });

  getStatus(options: PipelineStatusOptions = {}): Observable<PipelineStatusResponse> {
    const config = resolvePipelineStatusConfig(this.appConfig, options);
    return this.http.get<unknown>(pipelineStatusEndpoint(config), {
      params: {
        fresh: String(options.fresh ?? false),
        probe: String(config.probe),
        artifacts: String(config.artifacts),
      },
    }).pipe(
      timeout(config.timeoutMs),
      mergeMap((payload: unknown) => isPipelineStatusResponse(payload)
        ? of(payload)
        // Resposta 200 com corpo inesperado (proxy, página de erro, HTML).
        : throwError(() => ({ kind: 'invalid', status: 200 } as PipelineStatusError))),
      catchError((err: unknown) => {
        const report = statusReportInError(err);
        return report !== null
          ? of(report)
          : throwError(() => toPipelineStatusError(err));
      }),
    );
  }
}

/**
 * A API anuncia a saúde geral **pelo próprio código HTTP**: com a plataforma `down`
 * (um componente crítico fora), `GET /api/status` responde 503 — mas com o relatório
 * completo no corpo, que é exatamente o que este painel existe para mostrar.
 *
 * Sem isto, o `HttpClient` transforma o 503 em exceção e a única tela possível
 * justamente quando algo cai seria "a API está indisponível" — enquanto a API está
 * no ar e respondendo qual componente caiu.
 *
 * O corpo válido vence o código de erro; um 401/403/504 real não traz relatório
 * (`{ detail: ... }`, HTML de proxy, corpo vazio) e continua caindo em
 * `toPipelineStatusError`.
 */
function statusReportInError(err: unknown): PipelineStatusResponse | null {
  if (!(err instanceof HttpErrorResponse)) {
    return null;
  }
  const body: unknown = err.error;
  return isPipelineStatusResponse(body) ? body : null;
}

/** Classifica um erro de consulta: rede, HTTP, timeout ou resposta inválida. */
export function toPipelineStatusError(err: unknown): PipelineStatusError {
  if (isPipelineStatusError(err)) {
    return err;
  }
  if (err instanceof TimeoutError) {
    return { kind: 'timeout', status: 0 };
  }
  const status = err instanceof HttpErrorResponse ? err.status : 0;
  // status 0 = pedido nunca chegou (rede, DNS, CORS, servidor fora do ar).
  return status > 0 ? { kind: 'http', status } : { kind: 'network', status: 0 };
}

function isPipelineStatusError(err: unknown): err is PipelineStatusError {
  if (err === null || typeof err !== 'object') {
    return false;
  }
  const kind = (err as PipelineStatusError).kind;
  return kind === 'network' || kind === 'http' || kind === 'timeout' || kind === 'invalid';
}
