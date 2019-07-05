import { EditRelationshipListComponent } from './edit-relationship-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { ResourceType } from '../../../../core/shared/resource-type';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { SharedModule } from '../../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

let comp: EditRelationshipListComponent;
let fixture: ComponentFixture<EditRelationshipListComponent>;
let de: DebugElement;

let objectUpdatesService;
let relationshipService;

const url = 'http://test-url.com/test-url';

let item;
let author1;
let author2;
let fieldUpdate1;
let fieldUpdate2;
let relationships;
let relationshipType;

describe('EditRelationshipListComponent', () => {
  beforeEach(async(() => {
    relationshipType = Object.assign(new RelationshipType(), {
      type: ResourceType.RelationshipType,
      id: '1',
      uuid: '1',
      leftLabel: 'isAuthorOfPublication',
      rightLabel: 'isPublicationOfAuthor'
    });

    relationships = [
      Object.assign(new Relationship(), {
        self: url + '/2',
        id: '2',
        uuid: '2',
        leftId: 'author1',
        rightId: 'publication',
        relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
      }),
      Object.assign(new Relationship(), {
        self: url + '/3',
        id: '3',
        uuid: '3',
        leftId: 'author2',
        rightId: 'publication',
        relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
      })
    ];

    item = Object.assign(new Item(), {
      self: 'fake-item-url/publication',
      id: 'publication',
      uuid: 'publication',
      relationships: observableOf(new RemoteData(false, false, true, undefined, new PaginatedList(new PageInfo(), relationships)))
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
        getFieldUpdatesExclusive: observableOf({
          [author1.uuid]: fieldUpdate1,
          [author2.uuid]: fieldUpdate2
        })
      }
    );

    relationshipService = jasmine.createSpyObj('relationshipService',
      {
        getRelatedItemsByLabel: observableOf([author1, author2]),
      }
    );

    TestBed.configureTestingModule({
      imports: [SharedModule, TranslateModule.forRoot()],
      declarations: [EditRelationshipListComponent],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: RelationshipService, useValue: relationshipService }
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
    comp.url = url;
    comp.relationshipLabel = relationshipType.leftLabel;
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
