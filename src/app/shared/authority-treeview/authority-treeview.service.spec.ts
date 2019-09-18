import { async, TestBed } from '@angular/core/testing';

import { TestScheduler } from 'rxjs/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { getTestScheduler, hot } from 'jasmine-marbles';

import { AuthorityTreeviewService } from './authority-treeview.service';
import { AuthorityService } from '../../core/integration/authority.service';
import { MockTranslateLoader } from '../mocks/mock-translate-loader';
import { IntegrationSearchOptions } from '../../core/integration/models/integration-options.model';
import { LOAD_MORE_NODE, LOAD_MORE_ROOT_NODE, TreeviewFlatNode, TreeviewNode } from './authority-treeview-node.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { AuthorityEntry } from '../../core/integration/models/authority-entry.model';
import { IntegrationData } from '../../core/integration/integration-data';

describe('AuthorityTreeviewService test suite', () => {

  let scheduler: TestScheduler;
  let service: AuthorityTreeviewService;
  let serviceAsAny: any;
  let loadMoreNode: TreeviewNode;
  let loadMoreRootNode: TreeviewNode;
  let loadMoreRootFlatNode: TreeviewFlatNode;
  let item: AuthorityEntry;
  let itemNode: TreeviewNode;
  let item2: AuthorityEntry;
  let itemNode2: TreeviewNode;
  let item3: AuthorityEntry;
  let itemNode3: TreeviewNode;
  let item5: AuthorityEntry;
  let itemNode5: TreeviewNode;
  let child: AuthorityEntry;
  let childNode: TreeviewNode;
  let child2: AuthorityEntry;
  let childNode2: TreeviewNode;
  let child3: AuthorityEntry;
  let childNode3: TreeviewNode;
  let searchItemNode: TreeviewNode;
  let searchChildNode: TreeviewNode;
  let searchChildNode3: TreeviewNode;

  let treeNodeList: TreeviewNode[];
  let treeNodeListWithChildren: TreeviewNode[];
  let treeNodeListWithLoadMore: TreeviewNode[];
  let treeNodeListWithLoadMoreRoot: TreeviewNode[];
  let nodeMap: Map<string, TreeviewNode>;
  let nodeMapWithChildren: Map<string, TreeviewNode>;
  let searchNodeMap: Map<string, TreeviewNode>;
  let searchOptions;

  const authorityServiceStub = jasmine.createSpyObj('authorityServiceStub', {
    getEntriesByName: jasmine.createSpy('getEntriesByName'),
    findEntriesByParent: jasmine.createSpy('findEntriesByParent'),
    getEntryByValue: jasmine.createSpy('getEntryByValue'),
    findTopEntries: jasmine.createSpy('findTopEntries')
  });

  function init() {

    loadMoreNode = new TreeviewNode(LOAD_MORE_NODE, false, new PageInfo(), item);
    loadMoreRootNode = new TreeviewNode(LOAD_MORE_ROOT_NODE, false, new PageInfo(), null);
    loadMoreRootFlatNode = new TreeviewFlatNode(LOAD_MORE_ROOT_NODE, 1, false, new PageInfo(), null);
    item = new AuthorityEntry();
    item.id = item.value = item.display = 'root1';
    item.otherInformation = { children: 'root1-child1::root1-child2' };
    itemNode = new TreeviewNode(item, true);
    searchItemNode = new TreeviewNode(item, true, new PageInfo(), null, true);

    item2 = new AuthorityEntry();
    item2.id = item2.value = item2.display = 'root2';
    itemNode2 = new TreeviewNode(item2);

    item3 = new AuthorityEntry();
    item3.id = item3.value = item3.display = 'root3';
    itemNode3 = new TreeviewNode(item3);

    child = new AuthorityEntry();
    child.id = child.value = child.display = 'root1-child1';
    child.otherInformation = { parent: 'root1', children: 'root1-child1-child1' };
    childNode = new TreeviewNode(child);
    searchChildNode = new TreeviewNode(child, true, new PageInfo(), item, true);

    child3 = new AuthorityEntry();
    child3.id = child3.value = child3.display = 'root1-child1-child1';
    child3.otherInformation = { parent: 'root1-child1' };
    childNode3 = new TreeviewNode(child3);
    searchChildNode3 = new TreeviewNode(child3, false, new PageInfo(), child, true);

    child2 = new AuthorityEntry();
    child2.id = child2.value = child2.display = 'root1-child2';
    child2.otherInformation = { parent: 'root1' };
    childNode2 = new TreeviewNode(child2, true);

    item5 = new AuthorityEntry();
    item5.id = item5.value = item5.display = 'root4';
    itemNode5 = new TreeviewNode(item5);

    treeNodeList = [
      itemNode,
      itemNode2,
      itemNode3
    ];
    treeNodeListWithChildren = [
      itemNode,
      itemNode2,
      itemNode3,
      childNode
    ];
    treeNodeListWithLoadMoreRoot = treeNodeList;
    treeNodeListWithLoadMore = treeNodeListWithChildren;
    treeNodeListWithLoadMoreRoot.push(loadMoreRootNode);
    treeNodeListWithLoadMore.push(loadMoreNode);

    nodeMap = new Map<string, TreeviewNode>([
      [item.id, itemNode],
      [item2.id, itemNode2],
      [item3.id, itemNode3]
    ]);

    nodeMapWithChildren = new Map<string, TreeviewNode>([
      [item.id, itemNode],
      [item2.id, itemNode2],
      [item3.id, itemNode3],
      [child.id, childNode],
    ]);

    searchNodeMap = new Map<string, TreeviewNode>([
      [item.id, searchItemNode],
    ]);
    searchOptions = new IntegrationSearchOptions('123456', 'authorityTest', 'metadata.test');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      providers: [
        { provide: AuthorityService, useValue: authorityServiceStub },
        AuthorityTreeviewService,
        TranslateService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(AuthorityTreeviewService);
    serviceAsAny = service;
    scheduler = getTestScheduler();
    init();
  });

  describe('initialize', () => {
    it('should set authorityName and call getTopNodes method', () => {
      const pageInfo = Object.assign(new PageInfo(), {
        elementsPerPage: 1,
        totalElements: 3,
        totalPages: 1,
        currentPage: 1
      });
      serviceAsAny.authorityService.findTopEntries.and.returnValue(hot('-a', {
        a: new IntegrationData(pageInfo, [item, item2, item3])
      }));

      scheduler.schedule(() => service.initialize(searchOptions));
      scheduler.flush();

      expect(serviceAsAny.authorityName).toEqual(searchOptions.name);
      expect(serviceAsAny.dataChange.value).toEqual([itemNode, itemNode2, itemNode3]);
    });
  });

  describe('getData', () => {
    it('should return dataChange', () => {
      const result = service.getData();

      expect(result).toEqual(serviceAsAny.dataChange);
    });
  });

  describe('loadMoreRoot', () => {
    it('should call getTopNodes properly', () => {
      spyOn(serviceAsAny, 'getTopNodes');
      service.initialize(searchOptions);
      const options = Object.assign(new IntegrationSearchOptions(null, 'authorityTest'),
        loadMoreRootFlatNode.pageInfo);
      serviceAsAny.dataChange.next(treeNodeListWithLoadMoreRoot);
      service.loadMoreRoot(loadMoreRootFlatNode);

      expect(serviceAsAny.getTopNodes).toHaveBeenCalledWith(options, treeNodeList);
    });
  });

  describe('loadMore', () => {

    beforeEach(() => {
      init();
      itemNode.childrenChange.next([childNode]);
    });

    it('should add children nodes properly', () => {
      const pageInfo = Object.assign(new PageInfo(), {
        elementsPerPage: 1,
        totalElements: 2,
        totalPages: 2,
        currentPage: 2
      });
      spyOn(serviceAsAny, 'getChildrenByParent').and.returnValue(hot('a', {
        a: new IntegrationData(pageInfo, [child2])
      }));

      serviceAsAny.dataChange.next(treeNodeListWithLoadMore);
      serviceAsAny.nodeMap = nodeMapWithChildren;
      treeNodeListWithChildren.push(new TreeviewNode(child2, false, new PageInfo(), item));

      scheduler.schedule(() => service.loadMore(item));
      scheduler.flush();

      expect(serviceAsAny.dataChange.value).toEqual(treeNodeListWithChildren);
    });

    it('should add loadMore node properly', () => {
      const pageInfo = Object.assign(new PageInfo(), {
        elementsPerPage: 1,
        totalElements: 2,
        totalPages: 2,
        currentPage: 1
      });
      spyOn(serviceAsAny, 'getChildrenByParent').and.returnValue(hot('a', {
        a: new IntegrationData(pageInfo, [child2])
      }));

      serviceAsAny.dataChange.next(treeNodeListWithLoadMore);
      serviceAsAny.nodeMap = nodeMapWithChildren;
      treeNodeListWithChildren.push(childNode2);
      treeNodeListWithChildren.push(loadMoreNode);

      scheduler.schedule(() => service.loadMore(item));
      scheduler.flush();

      expect(serviceAsAny.dataChange.value).toEqual(treeNodeListWithChildren);
    });

  });

  describe('searchBy', () => {
    it('should call getTopNodes properly', () => {
      const pageInfo = Object.assign(new PageInfo(), {
        elementsPerPage: 1,
        totalElements: 1,
        totalPages: 1,
        currentPage: 1
      });
      serviceAsAny.authorityService.getEntriesByName.and.returnValue(hot('-a', {
        a: new IntegrationData(pageInfo, [child3])
      }));

      serviceAsAny.authorityService.getEntryByValue.and.returnValues(
        hot('-a', {
          a: new IntegrationData(pageInfo, [child])
        }),
        hot('-b', {
          b: new IntegrationData(pageInfo, [item])
        })
      );
      searchOptions.query = 'root1-child1-child1';

      scheduler.schedule(() => service.searchBy(searchOptions));
      scheduler.flush();
      searchChildNode.childrenChange.next([searchChildNode3]);
      searchItemNode.childrenChange.next([searchChildNode]);
      expect(serviceAsAny.dataChange.value.length).toEqual(1);
      expect(serviceAsAny.dataChange.value).toEqual([searchItemNode]);
    });
  });

  describe('restoreNodes', () => {
    it('should restore nodes properly', () => {
      serviceAsAny.storedNodes = treeNodeList;
      serviceAsAny.storedNodeMap = nodeMap;
      serviceAsAny.nodeMap = searchNodeMap;

      service.restoreNodes();

      expect(serviceAsAny.nodeMap).toEqual(nodeMap);
      expect(serviceAsAny.dataChange.value).toEqual(treeNodeList);
    });
  });
});
