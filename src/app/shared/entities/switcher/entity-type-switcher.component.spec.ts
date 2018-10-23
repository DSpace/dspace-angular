import { EntityTypeSwitcherComponent } from './entity-type-switcher.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PageInfo } from '../../../core/shared/page-info.model';
import { Item } from '../../../core/shared/item.model';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';
import * as decorator from '../entity-type-decorator';
import { ElementViewMode } from '../../view-mode';
import { getComponentByEntityType } from '../entity-type-decorator';

const relationType = 'type';
const mockItem: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
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

describe('EntityTypeSwitcherComponent', () => {
  let comp: EntityTypeSwitcherComponent;
  let fixture: ComponentFixture<EntityTypeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityTypeSwitcherComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EntityTypeSwitcherComponent);
    comp = fixture.componentInstance;
    comp.object = mockItem;
    comp.viewMode = viewMode;
    spyOn(decorator, 'getComponentByEntityType').and.returnValue('component');
  }));

  describe('when calling getComponent', () => {
    beforeEach(() => {
      comp.getComponent();
    });

    it('should call getComponentByEntityType with parameters type and viewMode', () => {
      expect(decorator.getComponentByEntityType).toHaveBeenCalledWith(relationType, viewMode);
    });
  });

});
