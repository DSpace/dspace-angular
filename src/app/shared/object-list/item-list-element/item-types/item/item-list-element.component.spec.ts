import { ChangeDetectionStrategy } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { Item } from '@dspace/core/shared/item.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { AuthorizationDataServiceStub } from '@dspace/core/testing/authorization-service.stub';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { TruncatableServiceStub } from '@dspace/core/testing/truncatable-service.stub';
import { XSRFService } from '@dspace/core/xsrf/xsrf.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../../../../../environments/environment.test';
import { getMockThemeService } from '../../../../theme-support/test/theme-service.mock';
import { ThemeService } from '../../../../theme-support/theme.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { ItemListElementComponent } from './item-list-element.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: of({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald',
      },
    ],
    'dc.publisher': [
      {
        language: 'en_US',
        value: 'a publisher',
      },
    ],
    'dc.date.issued': [
      {
        language: 'en_US',
        value: '2015-06-26',
      },
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is the abstract',
      },
    ],
  },
});

describe('ItemListElementComponent', () => {
  let comp: ItemListElementComponent;
  let fixture: ComponentFixture<ItemListElementComponent>;

  let activatedRoute: ActivatedRouteStub;
  let authService: AuthServiceStub;
  let authorizationService: AuthorizationDataServiceStub;
  let themeService: ThemeService;
  let truncatableService: TruncatableServiceStub;

  beforeEach(waitForAsync(() => {
    activatedRoute = new ActivatedRouteStub();
    authService = new AuthServiceStub();
    authorizationService = new AuthorizationDataServiceStub();
    themeService = getMockThemeService();
    truncatableService = new TruncatableServiceStub();

    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        TruncatePipe,
      ],
      declarations: [
      ],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ThemeService, useValue: themeService },
        { provide: TruncatableService, useValue: truncatableService },
        { provide: XSRFService, useValue: {} },
      ],
    }).overrideComponent(ItemListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the publication is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      comp.ngOnChanges();
      fixture.detectChanges();
    });

    it(`should contain a PublicationListElementComponent`, () => {
      const publicationListElement = fixture.debugElement.query(By.css(`ds-item-search-result-list-element`));
      expect(publicationListElement).not.toBeNull();
    });
  });
});
