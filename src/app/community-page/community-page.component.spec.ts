import { NO_ERRORS_SCHEMA } from '@angular/core';
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
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { Bitstream } from '../core/shared/bitstream.model';
import { Community } from '../core/shared/community.model';
import {
  createNoContentRemoteDataObject,
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject,
} from '../shared/remote-data.utils';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { RouterStub } from '../shared/testing/router.stub';
import { VarDirective } from '../shared/utils/var.directive';
import { CommunityPageComponent } from './community-page.component';

describe('CommunityPageComponent', () => {
  let component: CommunityPageComponent;
  let fixture: ComponentFixture<CommunityPageComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authorizationDataServiceSpy: jasmine.SpyObj<AuthorizationDataService>;
  let dsoNameServiceSpy: jasmine.SpyObj<DSONameService>;
  const aroute: ActivatedRouteStub = new ActivatedRouteStub();
  const router = new RouterStub();

  const logoRD = createSuccessfulRemoteDataObject(Object.assign(new Bitstream(), {
    name: 'Test Logo',
  }));

  const communityWithLogo = Object.assign(new Community(), {
    id: 'test-community',
    uuid: 'test-community',
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'test community',
      },
    ],
    logo: of(logoRD),
  });
  const communityWithLogoRD = createSuccessfulRemoteDataObject(communityWithLogo);

  const communityWithoutLogo = Object.assign(new Community(), {
    id: 'test-community',
    uuid: 'test-community',
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'test community',
      },
    ],
    logo: createNoContentRemoteDataObject$(),
  });
  const communityWithoutLogoRD = createSuccessfulRemoteDataObject(communityWithoutLogo);

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    authorizationDataServiceSpy = jasmine.createSpyObj('AuthorizationDataService', ['isAuthorized']);
    dsoNameServiceSpy = jasmine.createSpyObj('DSONameService', ['getName']);
    await TestBed.configureTestingModule({
    imports: [RouterTestingModule, FormsModule, TranslateModule.forRoot(), BrowserAnimationsModule, CommunityPageComponent, VarDirective],
    providers: [
        { provide: ActivatedRoute, useValue: aroute },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AuthorizationDataService, useValue: authorizationDataServiceSpy },
        { provide: DSONameService, useValue: dsoNameServiceSpy },
    ],
    schemas: [NO_ERRORS_SCHEMA],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPageComponent);
    component = fixture.componentInstance;
    authServiceSpy.isAuthenticated.and.returnValue(of(true));
    authorizationDataServiceSpy.isAuthorized.and.returnValue(of(true));
  });

  describe('when community has no logo', () => {
    beforeEach(() => {
      aroute.testData = {
        dso: communityWithoutLogoRD,
      };
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the component', () => {
      expect(component.communityRD$).toBeObservable(cold('(a)', {
        a: communityWithoutLogoRD,
      }));
      expect(component.logoRD$).toBeObservable(cold('(a)', {
        a: createNoContentRemoteDataObject(),
      }));
      expect(component.logoRD$).toBeDefined();
      expect(component.isCommunityAdmin$).toBeDefined();
      expect(component.communityPageRoute$).toBeDefined();
    });

    it('should display community name', fakeAsync(() => {
      const collectionNameElement = fixture.debugElement.query(By.css('ds-comcol-page-header'));
      expect(collectionNameElement).toBeDefined();
    }));

  });

  describe('when community has logo', () => {
    beforeEach(() => {
      aroute.testData = {
        dso: communityWithLogoRD,
      };
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the component', () => {
      expect(component.communityRD$).toBeObservable(cold('(a)', {
        a: communityWithLogoRD,
      }));
      expect(component.logoRD$).toBeObservable(cold('(a)', {
        a: logoRD,
      }));
      expect(component.isCommunityAdmin$).toBeDefined();
      expect(component.communityPageRoute$).toBeDefined();
    });

    it('should display community name', fakeAsync(() => {
      const collectionNameElement = fixture.debugElement.query(By.css('ds-comcol-page-header'));
      expect(collectionNameElement).toBeDefined();
    }));

    it('should display community logo', fakeAsync(() => {
      const collectionLogoElement = fixture.debugElement.query(By.css('ds-comcol-page-logo'));
      expect(collectionLogoElement).toBeDefined();
    }));

  });
});
