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
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { APP_CONFIG } from '../../../config/app-config.interface';
import { Item } from '../../core/shared/item.model';
import { HostWindowService } from '../../shared/host-window.service';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service.stub';
import { loaderTabs } from '../../shared/testing/layout-tab.mocks';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { CrisLayoutHorizontalComponent } from './cris-layout-horizontal/cris-layout-horizontal.component';
import { CrisLayoutLoaderComponent } from './cris-layout-loader.component';
import { CrisLayoutVerticalComponent } from './cris-layout-vertical/cris-layout-vertical.component';

describe('CrisLayoutLoaderComponent', () => {
  let component: CrisLayoutLoaderComponent;
  let fixture: ComponentFixture<CrisLayoutLoaderComponent>;
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
        CrisLayoutLoaderComponent,
        CrisLayoutLoaderDirective,
        CrisLayoutVerticalComponent,
        CrisLayoutHorizontalComponent,
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
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: HostWindowService, useValue: windowServiceStub },
        { provide: APP_CONFIG, useValue: {
          crisLayout: {
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
    fixture = TestBed.createComponent(CrisLayoutLoaderComponent);
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
