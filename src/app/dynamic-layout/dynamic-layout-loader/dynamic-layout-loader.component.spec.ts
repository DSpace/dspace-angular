import { CommonModule } from '@angular/common';
import {
  EventEmitter,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
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
import { of } from 'rxjs';

import { Item } from '../../core/shared/item.model';
import { HostWindowService } from '../../shared/host-window.service';
import { DynamicLayoutLoaderDirective } from '../directives/dynamic-layout-loader.directive';
import { DynamicLayoutHorizontalComponent } from './dynamic-layout-horizontal/dynamic-layout-horizontal.component';
import { DynamicLayoutLoaderComponent } from './dynamic-layout-loader.component';
import { DynamicLayoutVerticalComponent } from './dynamic-layout-vertical/dynamic-layout-vertical.component';

describe('DynamicLayoutLoaderComponent', () => {
  let component: DynamicLayoutLoaderComponent;
  let fixture: ComponentFixture<DynamicLayoutLoaderComponent>;
  const windowServiceStub = new HostWindowServiceStub(1200);

  const translateServiceStub = {
    get: () => of('translated-text'),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
        DynamicLayoutLoaderComponent,
        DynamicLayoutLoaderDirective,
        DynamicLayoutVerticalComponent,
        DynamicLayoutHorizontalComponent,
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: {  snapshot: {
          paramMap: {
            get: (key: string) => {
              const params = {
                tab: 'test-tab',
              };
              return params[key];
            },
          },
        } } },
        { provide: HostWindowService, useValue: windowServiceStub },
        { provide: APP_CONFIG, useValue: {
          layout: {
            itemPage: {
              default: {
                orientation: 'horizontal',
              },
            },
          },
        },
        },

      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
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

  it('if config is vertical should show vertical component', () => {
    component.layoutConfiguration = { orientation: 'vertical' };
    component.initComponent();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.vertical-layout'))).toBeTruthy();
  });

  it('if config is horizontal should show horizontal component', () => {
    component.layoutConfiguration = { orientation: 'horizontal' };
    component.initComponent();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.horizontal-layout'))).toBeTruthy();
  });

});
