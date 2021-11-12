import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrisLayoutSidebarItemComponent } from './cris-layout-sidebar-item.component';
import { LayoutPage } from '../../../enums/layout-page.enum';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { Box } from '../../../../core/layout/models/box.model';
import { cold } from 'jasmine-marbles';
import { createSuccessfulRemoteDataObject } from '../../../../shared/remote-data.utils';
import { boxMetadata } from '../../../../shared/testing/box.mock';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { CrisLayoutLoaderDirective } from '../../../directives/cris-layout-loader.directive';
import { CrisLayoutMetadataBoxComponent } from '../../boxes/metadata/cris-layout-metadata-box.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { BoxDataService } from '../../../../core/layout/box-data.service';
import { tabPersonTest } from '../../../../shared/testing/tab.mock';
import { MetadataComponentsDataService } from '../../../../core/layout/metadata-components-data.service';
import { MetadataComponent } from '../../../../core/layout/models/metadata-component.model';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const testType = LayoutPage.DEFAULT;

class TestItem {
  firstMetadataValue(key: string): string {
    return testType;
  }
}

// tslint:disable-next-line: max-classes-per-file
class BoxDataServiceMock {
  findByItem(itemUuid: string, tabId: number): Observable<RemoteData<PaginatedList<Box>>> {
    return cold('a|', {
      a: createSuccessfulRemoteDataObject(createPaginatedList([boxMetadata]))
    });
  }
}

// tslint:disable-next-line: max-classes-per-file
class MetadataComponentsDataServiceMock {
  findById(boxShortname: string): Observable<RemoteData<MetadataComponent>> {
    return cold('a|', {
      a: createSuccessfulRemoteDataObject({})
    });
  }
}

describe('CrisLayoutSidebarItemComponent', () => {
  let component: CrisLayoutSidebarItemComponent;
  let fixture: ComponentFixture<CrisLayoutSidebarItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }),
        NoopAnimationsModule,
        // BrowserAnimationsModule
      ],
      declarations: [
        CrisLayoutSidebarItemComponent,
        CrisLayoutLoaderDirective,
        CrisLayoutMetadataBoxComponent
      ],
      providers: [
        { provide: BoxDataService, useClass: BoxDataServiceMock },
        { provide: MetadataComponentsDataService, useClass: MetadataComponentsDataServiceMock },
        { provide: BitstreamDataService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CrisLayoutSidebarItemComponent, {
      set: {
        entryComponents: [CrisLayoutMetadataBoxComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutSidebarItemComponent);
    component = fixture.componentInstance;
    // component.item = new TestItem() as Item;
    // component.boxes = [boxMetadata];
    component.tab = tabPersonTest;
    fixture.detectChanges();
  });

});
