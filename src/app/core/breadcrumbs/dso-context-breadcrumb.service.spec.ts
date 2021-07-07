import { TestBed, waitForAsync } from '@angular/core/testing';
import { DsoContextBreadcrumbService } from './dso-context-breadcrumb.service';
import { getMockLinkService } from '../../shared/mocks/link-service.mock';
import { LinkService } from '../cache/builders/link.service';
import { Item } from '../shared/item.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { DSpaceObject } from '../shared/dspace-object.model';
import { of as observableOf } from 'rxjs';
import { Community } from '../shared/community.model';
import { Collection } from '../shared/collection.model';
import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { getTestScheduler } from 'jasmine-marbles';
import { DSONameService } from './dso-name.service';
import { getDSORoute } from '../../app-routing-paths';
import { TranslateService } from '@ngx-translate/core';
import { ItemDataService } from '../data/item-data.service';
import { CollectionDataService } from '../data/collection-data.service';
import { CommunityDataService } from '../data/community-data.service';

describe('DsoContextBreadcrumbService', () => {
  let service: DsoContextBreadcrumbService;
  let linkService: any;
  const translate: any = {
    instant(name) {
      return 'Statistics';
    }
  };
  let itemDataService: any;
  let collectionService: any;
  let communityService: any;
  let testItem;
  let testCollection;
  let testCommunity;

  let itemPath;
  let collectionPath;
  let communityPath;

  let itemUUID;
  let collectionUUID;
  let communityUUID;

  const breadcrumbKey = 'statistics';

  let dsoNameService;

  function init() {
    itemPath = '/items/';
    collectionPath = '/collections/';
    communityPath = '/community/';

    itemUUID = '04dd18fc-03f9-4b9a-9304-ed7c313686d3';
    collectionUUID = '91dfa5b5-5440-4fb4-b869-02610342f886';
    communityUUID = '6c0bfa6b-ce82-4bf4-a2a8-fd7682c567e8';

    testCommunity = Object.assign(new Community(),
      {
        type: 'community',
        metadata: {
          'dc.title': [{ value: 'community' }]
        },
        uuid: communityUUID,
        parentCommunity: observableOf(Object.assign(createSuccessfulRemoteDataObject(undefined), { statusCode: 204 })),

        _links: {
          parentCommunity: 'site',
          self: communityPath + communityUUID
        }
      }
    );

    testCollection = Object.assign(new Collection(),
      {
        type: 'collection',
        metadata: {
          'dc.title': [{ value: 'collection' }]
        },
        uuid: collectionUUID,
        parentCommunity: createSuccessfulRemoteDataObject$(testCommunity),
        _links: {
          parentCommunity: communityPath + communityUUID,
          self: communityPath + collectionUUID
        }
      }
    );

    testItem = Object.assign(new Item(),
      {
        type: 'item',
        metadata: {
          'dc.title': [{ value: 'item' }]
        },
        uuid: itemUUID,
        owningCollection: createSuccessfulRemoteDataObject$(testCollection),
        _links: {
          owningCollection: collectionPath + collectionUUID,
          self: itemPath + itemUUID
        }
      }
    );

    dsoNameService = { getName: (dso) => getName(dso) };

    itemDataService = {
      findById: (id: string) => createSuccessfulRemoteDataObject$(testItem)
    };
    collectionService = {
      findById: (id: string) => createSuccessfulRemoteDataObject$(testCollection)
    };
    communityService = {
      findById: (id: string) => createSuccessfulRemoteDataObject$(testCommunity)
    };


  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      providers: [
        { provide: LinkService, useValue: getMockLinkService() },
        { provide: TranslateService, useValue: translate },
        { provide: ItemDataService, useValue: itemDataService },
        { provide: CollectionDataService, useValue: collectionService },
        { provide: CommunityDataService, useValue: communityService },
        { provide: DSONameService, useValue: translate },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    linkService = TestBed.inject(LinkService);
    linkService.resolveLink.and.callFake((object, link) => object);
    service = new DsoContextBreadcrumbService(linkService, translate, itemDataService, collectionService, communityService, dsoNameService);
  });

  describe('getBreadcrumbs Item', () => {
    it('should return the breadcrumbs based on an Item of type Item', () => {
      const breadcrumbs = service.getBreadcrumbs(itemUUID + '::' + breadcrumbKey, 'statistics/items/' + itemUUID);
      const expectedCrumbs = [
        new Breadcrumb(getName(testItem), getDSORoute(testItem)),
        new Breadcrumb('Statistics', 'statistics/items/' + testItem.uuid),
      ];
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: expectedCrumbs });
    });
  });

  describe('getBreadcrumbs Community', () => {
    it('should return the breadcrumbs based on an Item of type Community', () => {
      const breadcrumbs = service.getBreadcrumbs(communityUUID + '::' + breadcrumbKey, 'statistics/communities/' + communityUUID);
      const expectedCrumbs = [
        new Breadcrumb(getName(testCommunity), '/communities/' + communityUUID),
        new Breadcrumb('Statistics', 'statistics/communities/' + communityUUID),
      ];

      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: expectedCrumbs });
    });
  });

  describe('getBreadcrumbs Collection', () => {
    it('should return the breadcrumbs based on an Item of type Collection', () => {
      const breadcrumbs = service.getBreadcrumbs(collectionUUID + '::' + breadcrumbKey, 'statistics/collections/' + collectionUUID);
      const expectedCrumbs = [
        new Breadcrumb(getName(testCollection), '/collections/' + collectionUUID),
        new Breadcrumb('Statistics', 'statistics/collections/' + collectionUUID),
      ];
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: expectedCrumbs });
    });
  });

  function getName(dso: DSpaceObject): string {
    return dso.metadata['dc.title'][0].value;
  }
});
