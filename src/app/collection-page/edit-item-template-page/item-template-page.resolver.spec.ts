import { first } from 'rxjs/operators';

import { ItemTemplatePageResolver } from './item-template-page.resolver';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../shared/mocks/dso-name.service.mock';

describe('ItemTemplatePageResolver', () => {
  describe('resolve', () => {
    let resolver: ItemTemplatePageResolver;
    let itemTemplateService: any;
    let dsoNameService: DSONameServiceMock;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      itemTemplateService = {
        findByCollectionID: (id: string) => createSuccessfulRemoteDataObject$({ id })
      };
      dsoNameService = new DSONameServiceMock();
      resolver = new ItemTemplatePageResolver(dsoNameService as DSONameService, itemTemplateService);
    });

    it('should resolve an item template with the correct id', (done) => {
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
