/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { PaginatedList } from '../data/paginated-list.model';
import { RequestService } from '../data/request.service';
import { NotificationsService } from '../notification-system/notifications.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { createSuccessfulRemoteDataObject } from '../utilities/remote-data.utils';
import { EditItemDataService } from './edititem-data.service';
import { EditItemMode } from './models/edititem-mode.model';

describe('EditItemDataService', () => {

  let service: EditItemDataService;
  let requestService: RequestService;

  const requestServiceStub = jasmine.createSpyObj('RequestService', [
    'setStaleByHrefSubstring',
  ]);

  const rdbServiceStub = {} as RemoteDataBuildService;
  const objectCacheStub = {} as ObjectCacheService;
  const halServiceStub = {} as HALEndpointService;
  const notificationsServiceStub = {} as NotificationsService;

  const editModes: EditItemMode[] = [
    { uuid: 'mode-1', name: 'quickedit' } as EditItemMode,
    { uuid: 'mode-2', name: 'full' } as EditItemMode,
  ];

  const paginatedList = {
    page: editModes,
  } as PaginatedList<EditItemMode>;

  const successfulRD = createSuccessfulRemoteDataObject(paginatedList);

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        EditItemDataService,
        { provide: RequestService, useValue: requestServiceStub },
        { provide: RemoteDataBuildService, useValue: rdbServiceStub },
        { provide: ObjectCacheService, useValue: objectCacheStub },
        { provide: HALEndpointService, useValue: halServiceStub },
        { provide: NotificationsService, useValue: notificationsServiceStub },
      ],
    });

    service = TestBed.inject(EditItemDataService);

    spyOn((service as any).searchData, 'searchBy')
      .and.returnValue(of(successfulRD));
  });

  afterEach(() => {
    service = null;
  });


  describe('searchEditModesById', () => {

    it('should call SearchDataImpl.searchBy with correct parameters', () => {

      service.searchEditModesById('test-id').subscribe();

      expect((service as any).searchData.searchBy)
        .toHaveBeenCalled();
    });

    it('should return edit modes', () => {

      const result = service.searchEditModesById('test-id');

      const expected = cold('(a|)', { a: successfulRD });

      expect(result).toBeObservable(expected);
    });

  });

  describe('checkEditModeByIdAndType', () => {

    it('should return TRUE when edit mode exists', () => {

      const result = service.checkEditModeByIdAndType('test-id', 'mode-1');

      const expected = cold('(a|)', { a: true });

      expect(result).toBeObservable(expected);
    });

    it('should return FALSE when edit mode does not exist', () => {

      const result = service.checkEditModeByIdAndType('test-id', 'unknown-mode');

      const expected = cold('(a|)', { a: false });

      expect(result).toBeObservable(expected);
    });

  });

  describe('invalidateItemCache', () => {

    it('should mark requests as stale', () => {

      service.invalidateItemCache('1234');

      expect(requestServiceStub.setStaleByHrefSubstring)
        .toHaveBeenCalledWith('findModesById?uuid=1234');
    });

  });

});
