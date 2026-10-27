import { HttpErrorResponse } from '@angular/common/http';

import {
  BASE_RETRY_SECONDS,
  hasData,
  idleSectionState,
  isBusy,
  MAX_RETRY_SECONDS,
  retryDelaySeconds,
  toSectionError,
} from './ingestion-state';

describe('ingestion-state', () => {

  describe('toSectionError', () => {
    it('trata falha de rede/CORS (status 0) como recuperável', () => {
      const error = toSectionError(new HttpErrorResponse({ status: 0 }));

      expect(error.status).toBe(0);
      expect(error.key).toBe('health-page.ingestion.state.error.offline');
      expect(error.retryable).toBeTrue();
    });

    it('não insiste em 401, 403, 404 e 422', () => {
      [401, 403, 404, 422].forEach((status: number) => {
        const error = toSectionError(new HttpErrorResponse({ status }));

        expect(error.retryable).withContext(`status ${status}`).toBeFalse();
        expect(error.key).withContext(`status ${status}`).not.toBe('health-page.ingestion.state.error.unknown');
      });
    });

    it('mantém a reconexão em 429, 500 e 503', () => {
      [429, 500, 503].forEach((status: number) => {
        const error = toSectionError(new HttpErrorResponse({ status }));

        expect(error.retryable).withContext(`status ${status}`).toBeTrue();
      });
    });

    it('usa mensagens distintas por status', () => {
      const keys = [401, 403, 404, 429, 500].map((status: number) =>
        toSectionError(new HttpErrorResponse({ status })).key);

      expect(new Set(keys).size).toBe(keys.length);
    });

    it('cai em unknown para status inesperado', () => {
      expect(toSectionError(new HttpErrorResponse({ status: 418 })).key)
        .toBe('health-page.ingestion.state.error.unknown');
    });
  });

  describe('retryDelaySeconds', () => {
    it('dobra o intervalo a cada tentativa', () => {
      expect(retryDelaySeconds(1)).toBe(BASE_RETRY_SECONDS);
      expect(retryDelaySeconds(2)).toBe(BASE_RETRY_SECONDS * 2);
      expect(retryDelaySeconds(3)).toBe(BASE_RETRY_SECONDS * 4);
    });

    it('respeita o teto', () => {
      expect(retryDelaySeconds(50)).toBe(MAX_RETRY_SECONDS);
    });
  });

  describe('estado inicial', () => {
    it('começa em idle, sem dados e sem erro', () => {
      const state = idleSectionState<string>();

      expect(state.status).toBe('idle');
      expect(hasData(state)).toBeFalse();
      expect(isBusy(state)).toBeFalse();
      expect(state.error).toBeNull();
    });
  });
});
