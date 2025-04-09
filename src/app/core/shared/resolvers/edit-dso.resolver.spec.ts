import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { Observable } from 'rxjs';

import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { CollectionDataService } from '../../data/collection-data.service';
import { RemoteData } from '../../data/remote-data';
import { Collection } from '../collection.model';
import { editCollectionResolver } from './edit-collection.resolver';

describe('editDsoResolver', () => {
  let collectionService: jasmine.SpyObj<CollectionDataService>;
  let uuid: string;
  let testCollection: Collection;
  let currentUrl: string;

  beforeEach(() => {
    uuid = '1234-65487-12354-1235';
    testCollection = Object.assign(new Collection(), { uuid });
    currentUrl = 'collection/1234-65487-12354-1235/edit/metadata';

    collectionService = jasmine.createSpyObj('CollectionDataService', ['findByIdWithProjections']);
    collectionService.findByIdWithProjections.and.returnValue(createSuccessfulRemoteDataObject$(testCollection));

    TestBed.configureTestingModule({
      providers: [
        { provide: CollectionDataService, useValue: collectionService },
      ],
    });
  });

  it('should resolve a collection from the id and by passing the projections', waitForAsync(() => {
    const resolvedConfig = TestBed.runInInjectionContext(() => {
      return editCollectionResolver(
        { params: { id: uuid } } as any,
        { url: currentUrl } as any,
      );
    }) as Observable<RemoteData<Collection>>;

    resolvedConfig.subscribe((response) => {
      expect(response).toEqual(createSuccessfulRemoteDataObject(testCollection));
    });
  }));
});
