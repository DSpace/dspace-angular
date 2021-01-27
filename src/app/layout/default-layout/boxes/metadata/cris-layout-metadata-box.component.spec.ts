import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutMetadataBoxComponent } from './cris-layout-metadata-box.component';
import { Observable, of } from 'rxjs';
import { RemoteData } from '../../../../core/data/remote-data';
import { MetadataComponent } from '../../../../core/layout/models/metadata-component.model';
import { createSuccessfulRemoteDataObject } from '../../../../shared/remote-data.utils';
import { medataComponent } from '../../../../shared/testing/metadata-components.mock';
import { Item } from '../../../../core/shared/item.model';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrisLayoutLoaderDirective } from '../../../directives/cris-layout-loader.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LayoutPage } from '../../../enums/layout-page.enum';
import { By } from '@angular/platform-browser';
import { MetadataComponentsDataService } from '../../../../core/layout/metadata-components-data.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { boxMetadata } from '../../../../shared/testing/box.mock';
import { TextComponent } from '../components/text/text.component';
import { SharedModule } from '../../../../shared/shared.module';
import { RowComponent } from './row/row.component';

const testType = LayoutPage.DEFAULT;

class TestItem {
  firstMetadataValue(key: string): string {
    return testType;
  }
}

// tslint:disable-next-line: max-classes-per-file
class MetadataComponentsDataServiceMock {
  findById(boxShortname: string): Observable<RemoteData<MetadataComponent>> {
    return of(
      createSuccessfulRemoteDataObject(medataComponent)
    );
  }
}

// tslint:disable-next-line: max-classes-per-file
class BitstreamDataServiceMock {
  getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
    return of(
      createSuccessfulRemoteDataObject(null)
    );
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
      }),
      BrowserAnimationsModule,
      SharedModule],
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

  it('check rows rendering', (done) => {
    const rowsFound = fixture.debugElement.queryAll(By.css('div[ds-row]'));

    expect(rowsFound.length).toEqual(2);
    done();
  });
});
