import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CrisLayoutSidebarComponent } from './cris-layout-sidebar.component';
import { By } from '@angular/platform-browser';
import { loaderMultilevelTabs } from '../../../../shared/testing/new-layout-tabs';

describe('CrisLayoutSidebarComponent', () => {
  let component: CrisLayoutSidebarComponent;
  let fixture: ComponentFixture<CrisLayoutSidebarComponent>;
  let de: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutSidebarComponent ]
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
      expect(de.query(By.css('.custom-menu'))).toBeNull();
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
      expect(de.query(By.css('.custom-menu'))).toBeTruthy();
    });

    it('should show 3 sidebar items', () => {
      expect(de.queryAll(By.css('ds-cris-layout-sidebar-item')).length).toEqual(3);
    });

    it('when first click show/hide button should hide sidebar', () => {
      const btn = de.query(By.css('.btn-arrow'));
      btn.nativeElement.click();
      fixture.detectChanges();
      expect(de.query(By.css('#sidebar'))).toBeNull();
    });

  });

});
