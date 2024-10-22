import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';

import { PageWithSidebarComponent } from './page-with-sidebar.component';
import { SidebarService } from './sidebar.service';
import { HostWindowService } from '../host-window.service';
import { SidebarServiceStub } from '../testing/sidebar-service.stub';

describe('PageWithSidebarComponent', () => {
  let comp: PageWithSidebarComponent;
  let fixture: ComponentFixture<PageWithSidebarComponent>;
  let sidebarService: any;

  describe('', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
        providers: [
          {
            provide: SidebarService,
            useClass: SidebarServiceStub
          },
          {
            provide: HostWindowService, useValue: jasmine.createSpyObj('hostWindowService',
              {
                isXs: observableOf(true),
                isSm: observableOf(false),
                isXsOrSm: observableOf(true)
              })
          },
        ],
        declarations: [PageWithSidebarComponent]
      }).compileComponents().then(() => {
        fixture = TestBed.createComponent(PageWithSidebarComponent);
        comp = fixture.componentInstance;
        comp.id = 'mock-id';
        fixture.detectChanges();
      });
    }));

    describe('when sidebarCollapsed is true in mobile view', () => {
      let menu: HTMLElement;

      beforeEach(() => {
        menu = fixture.debugElement.query(By.css('#mock-id-sidebar-content')).nativeElement;
        (comp as any).sidebarService.isCollapsed = observableOf(true);
        comp.ngOnInit();
        fixture.detectChanges();
      });

      it('should close the sidebar', () => {
        expect(menu.classList).not.toContain('active');
      });

    });

    describe('when sidebarCollapsed is false in mobile view', () => {
      let menu: HTMLElement;

      beforeEach(() => {
        menu = fixture.debugElement.query(By.css('#mock-id-sidebar-content')).nativeElement;
        (comp as any).sidebarService.isCollapsed = observableOf(false);
        comp.ngOnInit();
        fixture.detectChanges();
      });

      it('should open the menu', () => {
        expect(menu.classList).toContain('col-md-3');
      });
    });

    describe('when sidebarCollapsed is true in desktop view', () => {
      let menu: HTMLElement;
      let secMenu: HTMLElement;

      beforeEach(() => {
        menu = fixture.debugElement.query(By.css('#mock-id-sidebar-content')).nativeElement;
        secMenu = fixture.debugElement.query(By.css('#mock-id-sidebar-content-xl')).nativeElement;
        (comp as any).sidebarService.isCollapsedInXL = observableOf(true);
        comp.ngOnInit();
        fixture.detectChanges();
      });

      it('should close the sidebar', () => {
        expect(menu.classList).toContain('d-none');
        expect(secMenu.classList).toContain('col-md-12');
      });

    });

    describe('when sidebarCollapsed is false in desktop view', () => {
      let menu: HTMLElement;
      let secMenu: HTMLElement;

      beforeEach(() => {
        menu = fixture.debugElement.query(By.css('#mock-id-sidebar-content')).nativeElement;
        secMenu = fixture.debugElement.query(By.css('#mock-id-sidebar-content-xl')).nativeElement;
        (comp as any).sidebarService.isCollapsedInXL = observableOf(false);
        comp.ngOnInit();
        fixture.detectChanges();
      });

      it('should open the menu', () => {
        expect(menu.classList).not.toContain('d-none');
        expect(secMenu.classList).not.toContain('col-md-12');
      });
    });
  });

  describe('', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
        providers: [
          {
            provide: SidebarService,
            useClass: SidebarServiceStub
          },
          {
            provide: HostWindowService, useValue: jasmine.createSpyObj('hostWindowService',
              {
                isXs: observableOf(false),
                isSm: observableOf(false),
                isXsOrSm: observableOf(false)
              })
          },
        ],
        declarations: [PageWithSidebarComponent]
      }).compileComponents().then(() => {
        fixture = TestBed.createComponent(PageWithSidebarComponent);
        comp = fixture.componentInstance;
        sidebarService = TestBed.inject(SidebarService) as jasmine.SpyObj<SidebarService>;
        comp.id = 'mock-id';
      });
    }));

    describe('when collapseSidebar is false in desktop view', () => {
      let menu: HTMLElement;
      let secMenu: HTMLElement;

      beforeEach(() => {
        comp.collapseSidebar = false;
        spyOn(comp as any, 'isSidebarCollapsed').and.returnValue(observableOf(false));
        spyOn(comp as any, 'isSidebarCollapsedXL').and.returnValue(observableOf(false));
        fixture.detectChanges();
      });

      it('should open the menu', () => {
        menu = fixture.debugElement.query(By.css('#mock-id-sidebar-content')).nativeElement;
        secMenu = fixture.debugElement.query(By.css('#mock-id-sidebar-content-xl')).nativeElement;
        expect(menu.classList).not.toContain('d-none');
        expect(secMenu.classList).not.toContain('col-md-12');
      });
    });

    describe('when collapseSidebar is true in desktop view', () => {
      let menu: HTMLElement;
      let secMenu: HTMLElement;

      beforeEach(() => {
        comp.collapseSidebar = true;
        spyOn(comp as any, 'isSidebarCollapsed').and.returnValue(observableOf(true));
        spyOn(comp as any, 'isSidebarCollapsedXL').and.returnValue(observableOf(true));
        fixture.detectChanges();
      });

      it('should close the sidebar', () => {
        menu = fixture.debugElement.query(By.css('#mock-id-sidebar-content')).nativeElement;
        secMenu = fixture.debugElement.query(By.css('#mock-id-sidebar-content-xl')).nativeElement;
        expect(menu.classList).toContain('d-none');
        expect(secMenu.classList).toContain('col-12');
      });
    });
  });
});
