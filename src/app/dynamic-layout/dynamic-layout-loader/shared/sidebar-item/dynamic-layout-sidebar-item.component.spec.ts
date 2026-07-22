import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { tabPersonTest } from '@dspace/core/testing/layout-tab.mocks';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { DynamicLayoutLoaderDirective } from '../../../directives/dynamic-layout-loader.directive';
import { DynamicLayoutSidebarItemComponent } from './dynamic-layout-sidebar-item.component';

describe('DynamicLayoutSidebarItemComponent', () => {
  let component: DynamicLayoutSidebarItemComponent;
  let fixture: ComponentFixture<DynamicLayoutSidebarItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }),
      NoopAnimationsModule, DynamicLayoutSidebarItemComponent,
      DynamicLayoutLoaderDirective],
      providers: [
        { provide: BitstreamDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutSidebarItemComponent);
    component = fixture.componentInstance;
    component.tab = tabPersonTest;
    fixture.detectChanges();
  });

});
