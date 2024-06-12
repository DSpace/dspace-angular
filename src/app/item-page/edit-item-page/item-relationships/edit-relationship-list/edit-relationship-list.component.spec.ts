import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  RouterModule,
} from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import {
  BehaviorSubject,
  of as observableOf,
} from 'rxjs';

import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment.test';
import { REQUEST } from '../../../../../express.tokens';
import { AuthRequestService } from '../../../../core/auth/auth-request.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { FieldChangeType } from '../../../../core/data/object-updates/field-change-type.model';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { RelationshipDataService } from '../../../../core/data/relationship-data.service';
import { RelationshipTypeDataService } from '../../../../core/data/relationship-type-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { CookieService } from '../../../../core/services/cookie.service';
import { HardRedirectService } from '../../../../core/services/hard-redirect.service';
import { LinkHeadService } from '../../../../core/services/link-head.service';
import { ConfigurationProperty } from '../../../../core/shared/configuration-property.model';
import { Item } from '../../../../core/shared/item.model';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { XSRFService } from '../../../../core/xsrf/xsrf.service';
import { HostWindowService } from '../../../../shared/host-window.service';
import { SelectableListService } from '../../../../shared/object-list/selectable-list/selectable-list.service';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { AuthRequestServiceStub } from '../../../../shared/testing/auth-request-service.stub';
import { EditItemRelationshipsServiceStub } from '../../../../shared/testing/edit-item-relationships.service.stub';
import { HostWindowServiceStub } from '../../../../shared/testing/host-window-service.stub';
import { PaginationServiceStub } from '../../../../shared/testing/pagination-service.stub';
import { SearchConfigurationServiceStub } from '../../../../shared/testing/search-configuration-service.stub';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { EditItemRelationshipsService } from '../edit-item-relationships.service';
import { EditRelationshipListComponent } from './edit-relationship-list.component';

describe('EditRelationshipListComponent', () => {

  let comp: EditRelationshipListComponent;
  let fixture: ComponentFixture<EditRelationshipListComponent>;
  let de: DebugElement;

  let linkService;
  let objectUpdatesService;
  let relationshipService;
  let selectableListService;
  let paginationService: PaginationServiceStub;
  let hostWindowService: HostWindowServiceStub;
  let hardRedirectService;
  const relationshipTypeService = {};
  let editItemRelationshipsService: EditItemRelationshipsServiceStub;

  const url = 'http://test-url.com/test-url';

  let itemLeft: Item;
  let entityTypeLeft: ItemType;
  let entityTypeRight: ItemType;
  let itemRight1: Item;
  let itemRight2: Item;
  let fieldUpdate1;
  let fieldUpdate2;
  let relationships: Relationship[];
  let relationshipType: RelationshipType;
  let paginationOptions: PaginationComponentOptions;
  let currentItemIsLeftItem$ =  new BehaviorSubject<boolean>(true);

  const resetComponent = () => {
    fixture = TestBed.createComponent(EditRelationshipListComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    comp.item = itemLeft;
    comp.itemType = entityTypeLeft;
    comp.url = url;
    comp.relationshipType = relationshipType;
    comp.hasChanges = observableOf(false);
    comp.currentItemIsLeftItem$ = currentItemIsLeftItem$;
    fixture.detectChanges();
  };

  const initialState: any = {
    core: {
      'cache/object': {},
      'cache/syncbuffer': {},
      'cache/object-updates': {},
      'data/request': {},
      'index': {},
    },
  };

  function init(leftType: string, rightType: string): void {
    entityTypeLeft = Object.assign(new ItemType(), {
      id: leftType,
      uuid: leftType,
      label: leftType,
    });

    entityTypeRight = Object.assign(new ItemType(), {
      id: rightType,
      uuid: rightType,
      label: rightType,
    });

    relationshipType = Object.assign(new RelationshipType(), {
      id: '1',
      uuid: '1',
      leftType: createSuccessfulRemoteDataObject$(entityTypeLeft),
      rightType: createSuccessfulRemoteDataObject$(entityTypeRight),
      leftwardType: `is${rightType}Of${leftType}`,
      rightwardType: `is${leftType}Of${rightType}`,
    });

    paginationOptions = Object.assign(new PaginationComponentOptions(), {
      id: `er${relationshipType.id}`,
      pageSize: 5,
      currentPage: 1,
    });

    itemRight1 = Object.assign(new Item(), {
      id: `${rightType}-1`,
      uuid: `${rightType}-1`,
    });
    itemRight2 = Object.assign(new Item(), {
      id: `${rightType}-2`,
      uuid: `${rightType}-2`,
    });

    relationships = [
      Object.assign(new Relationship(), {
        self: url + '/2',
        id: '2',
        uuid: '2',
        relationshipType: createSuccessfulRemoteDataObject$(relationshipType),
        leftItem: createSuccessfulRemoteDataObject$(itemLeft),
        rightItem: createSuccessfulRemoteDataObject$(itemRight1),
      }),
      Object.assign(new Relationship(), {
        self: url + '/3',
        id: '3',
        uuid: '3',
        relationshipType: createSuccessfulRemoteDataObject$(relationshipType),
        leftItem: createSuccessfulRemoteDataObject$(itemLeft),
        rightItem: createSuccessfulRemoteDataObject$(itemRight2),
      }),
    ];

    itemLeft = Object.assign(new Item(), {
      _links: {
        self: { href: 'fake-item-url/publication' },
      },
      id: `1-${leftType}`,
      uuid: `1-${leftType}`,
      relationships: createSuccessfulRemoteDataObject$(createPaginatedList(relationships)),
    });

    fieldUpdate1 = {
      field: {
        uuid: relationships[0].uuid,
        relationship: relationships[0],
        type: relationshipType,
      },
      changeType: undefined,
    };
    fieldUpdate2 = {
      field: {
        uuid: relationships[1].uuid,
        relationship: relationships[1],
        type: relationshipType,
      },
      changeType: FieldChangeType.REMOVE,
    };

    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [relationships[0].uuid]: fieldUpdate1,
          [relationships[1].uuid]: fieldUpdate2,
        }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        initialize: () => {
        },
      },
    );

    relationshipService = jasmine.createSpyObj('relationshipService',
      {
        getRelatedItemsByLabel: createSuccessfulRemoteDataObject$(createPaginatedList([itemRight1, itemRight2])),
        getItemRelationshipsByLabel: createSuccessfulRemoteDataObject$(createPaginatedList(relationships)),
        isLeftItem: observableOf(true),
      },
    );

    selectableListService = {};

    linkService = {
      resolveLink: () => null,
      resolveLinks: () => null,
    };

    paginationService = new PaginationServiceStub(paginationOptions);

    hostWindowService = new HostWindowServiceStub(1200);

    const linkHeadService = jasmine.createSpyObj('linkHeadService', {
      addTag: '',
    });

    const groupDataService = jasmine.createSpyObj('groupsDataService', {
      findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
      getGroupRegistryRouterLink: '',
      getUUIDFromString: '',
    });

    const configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'test',
        values: [
          'org.dspace.ctask.general.ProfileFormats = test',
        ],
      })),
    });

    editItemRelationshipsService = new EditItemRelationshipsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        EditRelationshipListComponent,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: RelationshipDataService, useValue: relationshipService },
        { provide: SelectableListService, useValue: selectableListService },
        { provide: LinkService, useValue: linkService },
        { provide: PaginationService, useValue: paginationService },
        { provide: HostWindowService, useValue: hostWindowService },
        { provide: RelationshipTypeDataService, useValue: relationshipTypeService },
        { provide: GroupDataService, useValue: groupDataService },
        { provide: LinkHeadService, useValue: linkHeadService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: SearchConfigurationService, useValue: new SearchConfigurationServiceStub() },
        { provide: EditItemRelationshipsService, useValue: editItemRelationshipsService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AuthRequestService, useValue: new AuthRequestServiceStub() },
        { provide: HardRedirectService, useValue: hardRedirectService },
        { provide: XSRFService, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
        { provide: REQUEST, useValue: {} },
        CookieService,
      ], schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();

    resetComponent();
  }

  describe('Publication - Author relationship', () => {
    beforeEach(waitForAsync(() => init('Publication', 'Author')));

    describe('changeType is REMOVE', () => {
      beforeEach(() => {
        fieldUpdate1.changeType = FieldChangeType.REMOVE;
        fixture.detectChanges();
      });
      it('the div should have class alert-danger', () => {
        const element = de.queryAll(By.css('.relationship-row'))[1].nativeElement;
        expect(element.classList).toContain('alert-danger');
      });
    });

    describe('pagination component', () => {
      let paginationComp: PaginationComponent;

      beforeEach(() => {
        paginationComp = de.query(By.css('ds-pagination')).componentInstance;
      });

      it('should receive the correct pagination config', () => {
        expect(paginationComp.paginationOptions).toEqual(paginationOptions);
      });

      it('should receive correct collection size', () => {
        expect(paginationComp.collectionSize).toEqual(relationships.length);
      });

    });

    describe('relationshipService.getItemRelationshipsByLabel', () => {
      it('should receive the correct pagination info', () => {
        expect(relationshipService.getItemRelationshipsByLabel).toHaveBeenCalledTimes(1);

        const callArgs = relationshipService.getItemRelationshipsByLabel.calls.mostRecent().args;
        const findListOptions = callArgs[2];
        const linksToFollow = callArgs[5];
        expect(findListOptions.elementsPerPage).toEqual(paginationOptions.pageSize);
        expect(findListOptions.currentPage).toEqual(paginationOptions.currentPage);
        expect(linksToFollow.linksToFollow[0].name).toEqual('thumbnail');

      });

      describe('when the publication is on the left side of the relationship', () => {
        beforeEach(() => {
          relationshipType = Object.assign(new RelationshipType(), {
            id: '1',
            uuid: '1',
            leftType: createSuccessfulRemoteDataObject$(entityTypeLeft), // publication
            rightType: createSuccessfulRemoteDataObject$(entityTypeRight), // author
            leftwardType: 'isAuthorOfPublication',
            rightwardType: 'isPublicationOfAuthor',
          });
          currentItemIsLeftItem$ =  new BehaviorSubject<boolean>(true);
          relationshipService.getItemRelationshipsByLabel.calls.reset();
          resetComponent();
        });

        it('should fetch isAuthorOfPublication', () => {
          expect(relationshipService.getItemRelationshipsByLabel).toHaveBeenCalledTimes(1);

          const callArgs = relationshipService.getItemRelationshipsByLabel.calls.mostRecent().args;
          const label = callArgs[1];

          expect(label).toEqual('isAuthorOfPublication');
        });
      });

      describe('when the publication is on the right side of the relationship', () => {
        beforeEach(() => {
          relationshipType = Object.assign(new RelationshipType(), {
            id: '1',
            uuid: '1',
            leftType: createSuccessfulRemoteDataObject$(entityTypeRight), // author
            rightType: createSuccessfulRemoteDataObject$(entityTypeLeft), // publication
            leftwardType: 'isPublicationOfAuthor',
            rightwardType: 'isAuthorOfPublication',
          });
          currentItemIsLeftItem$ =  new BehaviorSubject<boolean>(false);
          relationshipService.getItemRelationshipsByLabel.calls.reset();
          resetComponent();
        });

        it('should fetch isAuthorOfPublication', () => {
          expect(relationshipService.getItemRelationshipsByLabel).toHaveBeenCalledTimes(1);

          const callArgs = relationshipService.getItemRelationshipsByLabel.calls.mostRecent().args;
          const label = callArgs[1];

          expect(label).toEqual('isAuthorOfPublication');
        });
      });



      describe('changes managment for add buttons', () => {

        it('should show enabled add buttons', () => {
          const element = de.query(By.css('.btn-success'));
          expect(element.nativeElement?.disabled).toBeFalse();
        });

        it('after hash changes changed', () => {
          comp.hasChanges = observableOf(true);
          fixture.detectChanges();
          const element = de.query(By.css('.btn-success'));
          expect(element.nativeElement?.disabled).toBeTrue();
        });
      });

    });
  });

  describe('OrgUnit - OrgUnit relationship', () => {
    beforeEach(waitForAsync(() => init('OrgUnit', 'OrgUnit')));

    it('should emit the relatedEntityType$ even for same entity relationships', () => {
      expect(comp.relatedEntityType$).toBeObservable(cold('(a|)', {
        a: entityTypeRight,
      }));
    });
  });
});
