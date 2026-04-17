import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { itemTemplatePageResolver } from './item-template-page.resolver';

describe('itemTemplatePageResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let itemTemplateService: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      itemTemplateService = {
        findByCollectionID: (id: string) => createSuccessfulRemoteDataObject$({ id }),
      };
      resolver = itemTemplatePageResolver;
    });

    it('should resolve an item template with the correct id', (done) => {
      (resolver({ params: { id: uuid } } as any, undefined, itemTemplateService) as Observable<any>)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.id).toEqual(uuid);
            done();
          },
        );
    });
  });
});
