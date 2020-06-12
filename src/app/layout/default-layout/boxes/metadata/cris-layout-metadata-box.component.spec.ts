import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutMetadataBoxComponent } from './cris-layout-metadata-box.component';
import { Observable } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { MetadataComponent } from 'src/app/core/layout/models/metadata-component.model';
import { cold } from 'jasmine-marbles';
import { createSuccessfulRemoteDataObject } from 'src/app/shared/remote-data.utils';
import { medataComponent } from 'src/app/shared/testing/metadata-components.mock';
import { Item } from 'src/app/core/shared/item.model';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrisLayoutLoaderDirective } from 'src/app/layout/directives/cris-layout-loader.directive';
import { RowComponent } from '../components/row/row.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LayoutPage } from 'src/app/layout/enums/layout-page.enum';
import { By } from '@angular/platform-browser';
import { MetadataComponentsDataService } from 'src/app/core/layout/metadata-components-data.service';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';
import { boxMetadata } from 'src/app/shared/testing/box.mock';
import { TextComponent } from '../components/text/text.component';

const testType = LayoutPage.DEFAULT;

class TestItem {
  firstMetadataValue(key: string): string {
    return testType;
  }
}

// tslint:disable-next-line: max-classes-per-file
class MetadataComponentsDataServiceMock {
  findById(boxShortname: string): Observable<RemoteData<MetadataComponent>> {
    return cold('a|', {
      a: createSuccessfulRemoteDataObject(medataComponent)
    });
  }
}

// tslint:disable-next-line: max-classes-per-file
class BitstreamDataServiceMock {
  getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
    return cold('a|', {
      a: createSuccessfulRemoteDataObject({})
    });
  }
}

describe('CrisLayoutMetadataBoxComponent', () => {
  let component: CrisLayoutMetadataBoxComponent;
  let fixture: ComponentFixture<CrisLayoutMetadataBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      providers: [
        { provide: MetadataComponentsDataService, useClass: MetadataComponentsDataServiceMock },
        { provide: BitstreamDataService, useClass: BitstreamDataServiceMock }
      ],
      declarations: [
        CrisLayoutMetadataBoxComponent,
        CrisLayoutLoaderDirective,
        RowComponent,
        TextComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CrisLayoutMetadataBoxComponent, {
      set: {
        entryComponents: [TextComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutMetadataBoxComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    component.box = boxMetadata;
    component.metadatacomponents = medataComponent;
    fixture.detectChanges();
  });

  it('check rows rendering', () => {
    const rowsFound = fixture.debugElement.queryAll(By.css('div[ds-row]'));
    expect(rowsFound.length).toEqual(2);
  });
});
