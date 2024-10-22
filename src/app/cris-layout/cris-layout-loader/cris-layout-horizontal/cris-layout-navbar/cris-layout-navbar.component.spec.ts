import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CrisLayoutNavbarComponent } from './cris-layout-navbar.component';
import { HostWindowService } from '../../../../shared/host-window.service';
import { HostWindowServiceStub } from '../../../../shared/testing/host-window-service.stub';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { loaderMultilevelTabs } from '../../../../shared/testing/layout-tab.mocks';
import { RouterStub } from '../../../../shared/testing/router.stub';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { Item } from '../../../../core/shared/item.model';
import { CrisLayoutTab } from '../../../../core/layout/models/tab.model';
import { BehaviorSubject } from 'rxjs';


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
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [CrisLayoutNavbarComponent],
      providers: [
        { provide: HostWindowService, useValue: windowServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    })
      .compileComponents();
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
