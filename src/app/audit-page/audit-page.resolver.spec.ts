import { first } from 'rxjs/operators';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { AuditPageResolver } from './audit-page.resolver';

describe('AuditPageResolver', () => {
  describe('resolve', () => {
    let resolver: AuditPageResolver;
    let auditService: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      auditService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$({ id })
      };
      resolver = new AuditPageResolver(auditService);
    });

    it('should resolve an audit with the correct id', (done) => {
      resolver.resolve({ params: { id: uuid } } as any, undefined)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.id).toEqual(uuid);
            done();
          }
        );
    });
  });
});
