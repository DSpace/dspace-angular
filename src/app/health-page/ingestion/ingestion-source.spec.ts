import { HttpErrorResponse } from '@angular/common/http';
import {
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  Observable,
  of,
  Subject,
  throwError,
} from 'rxjs';

import { IngestionSource } from './ingestion-source';
import { BASE_RETRY_SECONDS } from './ingestion-state';

interface Payload {
  jobs: string[];
}

function sourceOf(fetch: (limit: number) => Observable<Payload>, autoRetry = true): IngestionSource<Payload> {
  return new IngestionSource<Payload>(fetch, (data: Payload) => data.jobs.length === 0, () => autoRetry);
}

describe('IngestionSource', () => {

  it('não dispara nada antes de alguém se inscrever', () => {
    const fetch = jasmine.createSpy('fetch').and.returnValue(of({ jobs: ['a'] }));
    const source = sourceOf(fetch);

    source.run('initial', 100);

    expect(fetch).not.toHaveBeenCalled();
    expect(source.isStarted).toBeFalse();
  });

  it('passa por carregamento inicial e chega a sucesso com conteúdo', () => {
    const response = new Subject<Payload>();
    const source = sourceOf(() => response);

    source.run('initial', 100).subscribe();

    expect(source.state().status).toBe('loading');

    response.next({ jobs: ['a'] });

    expect(source.state().status).toBe('success');
    expect(source.state().lastUpdated).not.toBeNull();
  });

  it('distingue resultado vazio de sucesso com conteúdo', () => {
    const source = sourceOf(() => of({ jobs: [] }));

    source.run('initial', 100).subscribe();

    expect(source.state().status).toBe('empty');
  });

  it('mostra "refreshing" na atualização, mantendo os dados na tela', () => {
    const response = new Subject<Payload>();
    const source = sourceOf(() => response);

    source.run('initial', 100).subscribe();
    response.next({ jobs: ['a'] });
    source.run('auto', 100).subscribe();

    expect(source.state().status).toBe('refreshing');
    expect(source.state().data.jobs).toEqual(['a']);
  });

  it('vai para erro quando falha sem dados anteriores', fakeAsync(() => {
    const source = sourceOf(() => throwError(() => new HttpErrorResponse({ status: 500 })));

    source.run('initial', 100).subscribe();

    expect(source.state().status).toBe('error');
    expect(source.state().error.key).toBe('health-page.ingestion.state.error.server');

    source.dispose();
  }));

  it('vai para dados parciais quando falha com dados anteriores', fakeAsync(() => {
    let fail = false;
    const source = sourceOf(() => fail
      ? throwError(() => new HttpErrorResponse({ status: 500 }))
      : of({ jobs: ['a'] }));

    source.run('initial', 100).subscribe();
    fail = true;
    source.run('auto', 100).subscribe();

    expect(source.state().status).toBe('partial');
    expect(source.state().data.jobs).toEqual(['a']);

    source.dispose();
  }));

  it('marca como indisponível e não agenda reconexão em erro definitivo', fakeAsync(() => {
    const source = sourceOf(() => throwError(() => new HttpErrorResponse({ status: 403 })));
    const retries: string[] = [];
    source.retry$.subscribe((reason: string) => retries.push(reason));

    source.run('initial', 100).subscribe();

    expect(source.state().status).toBe('unavailable');
    expect(source.state().retryInSeconds).toBeNull();

    tick(60000);

    expect(retries).toEqual([]);
    source.dispose();
  }));

  it('agenda a reconexão com contagem regressiva e avisa quando é hora', fakeAsync(() => {
    const source = sourceOf(() => throwError(() => new HttpErrorResponse({ status: 500 })));
    const retries: string[] = [];
    source.retry$.subscribe((reason: string) => retries.push(reason));

    source.run('initial', 100).subscribe();

    expect(source.state().retryInSeconds).toBe(BASE_RETRY_SECONDS);

    tick(1000);

    expect(source.state().retryInSeconds).toBe(BASE_RETRY_SECONDS - 1);

    tick(BASE_RETRY_SECONDS * 1000);

    expect(retries).toEqual(['retry']);
    source.dispose();
  }));

  it('aumenta o intervalo a cada falha consecutiva', fakeAsync(() => {
    const source = sourceOf(() => throwError(() => new HttpErrorResponse({ status: 500 })));

    source.run('initial', 100).subscribe();
    source.run('retry', 100).subscribe();

    expect(source.state().attempts).toBe(2);
    expect(source.state().retryInSeconds).toBe(BASE_RETRY_SECONDS * 2);

    source.dispose();
  }));

  it('não agenda reconexão automática quando o auto-reload está desligado', fakeAsync(() => {
    const source = sourceOf(() => throwError(() => new HttpErrorResponse({ status: 500 })), false);

    source.run('initial', 100).subscribe();

    expect(source.state().status).toBe('error');
    expect(source.state().retryInSeconds).toBeNull();

    source.dispose();
  }));

  it('tentativa manual cancela a contagem e emite na hora', fakeAsync(() => {
    const source = sourceOf(() => throwError(() => new HttpErrorResponse({ status: 500 })));
    const retries: string[] = [];
    source.retry$.subscribe((reason: string) => retries.push(reason));

    source.run('initial', 100).subscribe();
    source.retryNow();

    expect(retries).toEqual(['manual']);

    tick(60000);

    expect(retries).toEqual(['manual']);
    source.dispose();
  }));

  it('zera as tentativas depois de uma resposta boa', fakeAsync(() => {
    let fail = true;
    const source = sourceOf(() => fail
      ? throwError(() => new HttpErrorResponse({ status: 500 }))
      : of({ jobs: ['a'] }));

    source.run('initial', 100).subscribe();
    fail = false;
    source.run('retry', 100).subscribe();

    expect(source.state().attempts).toBe(0);
    expect(source.state().status).toBe('success');

    source.dispose();
  }));

  it('repassa o limite pedido para a chamada', () => {
    const fetch = jasmine.createSpy('fetch').and.returnValue(of({ jobs: [] }));
    const source = sourceOf(fetch);

    source.run('initial', 250).subscribe();

    expect(fetch).toHaveBeenCalledWith(250);
  });
});
