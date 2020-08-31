import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutDefaultTabComponent } from './cris-layout-default-tab.component';
import { LayoutPage } from '../../enums/layout-page.enum';
import { Observable } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list';
import { Box } from 'src/app/core/layout/models/box.model';
import { cold } from 'jasmine-marbles';
import { createSuccessfulRemoteDataObject } from 'src/app/shared/remote-data.utils';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { boxMetadata } from 'src/app/shared/testing/box.mock';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrisLayoutLoaderDirective } from '../../directives/cris-layout-loader.directive';
import { CrisLayoutMetadataBoxComponent } from '../boxes/metadata/cris-layout-metadata-box.component';
import { ComponentFactoryResolver, NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import * as CrisLayoutBoxDecorators from '../../decorators/cris-layout-box.decorator';
import { spyOnExported } from 'src/app/shared/testing/utils.test';
import { BoxDataService } from 'src/app/core/layout/box-data.service';
import { tabPersonTest } from 'src/app/shared/testing/tab.mock';
import { MetadataComponentsDataService } from 'src/app/core/layout/metadata-components-data.service';
import { MetadataComponent } from 'src/app/core/layout/models/metadata-component.model';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';

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
      a: createSuccessfulRemoteDataObject(
        new PaginatedList(new PageInfo(), [boxMetadata])
      )
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

describe('CrisLayoutDefaultTabComponent', () => {
  let component: CrisLayoutDefaultTabComponent;
  let fixture: ComponentFixture<CrisLayoutDefaultTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [
        CrisLayoutDefaultTabComponent,
        CrisLayoutLoaderDirective,
        CrisLayoutMetadataBoxComponent
      ],
      providers: [
        ComponentFactoryResolver,
        {provide: BoxDataService, useClass: BoxDataServiceMock},
        {provide: MetadataComponentsDataService, useClass: MetadataComponentsDataServiceMock},
        {provide: BitstreamDataService, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CrisLayoutDefaultTabComponent, {
      set: {
        entryComponents: [CrisLayoutMetadataBoxComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutDefaultTabComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    component.boxes = [boxMetadata];
    component.tab = tabPersonTest;
    spyOnExported(CrisLayoutBoxDecorators, 'getCrisLayoutBox').and.returnValue(CrisLayoutMetadataBoxComponent);
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {
    it('should call the getCrisLayoutBox function with the right types', () => {
      component.addBoxes([boxMetadata]);
      expect(CrisLayoutBoxDecorators.getCrisLayoutBox).toHaveBeenCalledWith(new TestItem() as Item, tabPersonTest.shortname, boxMetadata.boxType);
    })
  });
});
