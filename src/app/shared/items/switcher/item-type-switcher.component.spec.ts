import { ItemTypeSwitcherComponent } from './item-type-switcher.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { PageInfo } from '../../../core/shared/page-info.model';
import { Item } from '../../../core/shared/item.model';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';
import * as decorator from '../item-type-decorator';
import { getComponentByItemType } from '../item-type-decorator';
import { ElementViewMode } from '../../view-mode';
import createSpy = jasmine.createSpy;

const relationType = 'type';
const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'test item'
    },
    {
      key: 'relationship.type',
      language: 'en_US',
      value: relationType
    }]
});
const viewMode = ElementViewMode.Full;

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

  describe('when calling getComponent', () => {
    beforeEach(() => {
      comp.getComponent();
    });

    it('should call getComponentByItemType with parameters type and viewMode', () => {
      expect(decorator.getComponentByItemType).toHaveBeenCalledWith(relationType, viewMode);
    });
  });

});
