import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  of,
} from 'rxjs';

import { CrisLayoutTab } from '../../../../core/layout/models/tab.model';
import { Item } from '../../../../core/shared/item.model';
import { HostWindowService } from '../../../../shared/host-window.service';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { HostWindowServiceStub } from '../../../../shared/testing/host-window-service.stub';
import { loaderMultilevelTabs } from '../../../../shared/testing/layout-tab.mocks';
import { RouterStub } from '../../../../shared/testing/router.stub';
import { CrisLayoutSidebarItemComponent } from '../../shared/sidebar-item/cris-layout-sidebar-item.component';
import { CrisLayoutNavbarComponent } from './cris-layout-navbar.component';


describe('CrisLayoutNavbarComponent', () => {
  let component: CrisLayoutNavbarComponent;
  let fixture: ComponentFixture<CrisLayoutNavbarComponent>;
  let de: DebugElement;
  let router: RouterStub;

  const windowServiceStub = new HostWindowServiceStub(1000);

  const activatedRouteStub = new ActivatedRouteStub();

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
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        CrisLayoutNavbarComponent,
      ],
      providers: [
        { provide: HostWindowService, useValue: windowServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    })
      .overrideComponent(CrisLayoutNavbarComponent, { remove: { imports: [CrisLayoutSidebarItemComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutNavbarComponent);
    router = TestBed.inject(Router) as unknown as RouterStub;
    router.setNavigateReturnValue(true);
    component = fixture.componentInstance;
    component.item = mockItem;
    component.tabs = [];
    component.showNav = true;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('when there are tabs', () => {

    beforeEach(() => {
      component.tabs = loaderMultilevelTabs;
      component.item = mockItem;
      component.activeTab$ = new BehaviorSubject<CrisLayoutTab>(loaderMultilevelTabs[0]);
      component.isXsOrSm$ = of(true);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('navbar should be collapsed', () => {
      expect(de.query(By.css('.cris-layout-navbar.collapsed'))).toBeTruthy();
      expect(de.query(By.css('.cris-layout-navbar.expanded'))).toBeNull();
    });

    describe('when small screens < 576', () => {

      beforeEach(() => {
        windowServiceStub.setWidth(400);
        component.ngOnInit();
        fixture.detectChanges();
      });

      xit('should show navbar items', () => {
        expect(de.query(By.css('.cris-layout-navbar')).nativeElement.clientHeight).toEqual(0);
      });

      it('should not show navbar-toggler', () => {
        expect(de.query(By.css('.navbar-toggler'))).toBeTruthy();
      });

      it('when click navbar-toggler should be expanded', () => {

        const navbarToggler = de.query(By.css('.navbar-toggler'));
        navbarToggler.nativeElement.click();
        fixture.detectChanges();

        expect(de.query(By.css('.cris-layout-navbar.expanded'))).toBeTruthy();
        expect(de.query(By.css('.cris-layout-navbar.collapsed'))).toBeNull();
      });

    });
  });




});
