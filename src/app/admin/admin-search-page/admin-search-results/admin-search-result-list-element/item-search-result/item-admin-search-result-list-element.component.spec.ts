import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../../../core/shared/item.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { ItemAdminSearchResultListElementComponent } from './item-admin-search-result-list-element.component';

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

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ItemAdminSearchResultListElementComponent],
      providers: [{ provide: TruncatableService, useValue: {} },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environment }],
      schemas: [NO_ERRORS_SCHEMA],
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
});
