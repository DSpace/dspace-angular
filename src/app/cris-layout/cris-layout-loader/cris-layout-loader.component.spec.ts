import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { CrisLayoutLoaderComponent } from './cris-layout-loader.component';
import { Item } from '../../core/shared/item.model';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { MockActivatedRoute } from '../../shared/mocks/active-router.mock';
import { HostWindowService } from '../../shared/host-window.service';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service.stub';
import { CommonModule } from '@angular/common';
import { CrisLayoutVerticalComponent } from './cris-layout-vertical/cris-layout-vertical.component';
import { CrisLayoutHorizontalComponent } from './cris-layout-horizontal/cris-layout-horizontal.component';
import { loaderTabs } from '../../shared/testing/layout-tab.mocks';

describe('CrisLayoutLoaderComponent', () => {
  let component: CrisLayoutLoaderComponent;
  let fixture: ComponentFixture<CrisLayoutLoaderComponent>;
  const windowServiceStub = new HostWindowServiceStub(1200);

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test'
        }
      ],
      'dspace.entity.type': [
        {
          language: null,
          value: 'Person'
        }
      ]
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule
      ],
      declarations: [
        CrisLayoutLoaderComponent,
        CrisLayoutLoaderDirective,
        CrisLayoutVerticalComponent,
        CrisLayoutHorizontalComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: HostWindowService, useValue: windowServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
