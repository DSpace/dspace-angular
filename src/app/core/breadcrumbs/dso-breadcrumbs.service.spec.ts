import { async, TestBed } from '@angular/core/testing';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { getMockLinkService } from '../../shared/mocks/mock-link-service';
import { LinkService } from '../cache/builders/link.service';
import { Item } from '../shared/item.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';
import { DSpaceObject } from '../shared/dspace-object.model';
import { map } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { hasValue } from '../../shared/empty.util';
import { Community } from '../shared/community.model';
import { Collection } from '../shared/collection.model';
import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { getItemPageRoute } from '../../+item-page/item-page-routing.module';
import { getCommunityPageRoute } from '../../+community-page/community-page-routing.module';
import { getCollectionPageRoute } from '../../+collection-page/collection-page-routing.module';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { getDSOPath } from '../../app-routing.module';

fdescribe('DSOBreadcrumbsService', () => {
  let service: DSOBreadcrumbsService;
  let linkService: any;
  let testItem;
  let testCollection;
  let testCommunity;

  let itemPath;
  let collectionPath;
  let communityPath;

  let itemUUID;
  let collectionUUID;
  let communityUUID;

  let objects: DSpaceObject[];

  function init() {
    itemPath = '/items/';
    collectionPath = '/collection/';
    communityPath = '/community/';

    itemUUID = '04dd18fc-03f9-4b9a-9304-ed7c313686d3';
    collectionUUID = '91dfa5b5-5440-4fb4-b869-02610342f886';
    communityUUID = '6c0bfa6b-ce82-4bf4-a2a8-fd7682c567e8';

    testCommunity = Object.assign(new Community(),
      {
        type: 'community',
        name: 'community',
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
        name: 'collection',
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
        name: 'item',
        uuid: itemUUID,
        owningCollection: createSuccessfulRemoteDataObject$(testCollection),
        _links: {
          owningCollection: collectionPath + collectionUUID,
          self: itemPath + itemUUID
        }
      }
    );

    objects = [testItem, testCollection, testCommunity];

  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      providers: [
        { provide: LinkService, useValue: getMockLinkService() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    linkService = TestBed.get(LinkService);
    linkService.resolveLink.and.callFake((object, link) => object);
    service = new DSOBreadcrumbsService(linkService);
  });

  describe('getBreadcrumbs', () => {
    it('should return the breadcrumbs based on an Item', () => {
      const breadcrumbs = service.getBreadcrumbs(testItem, testItem._links.self);
      const expectedCrumbs = [
        new Breadcrumb(testCommunity.name, getDSOPath(testCommunity)),
        new Breadcrumb(testCollection.name, getDSOPath(testCollection)),
        new Breadcrumb(testItem.name, getDSOPath(testItem)),
      ];
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: expectedCrumbs });
    })
  });
});
