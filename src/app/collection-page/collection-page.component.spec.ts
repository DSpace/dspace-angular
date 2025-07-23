import {
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  provideRouter,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment.test';

import { APP_CONFIG } from '../../config/app-config.interface';
import { AuthService } from '../core/auth/auth.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { Bitstream } from '../core/shared/bitstream.model';
import { Collection } from '../core/shared/collection.model';
import { ThemedComcolPageBrowseByComponent } from '../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ThemedComcolPageContentComponent } from '../shared/comcol/comcol-page-content/themed-comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { ContextMenuComponent } from '../shared/context-menu/context-menu.component';
import { DsoEditMenuComponent } from '../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ErrorComponent } from '../shared/error/error.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../shared/object-collection/object-collection.component';
import {
  createNoContentRemoteDataObject,
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject,
} from '../shared/remote-data.utils';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { RouterStub } from '../shared/testing/router.stub';
import { VarDirective } from '../shared/utils/var.directive';
import { CollectionPageComponent } from './collection-page.component';

describe('CollectionPageComponent', () => {
  let component: CollectionPageComponent;
  let fixture: ComponentFixture<CollectionPageComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authorizationDataServiceSpy: jasmine.SpyObj<AuthorizationDataService>;
  let dsoNameServiceSpy: jasmine.SpyObj<DSONameService>;
  const aroute: ActivatedRouteStub = new ActivatedRouteStub();
  const router = new RouterStub();

  const logoRD = createSuccessfulRemoteDataObject(Object.assign(new Bitstream(), {
    name: 'Test Logo',
  }));
  const collectionWithLogo = Object.assign(new Collection(), {
    name: 'Test Collection',
    logo: of(logoRD),
  });
  const collectionWithLogoRD = createSuccessfulRemoteDataObject(collectionWithLogo);

  const collectionWithoutLogo = Object.assign(new Collection(), {
    name: 'Test Collection',
    logo: createNoContentRemoteDataObject$(),
  });
  const collectionWithoutLogoRD = createSuccessfulRemoteDataObject(collectionWithoutLogo);

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    authorizationDataServiceSpy = jasmine.createSpyObj('AuthorizationDataService', ['isAuthorized']);
    dsoNameServiceSpy = jasmine.createSpyObj('DSONameService', ['getName']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, TranslateModule.forRoot(), BrowserAnimationsModule, CollectionPageComponent, VarDirective],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: aroute },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AuthorizationDataService, useValue: authorizationDataServiceSpy },
        { provide: DSONameService, useValue: dsoNameServiceSpy },
        { provide: APP_CONFIG, useValue: environment },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CollectionPageComponent, { remove: { imports: [ThemedComcolPageContentComponent, ErrorComponent, ThemedLoadingComponent, ComcolPageHeaderComponent, ComcolPageLogoComponent, ThemedComcolPageHandleComponent, DsoEditMenuComponent, ThemedComcolPageBrowseByComponent, ObjectCollectionComponent, ContextMenuComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPageComponent);
    component = fixture.componentInstance;
    authServiceSpy.isAuthenticated.and.returnValue(of(true));
    authorizationDataServiceSpy.isAuthorized.and.returnValue(of(true));
  });

  describe('when collection has no logo', () => {
    beforeEach(() => {
      aroute.testData = {
        dso: collectionWithoutLogoRD,
      };
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the component', () => {
      expect(component.collectionRD$).toBeObservable(cold('(a|)', {
        a: collectionWithoutLogoRD,
      }));
      expect(component.logoRD$).toBeObservable(cold('(a|)', {
        a: createNoContentRemoteDataObject(),
      }));
      expect(component.logoRD$).toBeDefined();
      expect(component.isCollectionAdmin$).toBeDefined();
      expect(component.collectionPageRoute$).toBeDefined();
    });

    it('should display collection name', fakeAsync(() => {
      const collectionNameElement = fixture.debugElement.query(By.css('ds-comcol-page-header'));
      expect(collectionNameElement).toBeDefined();
    }));

  });

  describe('when collection has logo', () => {
    beforeEach(() => {
      aroute.testData = {
        dso: collectionWithLogoRD,
      };
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the component', () => {
      expect(component.collectionRD$).toBeObservable(cold('(a|)', {
        a: collectionWithLogoRD,
      }));
      expect(component.logoRD$).toBeObservable(cold('(a|)', {
        a: logoRD,
      }));
      expect(component.isCollectionAdmin$).toBeDefined();
      expect(component.collectionPageRoute$).toBeDefined();
    });

    it('should display collection name', fakeAsync(() => {
      const collectionNameElement = fixture.debugElement.query(By.css('ds-comcol-page-header'));
      expect(collectionNameElement).toBeDefined();
    }));

    it('should display collection logo', fakeAsync(() => {
      const collectionLogoElement = fixture.debugElement.query(By.css('ds-comcol-page-logo'));
      expect(collectionLogoElement).toBeDefined();
    }));

  });

});
