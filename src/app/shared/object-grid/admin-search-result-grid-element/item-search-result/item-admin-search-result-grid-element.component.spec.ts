import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { CollectionElementLinkType } from '../../../object-collection/collection-element-link.type';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Collection } from '../../../../core/shared/collection.model';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { ItemAdminSearchResultGridElementComponent } from './item-admin-search-result-grid-element.component';
import { getItemEditPath } from '../../../../+item-page/item-page-routing.module';
import { URLCombiner } from '../../../../core/url-combiner/url-combiner';
import { ITEM_EDIT_DELETE_PATH, ITEM_EDIT_MOVE_PATH, ITEM_EDIT_REINSTATE_PATH, ITEM_EDIT_WITHDRAW_PATH } from '../../../../+item-page/edit-item-page/edit-item-page.routing.module';

describe('ItemAdminSearchResultListElementComponent', () => {
  let component: ItemAdminSearchResultGridElementComponent;
  let fixture: ComponentFixture<ItemAdminSearchResultGridElementComponent>;
  let id;
  let searchResult;

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    searchResult = new ItemSearchResult();
    searchResult.indexableObject = new Collection();
    searchResult.indexableObject.uuid = id;
  }
  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ItemAdminSearchResultGridElementComponent],
      providers: [{ provide: TruncatableService, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAdminSearchResultGridElementComponent);
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

  it('should render an edit button with the correct link', () => {
    const button = fixture.debugElement.query(By.css('a.edit-link'));
    const link = button.nativeElement.href;
    expect(link).toContain(getItemEditPath(id));
  });

  it('should render a delete button with the correct link', () => {
    const button = fixture.debugElement.query(By.css('a.delete-link'));
    const link = button.nativeElement.href;
    expect(link).toContain(new URLCombiner(getItemEditPath(id), ITEM_EDIT_DELETE_PATH).toString());
  });

  it('should render a move button with the correct link', () => {
    const a = fixture.debugElement.query(By.css('a.move-link'));
    const link = a.nativeElement.href;
    expect(link).toContain(new URLCombiner(getItemEditPath(id), ITEM_EDIT_MOVE_PATH).toString());
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

    it('should render a withdraw button with the correct link', () => {
      const a = fixture.debugElement.query(By.css('a.withdraw-link'));
      const link = a.nativeElement.href;
      expect(link).toContain(new URLCombiner(getItemEditPath(id), ITEM_EDIT_WITHDRAW_PATH).toString());
    });

    it('should not render a reinstate button with the correct link', () => {
      const a = fixture.debugElement.query(By.css('a.reinstate-link'));
      expect(a).toBeNull();
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

    it('should render a withdraw button with the correct link', () => {
      const a = fixture.debugElement.query(By.css('a.withdraw-link'));
      expect(a).toBeNull();
    });

    it('should not render a reinstate button with the correct link', () => {
      const a = fixture.debugElement.query(By.css('a.reinstate-link'));
      const link = a.nativeElement.href;
      expect(link).toContain(new URLCombiner(getItemEditPath(id), ITEM_EDIT_REINSTATE_PATH).toString());
    });
  })
});
