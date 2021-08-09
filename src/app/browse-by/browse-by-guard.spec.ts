import { first } from 'rxjs/operators';
import { BrowseByGuard } from './browse-by-guard';
import { of as observableOf } from 'rxjs';

describe('BrowseByGuard', () => {
  describe('canActivate', () => {
    let guard: BrowseByGuard;
    let dsoService: any;
    let translateService: any;

    const name = 'An interesting DSO';
    const title = 'Author';
    const field = 'Author';
    const id = 'author';
    const metadataField = 'dc.contributor';
    const scope = '1234-65487-12354-1235';
    const value = 'Filter';

    beforeEach(() => {
      dsoService = {
        findById: (dsoId: string) => observableOf({ payload: { name: name }, hasSucceeded: true })
      };

      translateService = {
        instant: () => field
      };
      guard = new BrowseByGuard(dsoService, translateService);
    });

    it('should return true, and sets up the data correctly, with a scope and value', () => {
      const scopedRoute = {
        data: {
          title: field,
          metadataField,
        },
        params: {
          id,
        },
        queryParams: {
          scope,
          value
        }
      };
      guard.canActivate(scopedRoute as any, undefined)
        .pipe(first())
        .subscribe(
          (canActivate) => {
            const result = {
              title,
              id,
              metadataField,
              collection: name,
              field,
              value: '"' + value + '"'
            };
            expect(scopedRoute.data).toEqual(result);
            expect(canActivate).toEqual(true);
          }
        );
    });

    it('should return true, and sets up the data correctly, with a scope and without value', () => {
      const scopedNoValueRoute = {
        data: {
          title: field,
          metadataField,
        },
        params: {
          id,
        },
        queryParams: {
          scope
        }
      };

      guard.canActivate(scopedNoValueRoute as any, undefined)
        .pipe(first())
        .subscribe(
          (canActivate) => {
            const result = {
              title,
              id,
              metadataField,
              collection: name,
              field,
              value: ''
            };
            expect(scopedNoValueRoute.data).toEqual(result);
            expect(canActivate).toEqual(true);
          }
        );
    });

    it('should return true, and sets up the data correctly, without a scope and with a value', () => {
      const route = {
        data: {
          title: field,
          metadataField,
        },
        params: {
          id,
        },
        queryParams: {
          value
        }
      };
      guard.canActivate(route as any, undefined)
        .pipe(first())
        .subscribe(
          (canActivate) => {
            const result = {
              title,
              id,
              metadataField,
              collection: '',
              field,
              value: '"' + value + '"'
            };
            expect(route.data).toEqual(result);
            expect(canActivate).toEqual(true);
          }
        );
    });
  });
});
