import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RelationshipTypeService } from '../../../../core/data/relationship-type.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { Item } from '../../../../core/shared/item.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { getMockLinkService } from '../../../../shared/mocks/mock-link-service';
import { SharedModule } from '../../../../shared/shared.module';
import { EditRelationshipListComponent } from './edit-relationship-list.component';

let comp: EditRelationshipListComponent;
let fixture: ComponentFixture<EditRelationshipListComponent>;
let de: DebugElement;

let objectUpdatesService;
let entityTypeService;

const url = 'http://test-url.com/test-url';

let item;
let author1;
let author2;
let fieldUpdate1;
let fieldUpdate2;
let relationship1;
let relationship2;
let relationshipType;
let entityType;
let relatedEntityType;

describe('EditRelationshipListComponent', () => {

  beforeEach(() => {

    entityType = Object.assign(new ItemType(), {
      id: 'entityType',
    });

    relatedEntityType = Object.assign(new ItemType(), {
      id: 'relatedEntityType',
    });

    relationshipType = Object.assign(new RelationshipType(), {
      id: '1',
      uuid: '1',
      leftwardType: 'isAuthorOfPublication',
      rightwardType: 'isPublicationOfAuthor',
      leftType: observableOf(new RemoteData(false, false, true, undefined, entityType)),
      rightType: observableOf(new RemoteData(false, false, true, undefined, relatedEntityType)),
    });

    relationship1 = Object.assign(new Relationship(), {
      _links: {
        self: {
          href: url + '/2'
        }
      },
      id: '2',
      uuid: '2',
      leftId: 'author1',
      rightId: 'publication',
      leftItem: observableOf(new RemoteData(false, false, true, undefined, item)),
      rightItem: observableOf(new RemoteData(false, false, true, undefined, author1)),
      relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
    });

    relationship2 = Object.assign(new Relationship(), {
      _links: {
        self: {
          href: url + '/3'
        }
      },
      id: '3',
      uuid: '3',
      leftId: 'author2',
      rightId: 'publication',
      leftItem: observableOf(new RemoteData(false, false, true, undefined, item)),
      rightItem: observableOf(new RemoteData(false, false, true, undefined, author2)),
      relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
    });

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
        new PaginatedList(new PageInfo(), [relationship1, relationship2])
      ))
    });

    author1 = Object.assign(new Item(), {
      id: 'author1',
      uuid: 'author1'
    });
    author2 = Object.assign(new Item(), {
      id: 'author2',
      uuid: 'author2'
    });

    fieldUpdate1 = {
      field: author1,
      changeType: undefined
    };
    fieldUpdate2 = {
      field: author2,
      changeType: FieldChangeType.REMOVE
    };

    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [author1.uuid]: fieldUpdate1,
          [author2.uuid]: fieldUpdate2
        })
      }
    );

    entityTypeService = jasmine.createSpyObj('entityTypeService',
      {
        getEntityTypeByLabel: observableOf(new RemoteData(
          false,
          false,
          true,
          null,
          entityType,
        )),
        getEntityTypeRelationships: observableOf(new RemoteData(
          false,
          false,
          true,
          null,
          new PaginatedList(new PageInfo(), [relationshipType]),
        )),
      }
    );

    TestBed.configureTestingModule({
      imports: [SharedModule, TranslateModule.forRoot()],
      declarations: [EditRelationshipListComponent],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: RelationshipTypeService, useValue: {} },
        { provide: LinkService, useValue: getMockLinkService() },
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

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
    it('the div should have class alert-danger', () => {

      fieldUpdate1.changeType = FieldChangeType.REMOVE;
      const element = de.queryAll(By.css('.relationship-row'))[1].nativeElement;
      expect(element.classList).toContain('alert-danger');
    });
  });
});
