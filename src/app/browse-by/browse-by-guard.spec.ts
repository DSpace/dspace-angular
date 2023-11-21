import { first } from 'rxjs/operators';
import { BrowseByGuard } from './browse-by-guard';
import { of as observableOf } from 'rxjs';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { BrowseByDataType } from './browse-by-switcher/browse-by-decorator';
import { ValueListBrowseDefinition } from '../core/shared/value-list-browse-definition.model';
import { DSONameServiceMock } from '../shared/mocks/dso-name.service.mock';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { RouterStub } from '../shared/testing/router.stub';

describe('BrowseByGuard', () => {
  describe('canActivate', () => {
    let guard: BrowseByGuard;
    let dsoService: any;
    let translateService: any;
    let browseDefinitionService: any;
    let router: any;

    const name = 'An interesting DSO';
    const title = 'Author';
    const field = 'Author';
    const id = 'author';
    const scope = '1234-65487-12354-1235';
    const value = 'Filter';
    const browseDefinition = Object.assign(new ValueListBrowseDefinition(), { type: BrowseByDataType.Metadata, metadataKeys: ['dc.contributor'] });

    beforeEach(() => {
      dsoService = {
        findById: (dsoId: string) => observableOf({ payload: { name: name }, hasSucceeded: true })
      };

      translateService = {
        instant: () => field
      };

      browseDefinitionService = {
        findById: () => createSuccessfulRemoteDataObject$(browseDefinition)
      };

      router = new RouterStub() as any;

      guard = new BrowseByGuard(dsoService, translateService, browseDefinitionService, new DSONameServiceMock() as DSONameService, router);
    });

    it('should return true, and sets up the data correctly, with a scope and value', () => {
      const scopedRoute = {
        data: {
          title: field,
          browseDefinition,
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
              browseDefinition,
              collection: name,
              field,
              value: '"' + value + '"'
            };
            expect(scopedRoute.data).toEqual(result);
            expect(router.navigate).not.toHaveBeenCalled();
            expect(canActivate).toEqual(true);
          }
        );
    });

    it('should return true, and sets up the data correctly, with a scope and without value', () => {
      const scopedNoValueRoute = {
        data: {
          title: field,
          browseDefinition,
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
              browseDefinition,
              collection: name,
              field,
              value: ''
            };
            expect(scopedNoValueRoute.data).toEqual(result);
            expect(router.navigate).not.toHaveBeenCalled();
            expect(canActivate).toEqual(true);
          }
        );
    });

    it('should return true, and sets up the data correctly, without a scope and with a value', () => {
      const route = {
        data: {
          title: field,
          browseDefinition,
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
              browseDefinition,
              collection: '',
              field,
              value: '"' + value + '"'
            };
            expect(route.data).toEqual(result);
            expect(router.navigate).not.toHaveBeenCalled();
            expect(canActivate).toEqual(true);
          }
        );
    });

    it('should return false, and sets up the data correctly, without a scope and with a value', () => {
      jasmine.getEnv().allowRespy(true);
      spyOn(browseDefinitionService, 'findById').and.returnValue(createFailedRemoteDataObject$());
      const scopedRoute = {
        data: {
          title: field,
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
        .subscribe((canActivate) => {
          expect(router.navigate).toHaveBeenCalled();
          expect(canActivate).toEqual(false);
        });
    });
  });
});
