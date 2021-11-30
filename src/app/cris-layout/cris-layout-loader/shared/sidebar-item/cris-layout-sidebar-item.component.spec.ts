import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrisLayoutSidebarItemComponent } from './cris-layout-sidebar-item.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { CrisLayoutLoaderDirective } from '../../../directives/cris-layout-loader.directive';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { tabPersonTest } from '../../../../shared/testing/layout-tab.mocks';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
        // CrisLayoutMetadataBoxComponent
      ],
      providers: [
        { provide: BitstreamDataService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutSidebarItemComponent);
    component = fixture.componentInstance;
    component.tab = tabPersonTest;
    fixture.detectChanges();
  });

});
