import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { CollectionPageComponent } from './collection-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CollectionDataService } from '../core/data/collection-data.service';
import { AuthService } from '../core/auth/auth.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { APP_CONFIG } from '../../../src/config/app-config.interface';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { RouterStub } from '../shared/testing/router.stub';
import { environment } from 'src/environments/environment.test';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { Collection } from '../core/shared/collection.model';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../shared/utils/var.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Bitstream } from '../core/shared/bitstream.model';
import { SearchManager } from '../core/browse/search-manager';

describe('CollectionPageComponent', () => {
  let component: CollectionPageComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<CollectionPageComponent>;

  let collectionDataServiceSpy: jasmine.SpyObj<CollectionDataService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let paginationServiceSpy: jasmine.SpyObj<PaginationService>;
  let authorizationDataServiceSpy: jasmine.SpyObj<AuthorizationDataService>;
  let dsoNameServiceSpy: jasmine.SpyObj<DSONameService>;
  let searchServiceSpy: jasmine.SpyObj<SearchManager>;
  let aroute = new ActivatedRouteStub();
  let router = new RouterStub();

  const collection = Object.assign(new Collection(), {});

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    paginationServiceSpy = jasmine.createSpyObj('PaginationService', ['getCurrentPagination', 'getCurrentSort', 'clearPagination']);
    authorizationDataServiceSpy = jasmine.createSpyObj('AuthorizationDataService', ['isAuthorized']);
    collectionDataServiceSpy = jasmine.createSpyObj('CollectionDataService', ['findById', 'getAuthorizedCollection']);
    searchServiceSpy = jasmine.createSpyObj('SearchManager', ['search']);
    dsoNameServiceSpy = jasmine.createSpyObj('DSONameService', ['getName']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, TranslateModule.forRoot(), BrowserAnimationsModule],
      declarations: [CollectionPageComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: aroute },
        { provide: Router, useValue: router },
        { provide: CollectionDataService, useValue: collectionDataServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PaginationService, useValue: paginationServiceSpy },
        { provide: AuthorizationDataService, useValue: authorizationDataServiceSpy },
        { provide: DSONameService, useValue: dsoNameServiceSpy },
        { provide: SearchManager, useValue: searchServiceSpy },
        { provide: APP_CONFIG, useValue: environment },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPageComponent);
    component = fixture.componentInstance;
    compAsAny = component as any;
    component.collectionRD$ = createSuccessfulRemoteDataObject$(Object.assign(new Collection(), {
      name: 'Test Collection',
    }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    const routeData = {
      dso: createSuccessfulRemoteDataObject$(collection),
    };
    Object.defineProperty(TestBed.inject(ActivatedRoute), 'data', {
      get: () => of(routeData),
    });
    authorizationDataServiceSpy.isAuthorized.and.returnValue(of(true));
    component.ngOnInit();

    expect(component.collectionRD$).toBeDefined();
    expect(component.logoRD$).toBeDefined();
    expect(component.isCollectionAdmin$).toBeDefined();
    expect(compAsAny.paginationChanges$).toBeDefined();
    expect(component.itemRD$).toBeDefined();
    expect(component.collectionPageRoute$).toBeDefined();
  });

  it('should display collection name', fakeAsync(() => {
    component.collectionRD$ = createSuccessfulRemoteDataObject$(Object.assign(new Collection(), {
      name: 'Test Collection',
    }));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const collectionNameElement = fixture.debugElement.query(By.css('ds-comcol-page-header')).nativeElement;
      expect(collectionNameElement.textContent.trim()).toBe('Test Collection');
    });
  }));

  it('should display collection logo if available', () => {
    component.collectionRD$ = createSuccessfulRemoteDataObject$(Object.assign(new Collection(), {
      name: 'Test Collection',
    }));
    component.logoRD$ = createSuccessfulRemoteDataObject$(Object.assign(new Bitstream(), {
      name: 'Test Logo',
    }));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const logoElement = fixture.debugElement.query(By.css('ds-comcol-page-logo')).nativeElement;
      expect(logoElement).toBeTruthy();
    });
  });

  it('should not display collection logo if not available', () => {
    component.collectionRD$ = createSuccessfulRemoteDataObject$(Object.assign(new Collection(), {
      name: 'Test Collection',
    }));
    component.logoRD$ = of({ hasSucceeded: false, payload: null }) as any;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const logoElement = fixture.debugElement.query(By.css('ds-comcol-page-logo'));
      expect(logoElement).toBeNull();
    });
  });

  it('should clear pagination on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(paginationServiceSpy.clearPagination).toHaveBeenCalledWith(component.paginationConfig.id);
  });
});
