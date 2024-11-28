import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { BrowseEntrySearchOptions } from './browse-entry-search-options.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { SearchManager } from './search-manager';
import { toRemoteData } from '../../browse-by/browse-by-metadata-page/browse-by-metadata-page.component.spec';
import { Item } from '../shared/item.model';
import { FindListOptions } from '../data/find-list-options.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { of } from 'rxjs';
import { MetadataValue } from '../shared/metadata.models';
import { v4 as uuidv4 } from 'uuid';
import { AUTHORITY_REFERENCE } from '../shared/metadata.utils';
import { ITEM } from '../shared/item.resource-type';

describe('SearchManager', () => {
  let scheduler: TestScheduler;
  let service: SearchManager;
  const validAuthority = uuidv4();
  const validAuthority2 = uuidv4();
  const validAuthority3 = uuidv4();

  const firstPublication = Object.assign(new Item(), {
    id: '13a4a8c3-3b94-4797-863d-b831f360cc60',
    entityType: 'Publication',
    metadata: {
      'dc.contributor.author': [
        Object.assign(new MetadataValue(), {
          authority: validAuthority,
          value: 'author1'
        })

      ]
    },
    type: ITEM.value
  });

  const secondPublication = Object.assign(new Item(), {
    id: 'fea951e1-7e5d-4b10-a152-ddeb3daec0ea',
    entityType: 'Publication',
    metadata: {
      'dc.contributor.author': [
        Object.assign(new MetadataValue(), {
          authority: validAuthority2,
          value: 'author2'
        })
      ]
    },
    type: ITEM.value
  });

  const firstProject = Object.assign(new Item(), {
    id: '32df7096-f161-40d0-b283-6fff6ffe8507',
    entityType: 'Project',
    metadata: {
      'dc.contributor.author': [
        Object.assign(new MetadataValue(), {
          authority: validAuthority3,
          value: 'author3'
        })
      ]
    },
    type: ITEM.value
  });

  const thirdPublication = Object.assign(new Item(), {
    id: '13c81669-0468-41af-b8c9-cdc51779c983',
    entityType: 'Publication',
    metadata: {
      'dc.contributor.author': [
        Object.assign(new MetadataValue(),{
          value: 'author4'
        })

      ]
    },
    type: ITEM.value
  });

  const invalidAuthorityPublication = Object.assign(new Item(), {
    id: '13c81669-0468-41af-b8c9-cdc51779c983',
    entityType: 'Publication',
    metadata: {
      'dc.contributor.author': [
        Object.assign(new MetadataValue(),{
          authority: AUTHORITY_REFERENCE + 'invalid',
          value: 'author4'
        })

      ]
    },
    type: ITEM.value
  });

  const mockBrowseService: any = {
    getBrowseItemsFor: (options: BrowseEntrySearchOptions) =>
      toRemoteData([firstPublication, secondPublication, firstProject]),
    getBrowseItemsForAuthority: () =>
      createSuccessfulRemoteDataObject$(createPaginatedList([firstPublication, secondPublication, firstProject]))
  };

  const mockItemService: any = {
    findAllById: (uuidList: string[], options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Item>[]) =>
      of(createSuccessfulRemoteDataObject(createPaginatedList([])))
  };

  const mockSearchService: any = {
    search: (options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Item>[]) =>
      of(createSuccessfulRemoteDataObject(createPaginatedList([])))
  };

  function initTestService() {
    return new SearchManager(mockItemService, mockBrowseService, mockSearchService);
  }

  beforeEach(() => {
    scheduler = getTestScheduler();
  });

  describe('getBrowseItemsFor', () => {

    beforeEach(() => {
      service = initTestService();
      spyOn(mockBrowseService, 'getBrowseItemsFor').and.callThrough();
      spyOn(mockItemService, 'findAllById').and.callThrough();
    });

    it('should proxy to browseService and follow metadata', () => {

      const filterValue = 'filterValue';
      const filterAuthority = null;
      const browseOptions: BrowseEntrySearchOptions = Object.assign({}, { projection: 'preventMetadataSecurity' }) as BrowseEntrySearchOptions;
      const followLink: FollowLinkConfig<any> = {} as any;

      scheduler.schedule(() => service.getBrowseItemsFor(filterValue, filterAuthority, browseOptions, followLink).subscribe());
      scheduler.flush();

      expect(mockBrowseService.getBrowseItemsFor).toHaveBeenCalledWith(filterValue, null, browseOptions, followLink);
      expect(mockItemService.findAllById).toHaveBeenCalledWith([validAuthority, validAuthority2]);

    });

    it('should proxy to browseService and follow metadata with authority', () => {

      const filterValue = 'filterValue';
      const filterAuthority = 'filterAuthority';
      const browseOptions: BrowseEntrySearchOptions = Object.assign({}, { projection: 'preventMetadataSecurity' }) as BrowseEntrySearchOptions;
      const followLink: FollowLinkConfig<any> = {} as any;

      scheduler.schedule(() => service.getBrowseItemsFor(filterValue, filterAuthority, browseOptions, followLink).subscribe());
      scheduler.flush();

      expect(mockBrowseService.getBrowseItemsFor).toHaveBeenCalledWith(filterValue, filterAuthority, browseOptions, followLink);
      expect(mockItemService.findAllById).toHaveBeenCalledWith([validAuthority, validAuthority2]);

    });
  });

  describe('extractUUID', () => {

    beforeEach(() => {
      service = initTestService();
    });

    it('should extract uuid from metadata authority', () => {
      const uuidList = (service as any).extractUUID([thirdPublication], [{type: 'Publication', metadata: ['dc.contributor.author']}]);
      expect(uuidList).toEqual([]);
    });

    it('should extract uuid only from from valid authority', () => {
      const uuidList = (service as any).extractUUID([firstPublication, secondPublication, invalidAuthorityPublication], [{type: 'Publication', metadata: ['dc.contributor.author']}]);
      expect(uuidList).toEqual([validAuthority, validAuthority2]);
    });

    it('should extract uuid only from item with the specified type', () => {
      const uuidList = (service as any).extractUUID([firstProject], [{type: 'Publication', metadata: ['dc.contributor.author']}]);
      expect(uuidList).toEqual([]);
    });

    it('should not duplicate extracted uuid', () => {
      const uuidList = (service as any).extractUUID([firstPublication, firstPublication], [{type: 'Publication', metadata: ['dc.contributor.author']}]);
      expect(uuidList).toEqual([validAuthority]);
    });

    it('should limit the number of extracted uuids', () => {
      const uuidList = (service as any).extractUUID([firstPublication, secondPublication, invalidAuthorityPublication], [{type: 'Publication', metadata: ['dc.contributor.author']}], 2);
      expect(uuidList.length).toBe(2);
    });
  });

});
