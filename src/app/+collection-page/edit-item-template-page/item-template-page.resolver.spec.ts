import { of as observableOf } from 'rxjs/internal/observable/of';
import { first } from 'rxjs/operators';
import { ItemTemplatePageResolver } from './item-template-page.resolver';

describe('ItemTemplatePageResolver', () => {
  describe('resolve', () => {
    let resolver: ItemTemplatePageResolver;
    let itemTemplateService: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      itemTemplateService = {
        findByCollectionID: (id: string) => observableOf({ payload: { id }, hasSucceeded: true })
      };
      resolver = new ItemTemplatePageResolver(itemTemplateService);
    });

    it('should resolve an item template with the correct id', () => {
      resolver.resolve({ params: { id: uuid } } as any, undefined)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.id).toEqual(uuid);
          }
        );
    });
  });
});
