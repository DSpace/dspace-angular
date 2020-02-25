import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { Item } from '../../../../core/shared/item.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { EditRelationshipComponent } from './edit-relationship.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

let objectUpdatesService;
const url = 'http://test-url.com/test-url';

let item;
let relatedItem;
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
      id: '1',
      uuid: '1',
      leftwardType: 'isAuthorOfPublication',
      rightwardType: 'isPublicationOfAuthor'
    });

    item = Object.assign(new Item(), {
      _links: {
        self: {
          href: 'fake-item-url/publication'
        }
      },
      id: 'publication',
      uuid: 'publication',
      relationships: observableOf(new RemoteData(false, false, true, undefined, new PaginatedList(new PageInfo(), relationships)))
    });

    relatedItem = Object.assign(new Item(), {
      uuid: 'related item id',
    });

    relationships = [
      Object.assign(new Relationship(), {
        _links: {
          self: { href: url + '/2' }
        },
        id: '2',
        uuid: '2',
        leftId: 'author1',
        rightId: 'publication',
        relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType)),
        leftItem: observableOf(new RemoteData(false, false, true, undefined, relatedItem)),
        rightItem: observableOf(new RemoteData(false, false, true, undefined, item)),
      }),
      Object.assign(new Relationship(), {
        _links: {
          self: { href: url + '/3' }
        },
        id: '3',
        uuid: '3',
        leftId: 'author2',
        rightId: 'publication',
        relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
      })
    ];

    author1 = Object.assign(new Item(), {
      id: 'author1',
      uuid: 'author1'
    });
    author2 = Object.assign(new Item(), {
      id: 'author2',
      uuid: 'author2'
    });

    fieldUpdate1 = {
      field: relationships[0],
      changeType: undefined
    };
    fieldUpdate2 = {
      field: relationships[1],
      changeType: FieldChangeType.REMOVE
    };

    const itemSelection = {};
    itemSelection[relatedItem.uuid] = false;
    itemSelection[item.uuid] = true;

    objectUpdatesService = {
      isSelectedVirtualMetadata: () => null,
      removeSingleFieldUpdate: jasmine.createSpy('removeSingleFieldUpdate'),
      saveRemoveFieldUpdate: jasmine.createSpy('saveRemoveFieldUpdate'),
    };

    spyOn(objectUpdatesService, 'isSelectedVirtualMetadata').and.callFake((a, b, uuid) => observableOf(itemSelection[uuid]));

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EditRelationshipComponent],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: NgbModal, useValue: {
            open: () => {/*comment*/
            }
          },
        },
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
    comp.editItem = item;
    comp.relatedItem$ = observableOf(relatedItem);

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
      spyOn(comp, 'closeVirtualMetadataModal');
      comp.ngOnChanges();
      comp.remove();
    });

    it('should close the virtual metadata modal and call saveRemoveFieldUpdate with the correct arguments', () => {
      expect(comp.closeVirtualMetadataModal).toHaveBeenCalled();
      expect(objectUpdatesService.saveRemoveFieldUpdate).toHaveBeenCalledWith(
        url,
        Object.assign({}, fieldUpdate1.field, {
          keepLeftVirtualMetadata: false,
          keepRightVirtualMetadata: true,
        }),
      );
    });
  });

  describe('undo', () => {

    it('should call removeSingleFieldUpdate with the correct arguments', () => {
      comp.undo();
      expect(objectUpdatesService.removeSingleFieldUpdate).toHaveBeenCalledWith(url, relationships[0].uuid);
    });
  });
});
