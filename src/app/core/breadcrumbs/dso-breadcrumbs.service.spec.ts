import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { getDSORoute } from '../../app-routing-paths';
import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { getMockLinkService } from '../../shared/mocks/link-service.mock';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { LinkService } from '../cache/builders/link.service';
import { Collection } from '../shared/collection.model';
import { Community } from '../shared/community.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { Item } from '../shared/item.model';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { DSONameService } from './dso-name.service';

describe('DSOBreadcrumbsService', () => {
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

  let dsoNameService;

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
        metadata: {
          'dc.title': [{ value: 'community' }],
        },
        uuid: communityUUID,
        parentCommunity: observableOf(Object.assign(createSuccessfulRemoteDataObject(undefined), { statusCode: 204 })),

        _links: {
          parentCommunity: 'site',
          self: communityPath + communityUUID,
        },
      },
    );

    testCollection = Object.assign(new Collection(),
      {
        type: 'collection',
        metadata: {
          'dc.title': [{ value: 'collection' }],
        },
        uuid: collectionUUID,
        parentCommunity: createSuccessfulRemoteDataObject$(testCommunity),
        _links: {
          parentCommunity: communityPath + communityUUID,
          self: communityPath + collectionUUID,
        },
      },
    );

    testItem = Object.assign(new Item(),
      {
        type: 'item',
        metadata: {
          'dc.title': [{ value: 'item' }],
        },
        uuid: itemUUID,
        owningCollection: createSuccessfulRemoteDataObject$(testCollection),
        _links: {
          owningCollection: collectionPath + collectionUUID,
          self: itemPath + itemUUID,
        },
      },
    );

    dsoNameService = { getName: (dso) => getName(dso) };
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      providers: [
        { provide: LinkService, useValue: getMockLinkService() },
        { provide: DSONameService, useValue: dsoNameService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    linkService = TestBed.inject(LinkService);
    linkService.resolveLink.and.callFake((object, link) => object);
    service = new DSOBreadcrumbsService(linkService, dsoNameService);
  });

  describe('getBreadcrumbs', () => {
    it('should return the breadcrumbs based on an Item', () => {
      const breadcrumbs = service.getBreadcrumbs(testItem, testItem._links.self);
      const expectedCrumbs = [
        new Breadcrumb(getName(testCommunity), getDSORoute(testCommunity)),
        new Breadcrumb(getName(testCollection), getDSORoute(testCollection)),
        new Breadcrumb(getName(testItem), getDSORoute(testItem)),
      ];
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: expectedCrumbs });
    });
  });

  function getName(dso: DSpaceObject): string {
    return dso.metadata['dc.title'][0].value;
  }
});
