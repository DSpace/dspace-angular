import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { HostWindowService } from '../host-window.service';
import { SidebarServiceStub } from '../testing/sidebar-service.stub';
import { PageWithSidebarComponent } from './page-with-sidebar.component';
import { SidebarService } from './sidebar.service';

describe('PageWithSidebarComponent', () => {
  let comp: PageWithSidebarComponent;
  let fixture: ComponentFixture<PageWithSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, PageWithSidebarComponent],
      providers: [
        {
          provide: SidebarService,
          useClass: SidebarServiceStub,
        },
        {
          provide: HostWindowService, useValue: jasmine.createSpyObj('hostWindowService', {
            isXs: of(true),
            isSm: of(false),
            isXsOrSm: of(true),
          }),
        },
      ],
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
      (comp as any).sidebarService.isCollapsed = of(true);
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
      (comp as any).sidebarService.isCollapsed = of(false);
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it('should open the menu', () => {
      expect(menu.classList).toContain('active');
    });
  });
});
