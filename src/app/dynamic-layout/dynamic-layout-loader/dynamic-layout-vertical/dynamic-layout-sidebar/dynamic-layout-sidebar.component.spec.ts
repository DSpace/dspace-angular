import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicLayoutTab } from '@dspace/core/layout/models/tab.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  tabPersonBibliometrics,
  tabPersonBiography,
  tabPersonProfile,
} from '@dspace/core/testing/layout-tab.mocks';
import { BehaviorSubject } from 'rxjs';

import { DynamicLayoutSidebarItemComponent } from '../../shared/sidebar-item/dynamic-layout-sidebar-item.component';
import { DynamicLayoutSidebarComponent } from './dynamic-layout-sidebar.component';

describe('DynamicLayoutSidebarComponent', () => {
  let component: DynamicLayoutSidebarComponent;
  let fixture: ComponentFixture<DynamicLayoutSidebarComponent>;
  let de: DebugElement;
  const tabs = [tabPersonProfile, tabPersonBiography, tabPersonBibliometrics];

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
        RouterTestingModule,
        DynamicLayoutSidebarComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DynamicLayoutSidebarComponent, { remove: { imports: [DynamicLayoutSidebarItemComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutSidebarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  describe('when no tabs', () => {

    beforeEach(() => {
      component.tabs = [];
      component.item = mockItem;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not show sidebar', () => {
      expect(de.query(By.css('#sidebar'))).toBeNull();
    });

    it('should not show sidebar show/hide button', () => {
      expect(de.query(By.css('.menu-toggle'))).toBeNull();
    });

  });

  describe('when there are tabs', () => {
    beforeEach(() => {
      component.item = mockItem;
      component.tabs = tabs;
      component.showNav = true;
      component.activeTab$ = new BehaviorSubject<DynamicLayoutTab>(tabs[0]);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show sidebar', () => {
      expect(de.query(By.css('#sidebar'))).toBeTruthy();
    });

    it('should show sidebar show/hide button', () => {
      expect(de.query(By.css('.menu-toggle'))).toBeTruthy();
    });

    it('should show 3 sidebar items', () => {
      expect(de.queryAll(By.css('ds-dynamic-layout-sidebar-item')).length).toEqual(3);
    });

    it('when first click show/hide button should hide sidebar', () => {
      const btn = de.query(By.css('.menu-toggle'));
      btn.nativeElement.click();
      fixture.detectChanges();
      expect(de.query(By.css('#sidebar'))).toBeNull();
    });

  });

});
