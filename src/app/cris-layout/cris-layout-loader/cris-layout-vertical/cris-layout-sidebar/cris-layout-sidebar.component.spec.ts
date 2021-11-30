import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { CrisLayoutSidebarComponent } from './cris-layout-sidebar.component';
import { loaderMultilevelTabs } from '../../../../shared/testing/layout-tab.mocks';

describe('CrisLayoutSidebarComponent', () => {
  let component: CrisLayoutSidebarComponent;
  let fixture: ComponentFixture<CrisLayoutSidebarComponent>;
  let de: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ CrisLayoutSidebarComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutSidebarComponent);
    component = fixture.componentInstance;
    component.tabs = [];
    de = fixture.debugElement;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when no tabs', () => {

    it('should not show sidebar', () => {
      expect(de.query(By.css('#sidebar'))).toBeNull();
    });

    it('should not show sidebar show/hide button', () => {
      expect(de.query(By.css('.menu-toggle'))).toBeNull();
    });

  });

  describe('when there are tabs', () => {
    beforeEach(() => {
      component.tabs = loaderMultilevelTabs;
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('should show sidebar', () => {
      expect(de.query(By.css('#sidebar'))).toBeTruthy();
    });

    it('should show sidebar show/hide button', () => {
      expect(de.query(By.css('.menu-toggle'))).toBeTruthy();
    });

    it('should show 3 sidebar items', () => {
      expect(de.queryAll(By.css('ds-cris-layout-sidebar-item')).length).toEqual(3);
    });

    it('when first click show/hide button should hide sidebar', () => {
      const btn = de.query(By.css('.menu-toggle'));
      btn.nativeElement.click();
      fixture.detectChanges();
      expect(de.query(By.css('#sidebar'))).toBeNull();
    });

  });

});
