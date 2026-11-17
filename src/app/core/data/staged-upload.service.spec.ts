import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpEventType,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthInterceptor } from '@dspace/core/auth/auth.interceptor';
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  StagedUpload,
  StagedUploadProgress,
  StagedUploadService,
} from './staged-upload.service';

describe('StagedUploadService', () => {
  let service: StagedUploadService;
  let http: HttpTestingController;
  let progress: StagedUploadProgress;
  let auth: AuthServiceStub;
  let handoff: jasmine.Spy;
  const file = new File(['abcdefgh'], 'batch.zip');
  const endpoint = 'https://rest.api/api/core/uploads';
  const target = 'https://rest.api/api/system/scripts/import/processes';
  const upload: StagedUpload = {
    id: 'upload-id', name: file.name, size: 8, chunkSize: 4, receivedBytes: 0, state: 'UPLOADING',
    _links: {
      self: { href: endpoint + '/upload-id' },
      chunks: { href: endpoint + '/upload-id/chunks/{offset}' },
    },
  };
  const chunk = (offset: number) => endpoint + '/upload-id/chunks/' + offset;

  beforeEach(() => {
    auth = new AuthServiceStub();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideMockStore({}),
        { provide: Router, useClass: RouterStub },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HALEndpointService, useValue: { getEndpoint: () => of(endpoint) } },
        { provide: AuthService, useValue: auth },
      ],
    });
    service = TestBed.inject(StagedUploadService);
    http = TestBed.inject(HttpTestingController);
    handoff = jasmine.createSpy('handoff').and.returnValue(of(42));
    service.progress$.subscribe((value) => progress = value);
  });

  afterEach(() => http.verify());

  it('rejects an oversized file during the metadata preflight, before any file data or handoff', () => {
    const error = jasmine.createSpy('error');
    service.start(file, handoff).subscribe({ error });
    const create = http.expectOne(endpoint);
    expect(create.request.body).toEqual({ name: file.name, size: file.size });
    create.flush('Maximum file size exceeded', { status: 413, statusText: 'Payload Too Large' });
    http.expectNone((request) => request.method === 'PUT');
    expect(handoff).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(jasmine.objectContaining({ status: 413 }));
    expect(service.retained).toBeUndefined();
    expect(progress.loaded).toBe(0);
  });

  it('sends bounded sequential chunks and hands off once, after the final acknowledgement', () => {
    const result = jasmine.createSpy('result');
    service.start(file, handoff, { parameters: [] }).subscribe(result);
    http.expectOne(endpoint).flush(upload);
    expect(service.retained).toEqual({ file, context: { parameters: [] } });
    const first = http.expectOne(chunk(0));
    expect(first.request.method).toBe('PUT');
    expect(first.request.body.size).toBe(4);
    expect(first.request.reportProgress).toBeTrue();
    expect(first.request.withCredentials).toBeTrue();
    expect(first.request.headers.get('Content-Type')).toBe('application/octet-stream');
    http.expectNone(chunk(4));
    first.flush({ ...upload, receivedBytes: 4 });
    const second = http.expectOne(chunk(4));
    second.event({ type: HttpEventType.UploadProgress, loaded: 4, total: 4 });
    expect(progress.loaded).toBe(7);
    expect(handoff).not.toHaveBeenCalled();
    second.flush({ ...upload, receivedBytes: 8 });
    expect(progress.phase).toBe('starting');
    expect(progress.loaded).toBe(8);
    expect(progress.bytesPerSecond).toBeNull();
    expect(handoff).toHaveBeenCalledOnceWith(jasmine.objectContaining({ id: 'upload-id', receivedBytes: 8 }));
    expect(result).toHaveBeenCalledOnceWith(42);
    expect(service.retained).toBeUndefined();
  });

  it('averages actual transfer over a rolling window and reaches zero when stalled', fakeAsync(() => {
    const subscription = service.start(file, handoff).subscribe();
    http.expectOne(endpoint).flush(upload);
    const first = http.expectOne(chunk(0));
    expect(progress.bytesPerSecond).toBeNull();
    first.event({ type: HttpEventType.UploadProgress, loaded: 2, total: 4 });
    tick(1000);
    expect(progress.bytesPerSecond).toBe(2);
    first.event({ type: HttpEventType.UploadProgress, loaded: 4, total: 4 });
    first.flush({ ...upload, receivedBytes: 4 });
    const second = http.expectOne(chunk(4));
    second.event({ type: HttpEventType.UploadProgress, loaded: 2, total: 4 });
    tick(1000);
    expect(progress.bytesPerSecond).toBe(3);
    tick(5000);
    expect(progress.bytesPerSecond).toBe(0);
    subscription.unsubscribe();
    expect(second.cancelled).toBeTrue();
    expect(progress.bytesPerSecond).toBeNull();
  }));

  it('counts retransmitted bytes in speed but not twice in committed progress', fakeAsync(() => {
    const subscription = service.start(file, handoff).subscribe();
    http.expectOne(endpoint).flush(upload);
    const first = http.expectOne(chunk(0));
    first.event({ type: HttpEventType.UploadProgress, loaded: 4, total: 4 });
    first.flush('Lost response', { status: 503, statusText: 'Unavailable' });
    tick(1000);
    const retry = http.expectOne(chunk(0));
    retry.event({ type: HttpEventType.UploadProgress, loaded: 4, total: 4 });
    tick(1000);
    expect(progress.bytesPerSecond).toBe(4);
    retry.flush({ ...upload, receivedBytes: 4 });
    expect(progress.loaded).toBe(4);
    http.expectOne(chunk(4));
    subscription.unsubscribe();
  }));

  it('resumes from the server offset without counting previously uploaded bytes as speed', fakeAsync(() => {
    const firstAttempt = service.start(file, handoff).subscribe();
    http.expectOne(endpoint).flush(upload);
    http.expectOne(chunk(0)).flush({ ...upload, receivedBytes: 4 });
    http.expectOne(chunk(4));
    firstAttempt.unsubscribe();
    const resume = service.start(file, handoff).subscribe();
    http.expectOne(upload._links.self.href).flush({ ...upload, receivedBytes: 4 });
    http.expectNone(chunk(0));
    http.expectOne(chunk(4));
    tick(1000);
    expect(progress.loaded).toBe(4);
    expect(progress.bytesPerSecond).toBe(0);
    resume.unsubscribe();
  }));

  it('retries a lost handoff response, which the consuming endpoint answers with the same result', fakeAsync(() => {
    const client = TestBed.inject(HttpClient);
    const result = jasmine.createSpy('result');
    service.start(file, () => client.post<{ processId: number }>(target, {}).pipe(map((process) => process.processId)))
      .subscribe(result);
    http.expectOne(endpoint).flush({ ...upload, receivedBytes: 8 });
    http.expectOne(target).flush('Lost response', { status: 504, statusText: 'Timeout' });
    tick(1000);
    http.expectOne(target).flush({ processId: 42 });
    expect(result).toHaveBeenCalledOnceWith(42);
    http.expectNone(endpoint);
  }));

  it('skips the chunks of an upload the server already consumed and only hands off', () => {
    const result = jasmine.createSpy('result');
    service.start(file, handoff).subscribe(result);
    http.expectOne(endpoint).flush({ ...upload, receivedBytes: 8, state: 'CONSUMED', result: target + '/12' });
    http.expectNone((request) => request.method === 'PUT');
    expect(handoff).toHaveBeenCalledTimes(1);
    expect(result).toHaveBeenCalledOnceWith(42);
  });

  it('cancels the request before deleting staged data', () => {
    const subscription = service.start(file, handoff).subscribe();
    http.expectOne(endpoint).flush(upload);
    const request = http.expectOne(chunk(0));
    subscription.unsubscribe();
    service.cancel().subscribe();
    const deletion = http.expectOne(upload._links.self.href);
    expect(request.cancelled).toBeTrue();
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush(null);
    expect(service.retained).toBeUndefined();
    expect(progress.phase).toBe('idle');
  });

  it('uses the current JWT for each chunk through the existing authentication interceptor', () => {
    const subscription = service.start(file, handoff).subscribe();
    const create = http.expectOne(endpoint);
    expect(create.request.headers.get('authorization')).toBe('Bearer token_test');
    create.flush(upload);
    const first = http.expectOne(chunk(0));
    expect(first.request.headers.get('authorization')).toBe('Bearer token_test');
    auth.token.accessToken = 'renewed-jwt';
    first.flush({ ...upload, receivedBytes: 4 });
    const second = http.expectOne(chunk(4));
    expect(second.request.headers.getAll('authorization')).toEqual(['Bearer renewed-jwt']);
    subscription.unsubscribe();
  });

  it('reports JWT expiry between chunks without discarding the retained file and context', () => {
    const error = jasmine.createSpy('error');
    service.start(file, handoff, { collectionName: 'Theses' }).subscribe({ error });
    http.expectOne(endpoint).flush(upload);
    auth.setTokenAsExpired();
    http.expectOne(chunk(0)).flush({ ...upload, receivedBytes: 4 });
    http.expectNone(chunk(4));
    expect(error).toHaveBeenCalledWith(jasmine.objectContaining({ status: 401 }));
    expect(service.retained).toEqual({ file, context: { collectionName: 'Theses' } });
    expect(progress.bytesPerSecond).toBeNull();
  });
});
