import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { BrowseEntrySearchOptions } from './browse-entry-search-options.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { SearchManager } from './search-manager';
import { toRemoteData } from '../../browse-by/browse-by-metadata-page/browse-by-metadata-page.component.spec';
import { Item } from '../shared/item.model';
import { FindListOptions } from '../data/request.models';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { of } from 'rxjs/internal/observable/of';

describe('SearchManager', () => {
  let scheduler: TestScheduler;
  let service: SearchManager;

  const firstPublication = Object.assign(new Item(), {
    id: 'first-publication-id',
    entityType: 'Publication',
    metadata: {
      'dc.contributor.author': [
        {
          authority: 'author1-id',
          value: 'author1'
        }
      ]
    }
  });

  const secondPublication = Object.assign(new Item(), {
    id: 'second-publication-id',
    entityType: 'Publication',
    metadata: {
      'dc.contributor.author': [
        {
          authority: 'author2-id',
          value: 'author2'
        }
      ]
    }
  });

  const firstProject = Object.assign(new Item(), {
    id: 'first-project-id',
    entityType: 'Project',
    metadata: {
      'dc.contributor.author': [
        {
          authority: 'author3-id',
          value: 'author3'
        }
      ]
    }
  });

  const thirdPublication = Object.assign(new Item(), {
    id: 'third-publication-id',
    entityType: 'Publication',
    metadata: {
      'dc.contributor.author': [
        {
          value: 'author4'
        }
      ]
    }
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

      const filterAuthority = 'filterAuthority';
      const options: BrowseEntrySearchOptions = { options: null} as any;
      const followLink: FollowLinkConfig<any> = {} as any;

      scheduler.schedule(() => service.getBrowseItemsFor(filterAuthority, options, followLink).subscribe());
      scheduler.flush();

      expect(mockBrowseService.getBrowseItemsFor).toHaveBeenCalledWith(filterAuthority, options, followLink);
      expect(mockItemService.findAllById).toHaveBeenCalledWith(['author1-id', 'author2-id']);

    });
  });

  describe('getBrowseItemsForAuthority', () => {

    beforeEach(() => {
      service = initTestService();
      spyOn(mockBrowseService, 'getBrowseItemsForAuthority').and.callThrough();
      spyOn(mockItemService, 'findAllById').and.callThrough();
    });

    it('should proxy to browseService and follow metadata', () => {

      const filterAuthority = 'filterAuthority';
      const options: BrowseEntrySearchOptions = { options: null} as any;
      const followLink: FollowLinkConfig<any> = {} as any;

      scheduler.schedule(() => service.getBrowseItemsForAuthority(filterAuthority, options, followLink).subscribe());
      scheduler.flush();

      expect(mockBrowseService.getBrowseItemsForAuthority).toHaveBeenCalledWith(filterAuthority, options, followLink);
      expect(mockItemService.findAllById).toHaveBeenCalledWith(['author1-id', 'author2-id']);

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

    it('should extract uuid only from item with the specified type', () => {
      const uuidList = (service as any).extractUUID([firstProject], [{type: 'Publication', metadata: ['dc.contributor.author']}]);
      expect(uuidList).toEqual([]);
    });

    it('should not duplicate extracted uuid', () => {
      const uuidList = (service as any).extractUUID([firstPublication, firstPublication], [{type: 'Publication', metadata: ['dc.contributor.author']}]);
      expect(uuidList).toEqual(['author1-id']);
    });
  });

});
