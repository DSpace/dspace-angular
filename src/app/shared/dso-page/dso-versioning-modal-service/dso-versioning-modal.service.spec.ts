import {
  fakeAsync,
  flush,
  waitForAsync,
} from '@angular/core/testing';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { Item } from '@dspace/core/shared/item.model';
import { MetadataMap } from '@dspace/core/shared/metadata.models';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { Version } from '@dspace/core/shared/version.model';
import { WorkspaceItem } from '@dspace/core/submission/models/workspaceitem.model';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  of,
  Subject,
} from 'rxjs';

import { createRelationshipsObservable } from '../../../item-page/simple/item-types/shared/item.component.spec';
import { DsoVersioningModalService } from './dso-versioning-modal.service';

describe('DsoVersioningModalService', () => {
  let service: DsoVersioningModalService;
  let modalService;
  let versionService;
  let versionHistoryService;
  let itemVersionShared;
  let router;
  let workspaceItemDataService;
  let itemService;

  let createVersionEvent$: Subject<string>;


  const mockItem: Item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
    metadata: new MetadataMap(),
    relationships: createRelationshipsObservable(),
    _links: {
      self: {
        href: 'item-href',
      },
      version: {
        href: 'version-href',
      },
    },
  });

  const mockVersion = Object.assign(new Version(), {
    _links: {
      self: {
        href: 'version-href',
      },
      item: {
        href: 'item-href',
      },
    },
  });

  beforeEach(waitForAsync(() => {
    createVersionEvent$ = new Subject<string>();
    modalService = jasmine.createSpyObj('modalService', {
      open: {
        componentInstance: { firstVersion: {}, versionNumber: {}, createVersionEvent: createVersionEvent$.asObservable() },
        close: jasmine.createSpy('close'),
      },
    });
    versionService = jasmine.createSpyObj('versionService', {
      findByHref: createSuccessfulRemoteDataObject$<Version>(new Version()),
      invalidateVersionHrefCache: undefined,
    });
    versionHistoryService = jasmine.createSpyObj('versionHistoryService', {
      createVersion: createSuccessfulRemoteDataObject$<Version>(mockVersion),
      hasDraftVersion$: of(false),
    });
    itemVersionShared = jasmine.createSpyObj('itemVersionShared', ['notifyCreateNewVersion']);
    router = jasmine.createSpyObj('router', ['navigateByUrl']);
    workspaceItemDataService = jasmine.createSpyObj('workspaceItemDataService', ['findByItem']);
    workspaceItemDataService.findByItem.and.returnValue(createSuccessfulRemoteDataObject$<WorkspaceItem>(new WorkspaceItem()));

    itemService = jasmine.createSpyObj('itemService', ['findByHref', 'invalidateFindByCustomUrlCache']);
    itemService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$<Item>(mockItem));

    service = new DsoVersioningModalService(
      modalService,
      versionService,
      versionHistoryService,
      itemVersionShared,
      router,
      workspaceItemDataService,
      itemService,
    );
  }));
  describe('when onCreateNewVersion() is called', () => {
    it('should call versionService.findByHref', () => {
      service.openCreateVersionModal(mockItem);
      expect(versionService.findByHref).toHaveBeenCalledWith('version-href');
    });
  });

  describe('isNewVersionButtonDisabled', () => {
    it('should call versionHistoryService.hasDraftVersion$', () => {
      service.isNewVersionButtonDisabled(mockItem);
      expect(versionHistoryService.hasDraftVersion$).toHaveBeenCalledWith(mockItem._links.version.href);
    });
  });

  describe('getVersioningTooltipMessage', () => {
    it('should return the create message when isNewVersionButtonDisabled returns false', (done) => {
      spyOn(service, 'isNewVersionButtonDisabled').and.returnValue(of(false));
      service.getVersioningTooltipMessage(mockItem, 'draft-message', 'create-message').subscribe((message) => {
        expect(message).toEqual('create-message');
        done();
      });
    });
    it('should return the draft message when isNewVersionButtonDisabled returns true', (done) => {
      spyOn(service, 'isNewVersionButtonDisabled').and.returnValue(of(true));
      service.getVersioningTooltipMessage(mockItem, 'draft-message', 'create-message').subscribe((message) => {
        expect(message).toEqual('draft-message');
        done();
      });
    });
  });

  describe('version modal', () => {
    it('should invalidate version href cache after a successful create', fakeAsync(() => {
      service.openCreateVersionModal(mockItem);
      createVersionEvent$.next('summary');
      flush();
      expect(versionService.invalidateVersionHrefCache).toHaveBeenCalledWith(mockItem);
      expect(itemService.invalidateFindByCustomUrlCache).not.toHaveBeenCalled();
    }));

    it('should invalidate findByCustomUrl cache when item has dspace.customurl metadata', fakeAsync(() => {
      const itemWithCustomUrl: Item = Object.assign(new Item(), mockItem, {
        metadata: Object.assign(new MetadataMap(), {
          'dspace.customurl': [{ value: 'my-custom-url' }],
        }),
      });
      service.openCreateVersionModal(itemWithCustomUrl);
      createVersionEvent$.next('summary');
      flush();
      expect(versionService.invalidateVersionHrefCache).toHaveBeenCalledWith(itemWithCustomUrl);
      expect(itemService.invalidateFindByCustomUrlCache).toHaveBeenCalledWith('my-custom-url');
    }));
  });
});
