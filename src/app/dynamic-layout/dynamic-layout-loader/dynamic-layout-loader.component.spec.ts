import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  provideRouter,
} from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { HostWindowServiceStub } from '@dspace/core/testing/host-window-service.stub';
import { loaderTabs } from '@dspace/core/testing/layout-tab.mocks';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { Item } from '../../core/shared/item.model';
import { DynamicComponentLoaderDirective } from '../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { HostWindowService } from '../../shared/host-window.service';
import { getMockThemeService } from '../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { DynamicLayoutHorizontalComponent } from './dynamic-layout-horizontal/dynamic-layout-horizontal.component';
import { DynamicLayoutLoaderComponent } from './dynamic-layout-loader.component';
import { DynamicLayoutVerticalComponent } from './dynamic-layout-vertical/dynamic-layout-vertical.component';

describe('DynamicLayoutLoaderComponent', () => {
  let component: DynamicLayoutLoaderComponent;
  let fixture: ComponentFixture<DynamicLayoutLoaderComponent>;
  const windowServiceStub = new HostWindowServiceStub(1200);

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test',
        },
      ],
      'dspace.entity.type': [
        {
          language: null,
          value: 'Person',
        },
      ],
    },
  });

  function configureTestBed(orientation: string) {
    return TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
        DynamicLayoutLoaderComponent,
        DynamicComponentLoaderDirective,
        DynamicLayoutVerticalComponent,
        DynamicLayoutHorizontalComponent,
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: {
          paramMap: {
            get: (key: string) => {
              const params = { tab: 'test-tab' };
              return params[key];
            },
          },
        } } },
        { provide: HostWindowService, useValue: windowServiceStub },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: APP_CONFIG, useValue: {
          layout: {
            itemPage: {
              default: {
                orientation,
              },
            },
          },
        } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }

  describe('with horizontal orientation', () => {
    beforeEach(async () => {
      await configureTestBed('horizontal');
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(DynamicLayoutLoaderComponent);
      component = fixture.componentInstance;
      component.item = mockItem;
      component.leadingTabs = [];
      component.tabs = loaderTabs;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show horizontal component', () => {
      expect(fixture.debugElement.query(By.css('.horizontal-layout'))).toBeTruthy();
    });
  });

  describe('with vertical orientation', () => {
    beforeEach(async () => {
      await configureTestBed('vertical');
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(DynamicLayoutLoaderComponent);
      component = fixture.componentInstance;
      component.item = mockItem;
      component.leadingTabs = [];
      component.tabs = loaderTabs;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show vertical component', () => {
      expect(fixture.debugElement.query(By.css('.vertical-layout'))).toBeTruthy();
    });
  });

});
