import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { CollectionDataService } from '../core/data/collection-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Collection } from '../core/shared/collection.model';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { bulkImportPageResolver } from './bulk-import-page.resolver';

describe('bulkImportPageResolver', () => {
  let collectionService: any;

  beforeEach(() => {
    collectionService = {
      findById: jasmine.createSpy('findById').and.callFake((id: string) => createSuccessfulRemoteDataObject$({ id })),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: CollectionDataService, useValue: collectionService },
      ],
    });
  });

  it('should resolve a collection with the correct id', (done) => {
    const uuid = '1234-65487-12354-1235';
    const obs = TestBed.runInInjectionContext(() => {
      return bulkImportPageResolver({ params: { id: uuid } } as any, undefined);
    }) as Observable<RemoteData<Collection>>;

    obs.pipe(first()).subscribe((resolved) => {
      expect(resolved.payload.id).toEqual(uuid);
      done();
    });
  });
});
