import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityPageComponent } from './community-page.component';
import { AuthService } from '../core/auth/auth.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { RouterStub } from '../shared/testing/router.stub';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../shared/utils/var.directive';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { Community } from '../core/shared/community.model';
import { of } from 'rxjs';
import { CommunityDataService } from '../core/data/community-data.service';
import { MetadataService } from '../core/metadata/metadata.service';
import { Bitstream } from '../core/shared/bitstream.model';
import { By } from '@angular/platform-browser';

describe('CommunityPageComponent', () => {
  let component: CommunityPageComponent;
  let fixture: ComponentFixture<CommunityPageComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authorizationDataServiceSpy: jasmine.SpyObj<AuthorizationDataService>;
  let dsoNameServiceSpy: jasmine.SpyObj<DSONameService>;
  let aroute = new ActivatedRouteStub();
  let router = new RouterStub();

  const community = Object.assign(new Community(), {
    id: 'test-community',
    uuid: 'test-community',
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'test community'
      }
    ],
    logo: createSuccessfulRemoteDataObject$(new Bitstream()),
  });

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    authorizationDataServiceSpy = jasmine.createSpyObj('AuthorizationDataService', ['isAuthorized']);
    dsoNameServiceSpy = jasmine.createSpyObj('DSONameService', ['getName']);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, TranslateModule.forRoot(), BrowserAnimationsModule],
      declarations: [CommunityPageComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: aroute },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AuthorizationDataService, useValue: authorizationDataServiceSpy },
        { provide: DSONameService, useValue: dsoNameServiceSpy },
        { provide: CommunityDataService, useValue: {} },
        { provide: MetadataService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    const routeData = {
      data: of({ dso: createSuccessfulRemoteDataObject$(community) }),
    };
    authorizationDataServiceSpy.isAuthorized.and.returnValue(of(true));

    Object.defineProperty(TestBed.inject(ActivatedRoute), 'data', {
      get: () => of(routeData),
    });

    component.ngOnInit();
    expect(component.communityRD$).toBeDefined();
    expect(component.logoRD$).toBeDefined();
    expect(component.communityPageRoute$).toBeDefined();
    expect(component.isCommunityAdmin$).toBeDefined();
  });

  it('should display community logo if available', () => {
    component.communityRD$ = createSuccessfulRemoteDataObject$(community);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const logoElement = fixture.debugElement.query(By.css('ds-comcol-page-logo')).nativeElement;
      expect(logoElement).toBeTruthy();
    });
  });


  it('should not display community logo if not available', () => {
    component.communityRD$ = createSuccessfulRemoteDataObject$(Object.assign(new Community(), {
      name: 'Test',
      logo: createSuccessfulRemoteDataObject$(null),
    }));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const logoElement = fixture.debugElement.query(By.css('ds-comcol-page-logo'));
      expect(logoElement).toBeNull();
    });
  });

  it('should display collection name', () => {
    component.communityRD$ = createSuccessfulRemoteDataObject$(Object.assign(community));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const collectionNameElement = fixture.debugElement.query(By.css('ds-comcol-page-header')).nativeElement;
      expect(collectionNameElement.textContent.trim()).toBe('Test Collection');
    });
  });
});
