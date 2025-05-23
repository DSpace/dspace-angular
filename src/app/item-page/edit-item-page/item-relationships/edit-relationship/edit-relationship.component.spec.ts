// eslint-disable-next-line max-classes-per-file
import {
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { FieldChangeType } from '../../../../core/data/object-updates/field-change-type.model';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { Item } from '../../../../core/shared/item.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { ListableObjectComponentLoaderComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { VirtualMetadataComponent } from '../../virtual-metadata/virtual-metadata.component';
import { EditRelationshipComponent } from './edit-relationship.component';

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
let mockNgbModal;

let fixture: ComponentFixture<EditRelationshipComponent>;
let comp: EditRelationshipComponent;
let de;
let el;

describe('EditRelationshipComponent', () => {

  beforeEach(waitForAsync(() => {

    relationshipType = Object.assign(new RelationshipType(), {
      id: '1',
      uuid: '1',
      leftwardType: 'isAuthorOfPublication',
      rightwardType: 'isPublicationOfAuthor',
    });

    item = Object.assign(new Item(), {
      _links: {
        self: {
          href: 'fake-item-url/publication',
        },
      },
      id: 'publication',
      uuid: 'publication',
      relationships: createSuccessfulRemoteDataObject$(createPaginatedList(relationships)),
    });

    relatedItem = Object.assign(new Item(), {
      uuid: 'related item id',
    });

    relationships = [
      Object.assign(new Relationship(), {
        _links: {
          self: { href: url + '/2' },
        },
        id: '2',
        uuid: '2',
        leftId: 'author1',
        rightId: 'publication',
        relationshipType: createSuccessfulRemoteDataObject$(relationshipType),
        leftItem: createSuccessfulRemoteDataObject$(relatedItem),
        rightItem: createSuccessfulRemoteDataObject$(item),
      }),
      Object.assign(new Relationship(), {
        _links: {
          self: { href: url + '/3' },
        },
        id: '3',
        uuid: '3',
        leftId: 'author2',
        rightId: 'publication',
        relationshipType: createSuccessfulRemoteDataObject$(relationshipType),
      }),
    ];

    author1 = Object.assign(new Item(), {
      id: 'author1',
      uuid: 'author1',
    });
    author2 = Object.assign(new Item(), {
      id: 'author2',
      uuid: 'author2',
    });

    fieldUpdate1 = {
      field: {
        uuid: relationships[0].uuid,
        relationship: relationships[0],
      },
      changeType: undefined,
    };
    fieldUpdate2 = {
      field: {
        uuid: relationships[1].uuid,
        relationship: relationships[1],
      },
      changeType: FieldChangeType.REMOVE,
    };

    const itemSelection = {};
    itemSelection[relatedItem.uuid] = false;
    itemSelection[item.uuid] = true;

    objectUpdatesService = {
      isSelectedVirtualMetadata: () => null,
      removeSingleFieldUpdate: jasmine.createSpy('removeSingleFieldUpdate'),
      saveRemoveFieldUpdate: jasmine.createSpy('saveRemoveFieldUpdate'),
    };

    mockNgbModal = {
      open: jasmine.createSpy('open').and.returnValue(
        { componentInstance: {}, closed: of({}) } as NgbModalRef,
      ),
    };

    spyOn(objectUpdatesService, 'isSelectedVirtualMetadata').and.callFake((a, b, uuid) => of(itemSelection[uuid]));

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), EditRelationshipComponent],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: NgbModal, useValue: mockNgbModal },
        { provide: ThemeService, useValue: getMockThemeService() },
      ], schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .overrideComponent(EditRelationshipComponent, {
        remove: { imports: [ VirtualMetadataComponent, ListableObjectComponentLoaderComponent ] },
        add: { imports: [ MockVirtualMetadataComponent, MockListableObjectComponentLoaderComponent ] },
      })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(EditRelationshipComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;

    comp.url = url;
    comp.fieldUpdate = fieldUpdate1;
    comp.editItem = item;
    comp.relatedItem$.next(relatedItem);

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

@Component({
  selector: 'ds-virtual-metadata',
  template: ``,
  standalone: true,
})
class MockVirtualMetadataComponent {}

@Component({
  selector: 'ds-listable-object-component-loader',
  template: ``,
  standalone: true,
})
export class MockListableObjectComponentLoaderComponent {}
