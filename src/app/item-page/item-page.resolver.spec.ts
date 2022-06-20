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
      uuid: uuid,
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
    const noMetadataItem = Object.assign(new Item(), {
      id: uuid,
      uuid: uuid,
      metadata: {
        'dspace.entity.type': [
          {
            value: 'Person'
          }
        ]
      }
    });

    describe('When item has custom url', () => {

      beforeEach(() => {

        itemService = {
          findById: (id: string) => createSuccessfulRemoteDataObject$(item)
        } as any;

        // (itemService.findById as any).and.returnValue(createSuccessfulRemoteDataObject$(item));

        store = jasmine.createSpyObj('store', {
          dispatch: {},
        });

        router = jasmine.createSpyObj('Router', {
          navigateByUrl: jasmine.createSpy('navigateByUrl')
        });

        resolver = new ItemPageResolver(itemService, store, router);
      });

      it('should resolve a an item from from the item with the url redirect', (done) => {
        resolver.resolve({ params: { id: uuid } } as any, { url: 'test-url/1234-65487-12354-1235' } as any)
          .pipe(first())
          .subscribe(
            (resolved) => {
              expect(router.navigateByUrl).toHaveBeenCalledWith('test-url/customurl');
              done();
            }
          );
      });

      it('should resolve a an item from from the item with the url redirect subroute', (done) => {
        resolver.resolve({ params: { id: uuid } } as any, { url: 'test-url/1234-65487-12354-1235/edit' } as any)
          .pipe(first())
          .subscribe(
            (resolved) => {
              expect(router.navigateByUrl).toHaveBeenCalledWith('test-url/customurl/edit');
              done();
            }
          );
      });

      it('should resolve a an item from from the item with the url custom url and should not redirect', (done) => {
        resolver.resolve({ params: { id: 'customurl' } } as any, { url: '/entities/person/customurl' } as any)
          .pipe(first())
          .subscribe(
            (resolved) => {
              expect(router.navigateByUrl).not.toHaveBeenCalledWith('/entities/person/customurl');
              done();
            }
          );
      });

      it('should resolve a an item from from the item with the url custom url and should not redirect', (done) => {
        resolver.resolve({ params: { id: 'customurl' } } as any, { url: '/entities/person/customurl/edit' } as any)
          .pipe(first())
          .subscribe(
            (resolved) => {
              expect(router.navigateByUrl).not.toHaveBeenCalledWith('/entities/person/customurl/edit');
              done();
            }
          );
      });

    });

    describe('When item has no custom url', () => {

      beforeEach(() => {

        itemService = {
          findById: (id: string) => createSuccessfulRemoteDataObject$(noMetadataItem)
        } as any;

        store = jasmine.createSpyObj('store', {
          dispatch: {},
        });

        router = jasmine.createSpyObj('Router', {
          navigateByUrl: jasmine.createSpy('navigateByUrl')
        });

        resolver = new ItemPageResolver(itemService, store, router);
      });

      it('should not call custom url', (done) => {
        resolver.resolve({ params: { id: uuid } } as any, { url: 'test-url/1234-65487-12354-1235/edit' } as any)
          .pipe(first())
          .subscribe(
            (resolved) => {
              expect(router.navigateByUrl).toHaveBeenCalledWith('/entities/person/1234-65487-12354-1235/edit');
              done();
            }
          );
      });

    });

  });
});
