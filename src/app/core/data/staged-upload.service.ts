import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@dspace/core/auth/auth.service';
import {
  BehaviorSubject,
  defer,
  interval,
  Observable,
  of,
  throwError,
  timer,
} from 'rxjs';
import {
  filter,
  finalize,
  retry,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { HALEndpointService } from '../shared/hal-endpoint.service';

/** Server-confirmed state of an owner-bound staged upload (REST resource `/api/core/uploads`). */
export interface StagedUpload {
  id: string;
  name: string;
  size: number;
  chunkSize: number;
  receivedBytes: number;
  state: 'UPLOADING' | 'CONSUMING' | 'CONSUMED' | 'FAILED';
  /** Link of the resource a consuming endpoint created from this upload, once recorded. */
  result?: string;
  _links: {
    self: { href: string };
    chunks: { href: string };
    result?: { href: string };
  };
}

/** Upload progress is separate from the progress of whatever consumes the file. */
export interface StagedUploadProgress {
  phase: 'idle' | 'uploading' | 'starting';
  loaded: number;
  total: number;
  /** Approximate browser-observed transfer rate, averaged over the last five seconds. */
  bytesPerSecond: number | null;
}

/** What is kept for a retry: the File and whatever the caller attached to it, such as import settings. */
export interface RetainedUpload<C = unknown> {
  file: File;
  context?: C;
}

/**
 * Stage large files as bounded requests through the normal JWT and CSRF interceptors, then let the
 * caller consume the staged upload through the target's own endpoint. Retain the selected File and
 * upload receipt during navigation and recover committed progress after a transient error.
 * Browser reload persistence is intentionally not provided.
 */
@Injectable({ providedIn: 'root' })
export class StagedUploadService {
  private readonly progress = new BehaviorSubject<StagedUploadProgress>({ phase: 'idle', loaded: 0, total: 0, bytesPerSecond: null });
  public readonly progress$ = this.progress.asObservable();
  private current?: { file: File; upload: StagedUpload; context?: unknown };
  private busy = false;
  private transferredBytes = 0;

  constructor(private http: HttpClient, private halService: HALEndpointService, private auth: AuthService) {
  }

  /** The upload retained for a retry, including after an authentication redirect. */
  public get retained(): RetainedUpload | undefined {
    return this.current ? { file: this.current.file, context: this.current.context } : undefined;
  }

  /**
   * Stage a file in bounded chunks, then let the caller consume it and return the caller's result.
   * Calling again for the same File recovers server-confirmed progress before continuing. The consuming
   * endpoint answers a repeated handoff with the same result, so repeating it after a lost response is safe.
   * @param file the file to stage
   * @param handoff consumes the complete upload through the target's endpoint, once
   * @param context retained alongside the file, for example the settings the handoff needs after a re-login
   */
  public start<T>(file: File, handoff: (upload: StagedUpload) => Observable<T>, context?: unknown): Observable<T> {
    return defer(() => {
      if (this.busy) {
        return throwError(() => new Error('A staged upload is already in progress'));
      }
      this.busy = true;
      this.transferredBytes = 0;
      this.progress.next({ phase: 'uploading', loaded: 0, total: file.size, bytesPerSecond: null });
      // Sample even when no progress events arrive: a stalled transfer must not retain an old speed.
      const samples = [{ time: Date.now(), bytes: 0 }];
      const speedSubscription = interval(1000).subscribe(() => {
        const now = Date.now();
        samples.push({ time: now, bytes: this.transferredBytes });
        while (samples.length > 2 && samples[1].time <= now - 5000) {
          samples.shift();
        }
        const elapsed = now - samples[0].time;
        this.progress.next({
          ...this.progress.value,
          bytesPerSecond: elapsed > 0 ? (this.transferredBytes - samples[0].bytes) * 1000 / elapsed : null,
        });
      });
      const upload$ = this.current?.file === file
        ? this.authenticated(this.http.get<StagedUpload>(this.current.upload._links.self.href, { withCredentials: true }))
        : this.create(file, context);
      return upload$.pipe(
        tap((upload) => {
          if (this.current?.file !== file) {
            this.current = { file, upload, context };
          } else {
            this.current.upload = upload;
          }
        }),
        switchMap((upload) => this.sendChunks(file, upload)),
        switchMap((upload) => {
          speedSubscription.unsubscribe();
          this.progress.next({ phase: 'starting', loaded: file.size, total: file.size, bytesPerSecond: null });
          return handoff(upload).pipe(this.retryRequest());
        }),
        tap(() => this.current = undefined),
        finalize(() => {
          speedSubscription.unsubscribe();
          this.busy = false;
          this.progress.next({ ...this.progress.value, bytesPerSecond: null });
        }),
      );
    });
  }

  /** Cancel staged data; anything an earlier handoff created continues independently. */
  public cancel(): Observable<void> {
    if (!this.current || this.busy) {
      return of(undefined);
    }
    return this.authenticated(this.http.delete<void>(this.current.upload._links.self.href, { withCredentials: true })).pipe(
      tap(() => {
        this.current = undefined;
        this.progress.next({ phase: 'idle', loaded: 0, total: 0, bytesPerSecond: null });
      }),
    );
  }

  private create(file: File, context?: unknown): Observable<StagedUpload> {
    return this.halService.getEndpoint('uploads').pipe(
      take(1),
      switchMap((endpoint: string) => this.authenticated(
        this.http.post<StagedUpload>(endpoint, { name: file.name, size: file.size }, { withCredentials: true }))),
      tap((upload) => this.current = { file, upload, context }),
    );
  }

  private sendChunks(file: File, upload: StagedUpload): Observable<StagedUpload> {
    if (upload.result != null || upload.receivedBytes === file.size) {
      return of(upload);
    }
    if (upload.state !== 'UPLOADING' || upload.chunkSize <= 0 || upload.receivedBytes < 0
      || upload.receivedBytes >= file.size || upload.size !== file.size) {
      return throwError(() => new Error('Invalid staged upload state'));
    }
    const offset = upload.receivedBytes;
    const end = Math.min(offset + upload.chunkSize, file.size);
    const endpoint = upload._links.chunks.href.replace('{offset}', String(offset));
    let attemptLoaded = 0;
    return this.authenticated(this.http.put<StagedUpload>(endpoint, file.slice(offset, end), {
      headers: { 'Content-Type': 'application/octet-stream' },
      withCredentials: true,
      observe: 'events',
      reportProgress: true,
    })).pipe(
      this.retryRequest(),
      tap((event) => {
        if (event.type === HttpEventType.Sent) {
          attemptLoaded = 0;
          this.progress.next({ ...this.progress.value, loaded: offset });
        } else if (event.type === HttpEventType.UploadProgress) {
          const loaded = Math.min(event.loaded, end - offset);
          this.transferredBytes += Math.max(0, loaded - attemptLoaded);
          attemptLoaded = Math.max(attemptLoaded, loaded);
          // Reserve 100% for the server's acknowledgement of the final chunk.
          this.progress.next({ ...this.progress.value, loaded: Math.min(offset + loaded, file.size - 1) });
        }
      }),
      filter((event): event is HttpResponse<StagedUpload> => event instanceof HttpResponse),
      switchMap((response) => {
        const next = response.body;
        if (!next || next.receivedBytes < end || next.receivedBytes > file.size) {
          return throwError(() => new Error('The chunk was not committed'));
        }
        this.current.upload = next;
        // Some browsers emit no intermediate progress for small chunks.
        this.transferredBytes += end - offset - attemptLoaded;
        this.progress.next({ ...this.progress.value, loaded: next.receivedBytes });
        return this.sendChunks(file, next);
      }),
    );
  }

  /** Surface expiry as a resumable error before the normal interceptor suppresses the request. */
  private authenticated<T>(request: Observable<T>): Observable<T> {
    return defer(() => {
      if (!this.auth.getToken()?.accessToken || this.auth.isTokenExpired()) {
        return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Authentication required' }));
      }
      return request;
    });
  }

  /** Retry only bounded/idempotent operations; a renewed JWT is picked up on resubscription. */
  private retryRequest<T>() {
    const previousToken = this.auth.getToken()?.accessToken;
    return retry<T>({
      count: 2,
      delay: (error: unknown, attempt) => {
        if (!(error instanceof HttpErrorResponse)) {
          return throwError(() => error);
        }
        if ([0, 408, 429, 502, 503, 504].includes(error.status)
          || (error.status === 401 && this.auth.getToken()?.accessToken !== previousToken)) {
          return timer(attempt * 1000);
        }
        return throwError(() => error);
      },
    });
  }
}
