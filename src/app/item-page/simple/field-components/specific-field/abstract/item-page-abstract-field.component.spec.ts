import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { environment } from '../../../../../../environments/environment';
import { BrowseService } from '../../../../../../../modules/core/src/lib/core/browse/browse.service';
import { BrowseDefinitionDataService } from '../../../../../../../modules/core/src/lib/core/browse/browse-definition-data.service';
import { APP_CONFIG } from '../../../../../../../modules/core/src/lib/core/config/app-config.interface';
import { BrowseDefinitionDataServiceStub } from '../../../../../../../modules/core/src/lib/core/utilities/testing/browse-definition-data-service.stub';
import { BrowseServiceStub } from '../../../../../../../modules/core/src/lib/core/utilities/testing/browse-service.stub';
import { TranslateLoaderMock } from '../../../../../../../modules/core/src/lib/core/utilities/testing/translate-loader.mock';
import { ItemPageAbstractFieldComponent } from './item-page-abstract-field.component';

let comp: ItemPageAbstractFieldComponent;
let fixture: ComponentFixture<ItemPageAbstractFieldComponent>;

describe('ItemPageAbstractFieldComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ItemPageAbstractFieldComponent,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: BrowseDefinitionDataService, useValue: BrowseDefinitionDataServiceStub },
        { provide: BrowseService, useValue: BrowseServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemPageAbstractFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {

    fixture = TestBed.createComponent(ItemPageAbstractFieldComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should render a ds-metadata-values', () => {
    expect(fixture.debugElement.query(By.css('ds-metadata-values'))).not.toBeNull();
  });
});
