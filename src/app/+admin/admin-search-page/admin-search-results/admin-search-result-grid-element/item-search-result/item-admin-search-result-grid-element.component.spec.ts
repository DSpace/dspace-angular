import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../core/shared/item.model';
import { mockTruncatableService } from '../../../../../shared/mocks/mock-trucatable.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { ItemAdminSearchResultGridElementComponent } from './item-admin-search-result-grid-element.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';

describe('ItemAdminSearchResultGridElementComponent', () => {
  let component: ItemAdminSearchResultGridElementComponent;
  let fixture: ComponentFixture<ItemAdminSearchResultGridElementComponent>;
  let id;
  let searchResult;

  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    }
  };

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    searchResult = new ItemSearchResult();
    searchResult.indexableObject = new Item();
    searchResult.indexableObject.uuid = id;
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule(
      {
        declarations: [ItemAdminSearchResultGridElementComponent],
        imports: [
          NoopAnimationsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
          SharedModule
        ],
        providers: [
          { provide: TruncatableService, useValue: mockTruncatableService },
          { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        ],
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
