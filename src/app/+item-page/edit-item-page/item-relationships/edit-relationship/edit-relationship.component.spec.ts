import { async, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EditRelationshipComponent } from './edit-relationship.component';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { ResourceType } from '../../../../core/shared/resource-type';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';

let objectUpdatesService: ObjectUpdatesService;
const url = 'http://test-url.com/test-url';

let item;
let author1;
let author2;
let fieldUpdate1;
let fieldUpdate2;
let relationships;
let relationshipType;

let fixture;
let comp: EditRelationshipComponent;
let de;
let el;

describe('EditRelationshipComponent', () => {
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
        saveChangeFieldUpdate: {},
        saveRemoveFieldUpdate: {},
        setEditableFieldUpdate: {},
        setValidFieldUpdate: {},
        removeSingleFieldUpdate: {},
        isEditable: observableOf(false), // should always return something --> its in ngOnInit
        isValid: observableOf(true) // should always return something --> its in ngOnInit
      }
    );

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EditRelationshipComponent],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService }
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRelationshipComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;

    comp.url = url;
    comp.fieldUpdate = fieldUpdate1;
    comp.item = item;

    fixture.detectChanges();
  });

  describe('when fieldUpdate has no changeType', () => {
    beforeEach(() => {
      comp.fieldUpdate = fieldUpdate1;
      fixture.detectChanges();
    });

    describe('canRemove', () => {
      it('should return true', () => {
        expect(comp.canRemove()).toBe(true);
      });
    });

    describe('canUndo', () => {
      it('should return false', () => {
        expect(comp.canUndo()).toBe(false);
      });
    });
  });

  describe('when fieldUpdate has DELETE as changeType', () => {
    beforeEach(() => {
      comp.fieldUpdate = fieldUpdate2;
      fixture.detectChanges();
    });

    describe('canRemove', () => {
      it('should return false', () => {
        expect(comp.canRemove()).toBe(false);
      });
    });

    describe('canUndo', () => {
      it('should return true', () => {
        expect(comp.canUndo()).toBe(true);
      });
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      comp.remove();
    });

    it('should call saveRemoveFieldUpdate with the correct arguments', () => {
      expect(objectUpdatesService.saveRemoveFieldUpdate).toHaveBeenCalledWith(url, item);
    });
  });

  describe('undo', () => {
    beforeEach(() => {
      comp.undo();
    });

    it('should call removeSingleFieldUpdate with the correct arguments', () => {
      expect(objectUpdatesService.removeSingleFieldUpdate).toHaveBeenCalledWith(url, item.uuid);
    });
  });

});
