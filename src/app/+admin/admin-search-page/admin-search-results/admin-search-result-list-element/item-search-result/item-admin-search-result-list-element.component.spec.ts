import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { ItemAdminSearchResultListElementComponent } from './item-admin-search-result-list-element.component';
import { Item } from '../../../../../core/shared/item.model';

describe('ItemAdminSearchResultListElementComponent', () => {
  let component: ItemAdminSearchResultListElementComponent;
  let fixture: ComponentFixture<ItemAdminSearchResultListElementComponent>;
  let id;
  let searchResult;

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    searchResult = new ItemSearchResult();
    searchResult.indexableObject = new Item();
    searchResult.indexableObject.uuid = id;
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ItemAdminSearchResultListElementComponent],
      providers: [{ provide: TruncatableService, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAdminSearchResultListElementComponent);
    component = fixture.componentInstance;
    component.object = searchResult;
    component.linkTypes = CollectionElementLinkType;
    component.index = 0;
    component.viewModes = ViewMode;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the item is not withdrawn', () => {
    beforeEach(() => {
      component.dso.isWithdrawn = false;
      fixture.detectChanges();
    });

    it('should not show the withdrawn badge', () => {
      const badge = fixture.debugElement.query(By.css('div.withdrawn-badge'));
      expect(badge).toBeNull();
    });
  });

  describe('when the item is withdrawn', () => {
    beforeEach(() => {
      component.dso.isWithdrawn = true;
      fixture.detectChanges();
    });

    it('should show the withdrawn badge', () => {
      const badge = fixture.debugElement.query(By.css('div.withdrawn-badge'));
      expect(badge).not.toBeNull();
    });
  });

  describe('when the item is not private', () => {
    beforeEach(() => {
      component.dso.isDiscoverable = true;
      fixture.detectChanges();
    });
    it('should not show the private badge', () => {
      const badge = fixture.debugElement.query(By.css('div.private-badge'));
      expect(badge).toBeNull();
    });
  });

  describe('when the item is private', () => {
    beforeEach(() => {
      component.dso.isDiscoverable = false;
      fixture.detectChanges();
    });

    it('should show the private badge', () => {
      const badge = fixture.debugElement.query(By.css('div.private-badge'));
      expect(badge).not.toBeNull();
    });
  })
});
