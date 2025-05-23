import { first } from 'rxjs/operators';

import { ValueListBrowseDefinition } from '../core/shared/value-list-browse-definition.model';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../shared/remote-data.utils';
import { RouterStub } from '../shared/testing/router.stub';
import { browseByGuard } from './browse-by-guard';
import { BrowseByDataType } from './browse-by-switcher/browse-by-data-type';

describe('browseByGuard', () => {
  describe('canActivate', () => {
    let guard: any;
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
      translateService = {
        instant: () => field,
      };

      browseDefinitionService = {
        findById: () => createSuccessfulRemoteDataObject$(browseDefinition),
      };

      router = new RouterStub() as any;

      guard = browseByGuard;
    });

    it('should return true, and sets up the data correctly, with a scope and value', () => {
      const scopedRoute = {
        data: {
          title: field,
          browseDefinition,
        },
        parent: null,
        params: {
          id,
        },
        queryParams: {
          scope,
          value,
        },
      };
      guard(scopedRoute as any, undefined, browseDefinitionService, router, translateService)
        .pipe(first())
        .subscribe(
          (canActivate) => {
            const result = {
              title,
              id,
              browseDefinition,
              scope,
              field,
              value: '"' + value + '"',
            };
            expect(scopedRoute.data).toEqual(result);
            expect(router.navigate).not.toHaveBeenCalled();
            expect(canActivate).toEqual(true);
          },
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
          scope,
        },
      };

      guard(scopedNoValueRoute, undefined, browseDefinitionService, router, translateService)
        .pipe(first())
        .subscribe(
          (canActivate) => {
            const result = {
              title,
              id,
              browseDefinition,
              scope,
              field,
              value: '',
            };
            expect(scopedNoValueRoute.data).toEqual(result);
            expect(router.navigate).not.toHaveBeenCalled();
            expect(canActivate).toEqual(true);
          },
        );
    });

    it('should return true, and sets up the data correctly using the community/collection page id, with a scope and without value', () => {
      const scopedNoValueRoute = {
        data: {
          title: field,
          browseDefinition,
        },
        parent: {
          params: {
            id: scope,
          },
        },
        params: {
          id,
        },
        queryParams: {
        },
      };

      guard(scopedNoValueRoute as any, undefined, browseDefinitionService, router, translateService).pipe(
        first(),
      ).subscribe((canActivate) => {
        const result = {
          title,
          id,
          browseDefinition,
          scope,
          field,
          value: '',
        };
        expect(scopedNoValueRoute.data).toEqual(result);
        expect(router.navigate).not.toHaveBeenCalled();
        expect(canActivate).toEqual(true);
      });
    });

    it('should return true, and sets up the data correctly, without a scope and with a value', () => {
      const route = {
        data: {
          title: field,
          browseDefinition,
        },
        parent: null,
        params: {
          id,
        },
        queryParams: {
          value,
        },
      };

      guard(route as any, undefined, browseDefinitionService, router, translateService)
        .pipe(first())
        .subscribe(
          (canActivate) => {
            const result = {
              title,
              id,
              browseDefinition,
              scope: undefined,
              field,
              value: '"' + value + '"',
            };
            expect(route.data).toEqual(result);
            expect(router.navigate).not.toHaveBeenCalled();
            expect(canActivate).toEqual(true);
          },
        );
    });

    it('should return false, and sets up the data correctly, without a scope and with a value', () => {
      jasmine.getEnv().allowRespy(true);
      spyOn(browseDefinitionService, 'findById').and.returnValue(createFailedRemoteDataObject$());
      const scopedRoute = {
        data: {
          title: field,
        },
        parent: null,
        params: {
          id,
        },
        queryParams: {
          scope,
          value,
        },
      };

      guard(scopedRoute as any, undefined, browseDefinitionService, router, translateService)
        .pipe(first())
        .subscribe((canActivate) => {
          expect(router.navigate).toHaveBeenCalled();
          expect(canActivate).toEqual(false);
        });
    });
  });
});
