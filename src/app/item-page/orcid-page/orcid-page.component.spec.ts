import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';

import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { ResearcherProfileService } from '../../core/profile/researcher-profile.service';
import { OrcidPageComponent } from './orcid-page.component';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { Item } from '../../core/shared/item.model';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { ItemDataService } from '../../core/data/item-data.service';

describe('OrcidPageComponent test suite', () => {
  let comp: OrcidPageComponent;
  let fixture: ComponentFixture<OrcidPageComponent>;
  let scheduler: TestScheduler;
  let authService: jasmine.SpyObj<AuthService>;
  let routeStub: jasmine.SpyObj<ActivatedRouteStub>;
  let routeData: any;
  let itemDataService: jasmine.SpyObj<ItemDataService>;
  let researcherProfileService: jasmine.SpyObj<ResearcherProfileService>;

  const mockItem: Item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'test item'
        }
      ]
    }
  });
  const mockItemLinkedToOrcid: Item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: {
      'dc.title': [
        {
          value: 'test item'
        }
      ],
      'dspace.orcid.authenticated': [
        {
          value: 'true'
        }
      ]
    }
  });

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: jasmine.createSpy('isAuthenticated'),
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    });

    routeData = {
      dso: createSuccessfulRemoteDataObject(mockItem),
    };

    routeStub = Object.assign(new ActivatedRouteStub(), {
      data: observableOf(routeData)
    });

    researcherProfileService = jasmine.createSpyObj('researcherProfileService', {
      isLinkedToOrcid: jasmine.createSpy('isLinkedToOrcid')
    });

    itemDataService = jasmine.createSpyObj('ItemDataService', {
      findById: jasmine.createSpy('findById')
    });

    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [OrcidPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ResearcherProfileService, useValue: researcherProfileService },
        { provide: AuthService, useValue: authService },
        { provide: ItemDataService, useValue: itemDataService },
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(OrcidPageComponent);
    comp = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(observableOf(true));
    fixture.detectChanges();
  }));

  it('should create', () => {
    const btn = fixture.debugElement.queryAll(By.css('[data-test="back-button"]'));
    expect(comp).toBeTruthy();
    expect(btn.length).toBe(1);
  });

  it('should call isLinkedToOrcid', () => {
    comp.isLinkedToOrcid();

    expect(researcherProfileService.isLinkedToOrcid).toHaveBeenCalledWith(comp.item.value);
  });

  it('should update item', fakeAsync(() => {
    itemDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockItemLinkedToOrcid));
    scheduler.schedule(() => comp.updateItem());
    scheduler.flush();

    expect(comp.item.value).toEqual(mockItemLinkedToOrcid);
  }));

});
