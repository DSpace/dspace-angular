import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { AuditDataService } from '../core/audit/audit-data.service';
import { Audit } from '../core/audit/model/audit.model';
import { RemoteData } from '../core/data/remote-data';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { auditPageResolver } from './audit-page.resolver';

describe('auditPageResolver', () => {
  let auditService: any;

  beforeEach(() => {
    auditService = {
      findById: jasmine.createSpy('findById').and.callFake((id: string) => createSuccessfulRemoteDataObject$({ id })),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuditDataService, useValue: auditService },
      ],
    });
  });

  it('should resolve an audit with the correct id', (done) => {
    const uuid = '1234-65487-12354-1235';
    const obs = TestBed.runInInjectionContext(() => {
      return auditPageResolver({ params: { id: uuid } } as any, undefined);
    }) as Observable<RemoteData<Audit>>;

    obs.pipe(first()).subscribe((resolved) => {
      expect(resolved.payload.id).toEqual(uuid);
      done();
    });
  });
});
