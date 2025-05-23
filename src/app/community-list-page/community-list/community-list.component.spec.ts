import { CdkTreeModule } from '@angular/cdk/tree';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { Collection } from '../../core/shared/collection.model';
import { Community } from '../../core/shared/community.model';
import { PageInfo } from '../../core/shared/page-info.model';
import {
  isEmpty,
  isNotEmpty,
} from '../../shared/empty.util';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { TruncatableComponent } from '../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../shared/truncatable/truncatable-part/truncatable-part.component';
import {
  CommunityListService,
  showMoreFlatNode,
  toFlatNode,
} from '../community-list-service';
import { FlatNode } from '../flat-node.model';
import { CommunityListComponent } from './community-list.component';

describe('CommunityListComponent', () => {
  let component: CommunityListComponent;
  let fixture: ComponentFixture<CommunityListComponent>;

  const mockSubcommunities1Page1 = [Object.assign(new Community(), {
    id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    uuid: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    name: 'subcommunity1',
  }),
  Object.assign(new Community(), {
    id: '59ee713b-ee53-4220-8c3f-9860dc84fe33',
    uuid: '59ee713b-ee53-4220-8c3f-9860dc84fe33',
    name: 'subcommunity2',
  }),
  ];
  const mockCollectionsPage1 = [
    Object.assign(new Collection(), {
      id: 'e9dbf393-7127-415f-8919-55be34a6e9ed',
      uuid: 'e9dbf393-7127-415f-8919-55be34a6e9ed',
      name: 'collection1',
    }),
    Object.assign(new Collection(), {
      id: '59da2ff0-9bf4-45bf-88be-e35abd33f304',
      uuid: '59da2ff0-9bf4-45bf-88be-e35abd33f304',
      name: 'collection2',
    }),
  ];
  const mockCollectionsPage2 = [
    Object.assign(new Collection(), {
      id: 'a5159760-f362-4659-9e81-e3253ad91ede',
      uuid: 'a5159760-f362-4659-9e81-e3253ad91ede',
      name: 'collection3',
    }),
    Object.assign(new Collection(), {
      id: 'a392e16b-fcf2-400a-9a88-53ef7ecbdcd3',
      uuid: 'a392e16b-fcf2-400a-9a88-53ef7ecbdcd3',
      name: 'collection4',
    }),
  ];

  const mockTopCommunitiesWithChildrenArrays = [
    {
      id: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
      uuid: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
      subcommunities: mockSubcommunities1Page1,
      collections: [],
    },
    {
      id: '9076bd16-e69a-48d6-9e41-0238cb40d863',
      uuid: '9076bd16-e69a-48d6-9e41-0238cb40d863',
      subcommunities: [],
      collections: [...mockCollectionsPage1, ...mockCollectionsPage2],
    },
    {
      id: 'efbf25e1-2d8c-4c28-8f3e-2e04c215be24',
      uuid: 'efbf25e1-2d8c-4c28-8f3e-2e04c215be24',
      subcommunities: [],
      collections: [],
    }];

  const mockTopFlatnodesUnexpanded: FlatNode[] = [
    toFlatNode(
      Object.assign(new Community(), {
        id: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
        uuid: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
        subcommunities: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), mockSubcommunities1Page1)),
        collections: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
        name: 'community1',
      }), of(true), 0, false, null,
    ),
    toFlatNode(
      Object.assign(new Community(), {
        id: '9076bd16-e69a-48d6-9e41-0238cb40d863',
        uuid: '9076bd16-e69a-48d6-9e41-0238cb40d863',
        subcommunities: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
        collections: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [...mockCollectionsPage1, ...mockCollectionsPage2])),
        name: 'community2',
      }), of(true), 0, false, null,
    ),
    toFlatNode(
      Object.assign(new Community(), {
        id: 'efbf25e1-2d8c-4c28-8f3e-2e04c215be24',
        uuid: 'efbf25e1-2d8c-4c28-8f3e-2e04c215be24',
        subcommunities: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
        collections: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
        name: 'community3',
      }), of(false), 0, false, null,
    ),
  ];
  let communityListServiceStub;

  beforeEach(waitForAsync(() => {
    communityListServiceStub = {
      pageSize: 2,
      expandedNodes: [],
      loadingNode: null,
      getLoadingNodeFromStore() {
        return of(this.loadingNode);
      },
      getExpandedNodesFromStore() {
        return of(this.expandedNodes);
      },
      saveCommunityListStateToStore(expandedNodes, loadingNode) {
        this.expandedNodes = expandedNodes;
        this.loadingNode = loadingNode;
      },
      loadCommunities(options, expandedNodes) {
        let flatnodes;
        let showMoreTopComNode = false;
        flatnodes = [...mockTopFlatnodesUnexpanded];
        const currentPage = options.currentPage;
        const elementsPerPage = this.pageSize;
        let endPageIndex = (currentPage * elementsPerPage);
        if (endPageIndex >= flatnodes.length) {
          endPageIndex = flatnodes.length;
        } else {
          showMoreTopComNode = true;
        }
        if (expandedNodes === null || isEmpty(expandedNodes)) {
          if (showMoreTopComNode) {
            return of([...mockTopFlatnodesUnexpanded.slice(0, endPageIndex), showMoreFlatNode(`community-${uuidv4()}`, 0, null)]);
          } else {
            return of(mockTopFlatnodesUnexpanded.slice(0, endPageIndex));
          }
        } else {
          flatnodes = [];
          const topFlatnodes = mockTopFlatnodesUnexpanded.slice(0, endPageIndex);
          topFlatnodes.map((topNode: FlatNode) => {
            flatnodes = [...flatnodes, topNode];
            const expandedParent: FlatNode = expandedNodes.find((expandedNode: FlatNode) => expandedNode.id === topNode.id);
            if (isNotEmpty(expandedParent)) {
              const matchingTopComWithArrays = mockTopCommunitiesWithChildrenArrays.find((topcom) => topcom.id === topNode.id);
              if (isNotEmpty(matchingTopComWithArrays)) {
                const possibleSubcoms: Community[] = matchingTopComWithArrays.subcommunities;
                let subComFlatnodes = [];
                possibleSubcoms.map((subcom: Community) => {
                  subComFlatnodes = [...subComFlatnodes, toFlatNode(subcom, of(false), topNode.level + 1, false, topNode)];
                });
                const possibleColls: Collection[] = matchingTopComWithArrays.collections;
                let collFlatnodes = [];
                possibleColls.map((coll: Collection) => {
                  collFlatnodes = [...collFlatnodes, toFlatNode(coll, of(false), topNode.level + 1, false, topNode)];
                });
                if (isNotEmpty(subComFlatnodes)) {
                  const endSubComIndex = this.pageSize * expandedParent.currentCommunityPage;
                  flatnodes = [...flatnodes, ...subComFlatnodes.slice(0, endSubComIndex)];
                  if (subComFlatnodes.length > endSubComIndex) {
                    flatnodes = [...flatnodes, showMoreFlatNode(`community-${uuidv4()}`, topNode.level + 1, expandedParent)];
                  }
                }
                if (isNotEmpty(collFlatnodes)) {
                  const endColIndex = this.pageSize * expandedParent.currentCollectionPage;
                  flatnodes = [...flatnodes, ...collFlatnodes.slice(0, endColIndex)];
                  if (collFlatnodes.length > endColIndex) {
                    flatnodes = [...flatnodes, showMoreFlatNode(`collection-${uuidv4()}`, topNode.level + 1, expandedParent)];
                  }
                }
              }
            }
          });
          if (showMoreTopComNode) {
            flatnodes = [...flatnodes, showMoreFlatNode(`community-${uuidv4()}`, 0, null)];
          }
          return of(flatnodes);
        }
      },
    };
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        CdkTreeModule,
        RouterTestingModule,
        RouterLinkWithHref,
        CommunityListComponent,
      ],
      providers: [CommunityListComponent,
        { provide: CommunityListService, useValue: communityListServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(CommunityListComponent, {
        remove: {
          imports: [
            ThemedLoadingComponent,
            TruncatableComponent,
            TruncatablePartComponent,
          ] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([CommunityListComponent], (comp: CommunityListComponent) => {
    expect(comp).toBeTruthy();
  }));

  it('should render a cdk tree with the first elementsPerPage (2) nr of top level communities, unexpanded', () => {
    const expandableNodesFound = fixture.debugElement.queryAll(By.css('.expandable-node a'));
    const childlessNodesFound = fixture.debugElement.queryAll(By.css('.childless-node a'));
    const allNodes = [...expandableNodesFound, ...childlessNodesFound];
    expect(allNodes.length).toEqual(2);
    mockTopFlatnodesUnexpanded.slice(0, 2).map((topFlatnode: FlatNode) => {
      expect(allNodes.find((foundEl) => {
        return (foundEl.nativeElement.textContent.trim() === topFlatnode.name);
      })).toBeTruthy();
    });
  });

  it('show more node is present at end of nodetree', () => {
    const showMoreEl = fixture.debugElement.queryAll(By.css('.show-more-node'));
    expect(showMoreEl.length).toEqual(1);
    expect(showMoreEl).toBeTruthy();
  });

  it('should not render the show more button as an empty link', () => {
    const debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    expect(debugElements).toBeTruthy();
  });

  describe('when show more of top communities is clicked', () => {
    beforeEach(fakeAsync(() => {
      const showMoreLink = fixture.debugElement.query(By.css('.show-more-node .btn-outline-primary'));
      showMoreLink.triggerEventHandler('click', {
        preventDefault: () => {/**/
        },
      });
      tick();
      fixture.detectChanges();
    }));

    it('tree contains maximum of currentPage (2) * (2) elementsPerPage of first top communities, or less if there are less communities (3)', () => {
      const expandableNodesFound = fixture.debugElement.queryAll(By.css('.expandable-node a'));
      const childlessNodesFound = fixture.debugElement.queryAll(By.css('.childless-node a'));
      const allNodes = [...expandableNodesFound, ...childlessNodesFound];
      expect(allNodes.length).toEqual(3);
      mockTopFlatnodesUnexpanded.map((topFlatnode: FlatNode) => {
        expect(allNodes.find((foundEl) => {
          return (foundEl.nativeElement.textContent.trim() === topFlatnode.name);
        })).toBeTruthy();
      });
    });
    it('show more node is gone from end of nodetree', () => {
      const showMoreEl = fixture.debugElement.queryAll(By.css('.show-more-node'));
      expect(showMoreEl.length).toEqual(0);
    });
  });

  describe('when first expandable node is expanded', () => {
    let allNodes;
    beforeEach(fakeAsync(() => {
      const chevronExpand = fixture.debugElement.query(By.css('.expandable-node button'));
      const chevronExpandSpan = fixture.debugElement.query(By.css('.expandable-node button span'));
      if (chevronExpandSpan.nativeElement.classList.contains('fa-chevron-right')) {
        chevronExpand.nativeElement.click();
        tick();
        fixture.detectChanges();
      }

      const expandableNodesFound = fixture.debugElement.queryAll(By.css('.expandable-node a'));
      const childlessNodesFound = fixture.debugElement.queryAll(By.css('.childless-node a'));
      allNodes = [...expandableNodesFound, ...childlessNodesFound];
    }));
    describe('children of first expandable node are added to tree (page-limited)', () => {
      it('tree contains page-limited topcoms (2) and children of first expandable node (2subcoms)', () => {
        expect(allNodes.length).toEqual(4);
        mockTopFlatnodesUnexpanded.slice(0, 2).map((topFlatnode: FlatNode) => {
          expect(allNodes.find((foundEl) => {
            return (foundEl.nativeElement.textContent.trim() === topFlatnode.name);
          })).toBeTruthy();
        });
        mockSubcommunities1Page1.map((subcom) => {
          expect(allNodes.find((foundEl) => {
            return (foundEl.nativeElement.textContent.trim() === subcom.name);
          })).toBeTruthy();
        });
      });
    });
  });

  describe('second top community node is expanded and has more children (collections) than page size of collection', () => {
    describe('children of second top com are added (page-limited pageSize 2)', () => {
      let allNodes: DebugElement[];
      beforeEach(fakeAsync(() => {
        const toggleButtons: DebugElement[] = fixture.debugElement.queryAll(By.css('.expandable-node button'));
        const toggleButtonText: DebugElement = toggleButtons[1].query(By.css('span'));
        expect(toggleButtonText).not.toBeNull();

        if (toggleButtonText.nativeElement.classList.contains('fa-chevron-right')) {
          toggleButtons[1].nativeElement.click();
          tick();
          fixture.detectChanges();
        }

        const expandableNodesFound = fixture.debugElement.queryAll(By.css('.expandable-node a'));
        const childlessNodesFound = fixture.debugElement.queryAll(By.css('.childless-node a'));
        allNodes = [...expandableNodesFound, ...childlessNodesFound];
      }));
      it('tree contains 2 (page-limited) top com, 2 (page-limited) coll of 2nd top com, a show more for those page-limited coll and show more for page-limited top com', () => {
        const allNodeNames: string[] = allNodes.map((node: DebugElement) => node.nativeElement.innerText.trim());
        expect(allNodes.length).toEqual(4);
        const flatNodes: string[] = mockTopFlatnodesUnexpanded.slice(0, 2).map((flatNode: FlatNode) => flatNode.name);
        for (const flatNode of flatNodes) {
          expect(allNodeNames).toContain(flatNode);
        }
        expect(flatNodes.length).toBe(2);
        const page1CollectionNames: string[] = mockCollectionsPage1.map((collection: Collection) => collection.name);
        for (const collectionName of page1CollectionNames) {
          expect(allNodeNames).toContain(collectionName);
        }
        expect(page1CollectionNames.length).toBe(2);
        const showMoreEl = fixture.debugElement.queryAll(By.css('.show-more-node'));
        expect(showMoreEl.length).toEqual(2);
      });
    });
  });

});
