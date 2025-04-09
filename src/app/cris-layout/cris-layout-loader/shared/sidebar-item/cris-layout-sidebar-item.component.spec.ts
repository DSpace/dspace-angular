import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { tabPersonTest } from '../../../../shared/testing/layout-tab.mocks';
import { CrisLayoutLoaderDirective } from '../../../directives/cris-layout-loader.directive';
import { CrisLayoutSidebarItemComponent } from './cris-layout-sidebar-item.component';

describe('CrisLayoutSidebarItemComponent', () => {
  let component: CrisLayoutSidebarItemComponent;
  let fixture: ComponentFixture<CrisLayoutSidebarItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }),
      NoopAnimationsModule, CrisLayoutSidebarItemComponent,
      CrisLayoutLoaderDirective],
      providers: [
        { provide: BitstreamDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutSidebarItemComponent);
    component = fixture.componentInstance;
    component.tab = tabPersonTest;
    fixture.detectChanges();
  });

});
