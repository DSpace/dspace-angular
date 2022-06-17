import { first } from 'rxjs/operators';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { ItemPageResolver } from './item-page.resolver';


describe('ItemPageResolver', () => {
  describe('resolve', () => {
    let resolver: ItemPageResolver;
    let itemService: ItemDataService;
    let store;
    let router;
    const uuid = '1234-65487-12354-1235';
    const item = Object.assign(new Item(), {
      id: uuid,
      metadata: {
        'cris.customurl': [
          {
            value: 'customurl',
          }
        ],
        'dspace.entity.type': [
          {
            value: 'Person'
          }
        ]
      }
    });

    beforeEach(() => {
      itemService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$(item)
      } as any;

      store = jasmine.createSpyObj('store', {
        dispatch: {},
      });

      router = jasmine.createSpyObj('Router', {
        navigateByUrl: jasmine.createSpy('navigateByUrl')
      });

      resolver = new ItemPageResolver(itemService, store, router);
    });

    it('should resolve a an item from from the workflow item with the correct id', (done) => {
      resolver.resolve({ params: { id: uuid } } as any, { url: 'test-url/1234-65487-12354-1235' } as any)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(router.navigateByUrl).toHaveBeenCalledWith('test-url/customurl');
            done();
          }
        );
    });
  });
});
