import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import { Observable } from 'rxjs';

import { EVIDENCIA_API_BASE } from '../evidencia-api';

/**
 * Base da API de ingestão. Reexporta a constante compartilhada da health page para
 * que o host exista num lugar só (ver `evidencia-api.ts`).
 */
export const INGESTION_API_BASE = EVIDENCIA_API_BASE;

/** Job em execução (na_fila | processando), resumo de GET /api/files/active. */
export interface ActiveJob {
  job_id: string;
  status?: string;
  stage?: string;
  filename?: string;
  item_uuid?: string;
  error?: string;
  updated_at?: string;
}

export interface ActiveJobsResponse {
  count: number;
  job_ids: string[];
  jobs: ActiveJob[];
}

/** Job concluído com sucesso (GET /api/files/succeeded). */
export interface SucceededJob {
  job_id: string;
  status?: string;
  stage?: string;
  filename?: string;
  item_uuid?: string;
  error?: string;
  chunk_count?: number;
  indexed_count?: number;
  artifact_id?: string;
  updated_at?: string;
}

export interface SucceededJobsResponse {
  count: number;
  job_ids: string[];
  jobs: SucceededJob[];
}

/** Registro de um job que falhou (GET /api/files/failures). Campos livres. */
export interface FailedJob {
  job_id: string;
  status?: string;
  stage?: string;
  filename?: string;
  item_uuid?: string;
  error?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface FailuresResponse {
  count: number;
  jobs: FailedJob[];
}

/** Registro completo do job (GET /api/files/status/{job_id}). Campos livres. */
export interface JobStatus {
  job_id: string;
  status: string;
  stage?: string;
  filename?: string;
  item_uuid?: string;
  error?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface JobResultDocument {
  document_id: string;
  status: string;
  chunk_count?: number;
  indexed_count?: number;
  artifact_id?: string;
}

/** Resultado resumido do job (GET /api/files/result/{job_id}). */
export interface JobResult {
  job_id: string;
  status: string;
  documents: JobResultDocument[];
}

/**
 * Cliente da API de ingestão (evidencia_pipe) usada pela aba "Ingestão" da
 * health page. Segue a convenção do projeto (HttpClient simples, sem
 * withCredentials — o CORS aceita a origem sem credenciais em GET).
 */
@Injectable({ providedIn: 'root' })
export class IngestionService {

  private http = inject(HttpClient);

  /** Jobs em execução (mais recentes primeiro). */
  getActive(limit = 100): Observable<ActiveJobsResponse> {
    return this.http.get<ActiveJobsResponse>(
      `${INGESTION_API_BASE}/api/files/active`,
      { params: { limit: String(limit) } },
    );
  }

  /** Jobs na fila de falhas. */
  getFailures(limit = 100): Observable<FailuresResponse> {
    return this.http.get<FailuresResponse>(
      `${INGESTION_API_BASE}/api/files/failures`,
      { params: { limit: String(limit) } },
    );
  }

  /** Últimos jobs concluídos com sucesso (mais recentes primeiro). */
  getSucceeded(limit = 100): Observable<SucceededJobsResponse> {
    return this.http.get<SucceededJobsResponse>(
      `${INGESTION_API_BASE}/api/files/succeeded`,
      { params: { limit: String(limit) } },
    );
  }

  /** Status detalhado de um job específico. */
  getStatus(jobId: string): Observable<JobStatus> {
    return this.http.get<JobStatus>(
      `${INGESTION_API_BASE}/api/files/status/${encodeURIComponent(jobId)}`,
    );
  }

  /** Resultado de um job concluído (409 se ainda processando, 422 se erro). */
  getResult(jobId: string): Observable<JobResult> {
    return this.http.get<JobResult>(
      `${INGESTION_API_BASE}/api/files/result/${encodeURIComponent(jobId)}`,
    );
  }

  /** Re-enfileira um job que falhou. */
  reprocess(jobId: string, force = true): Observable<unknown> {
    return this.http.post(
      `${INGESTION_API_BASE}/api/files/reprocess/${encodeURIComponent(jobId)}`,
      null,
      { params: { force: String(force) } },
    );
  }
}
