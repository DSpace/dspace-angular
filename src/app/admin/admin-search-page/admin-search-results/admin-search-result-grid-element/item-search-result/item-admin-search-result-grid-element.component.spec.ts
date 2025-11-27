import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { FileService } from '@dspace/core/shared/file.service';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { AuthorizationDataServiceStub } from '@dspace/core/testing/authorization-service.stub';
import { FileServiceStub } from '@dspace/core/testing/file-service.stub';
import { mockTruncatableService } from '@dspace/core/testing/mock-trucatable.service';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ListableModule } from '../../../../../shared/listable.module';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { getMockThemeService } from '../../../../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { ItemAdminSearchResultGridElementComponent } from './item-admin-search-result-grid-element.component';

describe('ItemAdminSearchResultGridElementComponent', () => {
  let component: ItemAdminSearchResultGridElementComponent;
  let fixture: ComponentFixture<ItemAdminSearchResultGridElementComponent>;
  let id;
  let searchResult;

  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
  };

  const mockThemeService = getMockThemeService();

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    searchResult = new ItemSearchResult();
    searchResult.indexableObject = new Item();
    searchResult.indexableObject.uuid = id;
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule(
      {
        imports: [
          NoopAnimationsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
          ListableModule,
          ItemAdminSearchResultGridElementComponent,
        ],
        providers: [
          { provide: TruncatableService, useValue: mockTruncatableService },
          { provide: BitstreamDataService, useValue: mockBitstreamDataService },
          { provide: ThemeService, useValue: mockThemeService },
          { provide: AuthService, useClass: AuthServiceStub },
          { provide: FileService, useClass: FileServiceStub },
          { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
        ],
        schemas: [NO_ERRORS_SCHEMA],
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
});
