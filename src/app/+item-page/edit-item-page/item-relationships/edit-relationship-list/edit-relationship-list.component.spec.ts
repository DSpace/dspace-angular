import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RelationshipTypeService } from '../../../../core/data/relationship-type.service';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { Item } from '../../../../core/shared/item.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { getMockLinkService } from '../../../../shared/mocks/link-service.mock';
import { SelectableListService } from '../../../../shared/object-list/selectable-list/selectable-list.service';
import { SharedModule } from '../../../../shared/shared.module';
import { EditRelationshipListComponent } from './edit-relationship-list.component';

let comp: EditRelationshipListComponent;
let fixture: ComponentFixture<EditRelationshipListComponent>;
let de: DebugElement;

let linkService;
let objectUpdatesService;
let relationshipService;
let selectableListService;

const url = 'http://test-url.com/test-url';

let item;
let entityType;
let relatedEntityType;
let author1;
let author2;
let fieldUpdate1;
let fieldUpdate2;
let relationships;
let relationshipType;

describe('EditRelationshipListComponent', () => {

  beforeEach(async(() => {

    entityType = Object.assign(new ItemType(), {
      id: 'Publication',
      uuid: 'Publication',
      label: 'Publication',
    });

    relatedEntityType = Object.assign(new ItemType(), {
      id: 'Author',
      uuid: 'Author',
      label: 'Author',
    });

    relationshipType = Object.assign(new RelationshipType(), {
      id: '1',
      uuid: '1',
      leftType: observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          entityType,
        )),
      rightType: observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          relatedEntityType,
        )),
      leftwardType: 'isAuthorOfPublication',
      rightwardType: 'isPublicationOfAuthor',
    });

    author1 = Object.assign(new Item(), {
      id: 'author1',
      uuid: 'author1'
    });
    author2 = Object.assign(new Item(), {
      id: 'author2',
      uuid: 'author2'
    });

    relationships = [
      Object.assign(new Relationship(), {
        self: url + '/2',
        id: '2',
        uuid: '2',
        relationshipType: observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          relationshipType
        )),
        leftItem: observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          item,
        )),
        rightItem: observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          author1,
        )),
      }),
      Object.assign(new Relationship(), {
        self: url + '/3',
        id: '3',
        uuid: '3',
        relationshipType: observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          relationshipType
        )),
        leftItem: observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          item,
        )),
        rightItem: observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          author2,
        )),
      })
    ];

    item = Object.assign(new Item(), {
      _links: {
        self: { href: 'fake-item-url/publication' }
      },
      id: 'publication',
      uuid: 'publication',
      relationships: observableOf(new RemoteData(
        false,
        false,
        true,
        undefined,
        new PaginatedList(new PageInfo(), relationships),
      ))
    });

    fieldUpdate1 = {
      field: {
        uuid: relationships[0].uuid,
        relationship: relationships[0],
        type: relationshipType,
      },
      changeType: undefined
    };
    fieldUpdate2 = {
      field: {
        uuid: relationships[1].uuid,
        relationship: relationships[1],
        type: relationshipType,
      },
      changeType: FieldChangeType.REMOVE
    };

    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [relationships[0].uuid]: fieldUpdate1,
          [relationships[1].uuid]: fieldUpdate2
        })
      }
    );

    relationshipService = jasmine.createSpyObj('relationshipService',
      {
        getRelatedItemsByLabel: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), [author1, author2]))),
        getItemRelationshipsByLabel: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), relationships))),
        isLeftItem: observableOf(true),
      }
    );

    selectableListService = {};

    linkService = {
      resolveLink: () => null,
      resolveLinks: () => null,
    };

    TestBed.configureTestingModule({
      imports: [SharedModule, TranslateModule.forRoot()],
      declarations: [EditRelationshipListComponent],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: RelationshipService, useValue: relationshipService },
        { provide: SelectableListService, useValue: selectableListService },
        { provide: LinkService, useValue: linkService },
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRelationshipListComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    comp.item = item;
    comp.itemType = entityType;
    comp.url = url;
    comp.relationshipType = relationshipType;
    fixture.detectChanges();
  });

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
});
