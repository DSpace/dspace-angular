import { ItemTypeSwitcherComponent } from './item-type-switcher.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { PageInfo } from '../../../core/shared/page-info.model';
import { Item } from '../../../core/shared/item.model';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';
import * as decorator from '../item-type-decorator';
import { getComponentByItemType, ItemViewMode } from '../item-type-decorator';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import createSpy = jasmine.createSpy;
import { createSuccessfulRemoteDataObject$ } from '../../testing/utils';

const relationType = 'type';
const mockItem: Item = Object.assign(new Item(), {
  bitstreams: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'test item'
      }
    ],
    'relationship.type': [
      {
        language: 'en_US',
        value: relationType
      }
    ]
  }
});
const mockItemMetadataRepresentation = Object.assign(new ItemMetadataRepresentation(), mockItem);
let viewMode = ItemViewMode.Full;

describe('ItemTypeSwitcherComponent', () => {
  let comp: ItemTypeSwitcherComponent;
  let fixture: ComponentFixture<ItemTypeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypeSwitcherComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemTypeSwitcherComponent);
    comp = fixture.componentInstance;
    comp.object = mockItem;
    comp.viewMode = viewMode;
    spyOnProperty(decorator, 'getComponentByItemType').and.returnValue(createSpy('getComponentByItemType'))
  }));

  describe('when the injected object is of type Item', () => {
    beforeEach(() => {
      viewMode = ItemViewMode.Full;
      comp.object = mockItem;
      comp.viewMode = viewMode;
    });

    describe('when calling getComponent', () => {
      beforeEach(() => {
        comp.getComponent();
      });

      it('should call getComponentByItemType with parameters type and viewMode', () => {
        expect(decorator.getComponentByItemType).toHaveBeenCalledWith(relationType, viewMode);
      });
    });
  });

  describe('when the injected object is of type MetadataRepresentation', () => {
    beforeEach(() => {
      viewMode = ItemViewMode.Metadata;
      comp.object = mockItemMetadataRepresentation;
      comp.viewMode = viewMode;
    });

    describe('when calling getComponent', () => {
      beforeEach(() => {
        comp.getComponent();
      });

      it('should call getComponentByItemType with parameters type, viewMode and representationType', () => {
        expect(decorator.getComponentByItemType).toHaveBeenCalledWith(relationType, viewMode, mockItemMetadataRepresentation.representationType);
      });
    });
  });

});
