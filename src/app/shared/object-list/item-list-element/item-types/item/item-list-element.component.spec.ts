import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ItemListElementComponent } from './item-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { XSRFService } from '../../../../../core/xsrf/xsrf.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { of as observableOf } from 'rxjs';
import { ListableObjectComponentLoaderComponent } from '../../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { getMockThemeService } from '../../../../mocks/theme-service.mock';
import { ThemeService } from '../../../../theme-support/theme.service';
import { ListableObjectDirective } from '../../../../object-collection/shared/listable-object/listable-object.directive';
import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment.test';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRouteStub } from '../../../../testing/active-router.stub';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../../testing/auth-service.stub';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { AuthorizationDataServiceStub } from '../../../../testing/authorization-service.stub';
import { FileService } from '../../../../../core/shared/file.service';
import { FileServiceStub } from '../../../../testing/file-service.stub';
import { TruncatableServiceStub } from '../../../../testing/truncatable-service.stub';
import { VocabularyService } from '../../../../../core/submission/vocabularies/vocabulary.service';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { MetricsDataService } from '../../../../../core/data/metrics-data.service';
import { LinkService } from '../../../../../core/cache/builders/link.service';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  entityType: 'Publication',
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.publisher': [
      {
        language: 'en_US',
        value: 'a publisher'
      }
    ],
    'dc.date.issued': [
      {
        language: 'en_US',
        value: '2015-06-26'
      }
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is the abstract'
      }
    ]
  }
});

describe('ItemListElementComponent', () => {
  let comp: ItemListElementComponent;
  let fixture: ComponentFixture<ItemListElementComponent>;

  let activatedRoute: ActivatedRouteStub;
  let authService: AuthServiceStub;
  let authorizationService: AuthorizationDataServiceStub;
  let fileService: FileServiceStub;
  let themeService: ThemeService;
  let truncatableService: TruncatableServiceStub;
  let metricsDataService: MetricsDataService;
  let linkService:  LinkService;

  beforeEach(waitForAsync(() => {
    activatedRoute = new ActivatedRouteStub();
    authService = new AuthServiceStub();
    authorizationService = new AuthorizationDataServiceStub();
    fileService = new FileServiceStub();
    themeService = getMockThemeService();
    truncatableService = new TruncatableServiceStub();
    metricsDataService = new MetricsDataService(null, null, null, null);
    linkService =  jasmine.createSpyObj('LinkService', {
      resolveLink: () => null
    });

    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        ItemListElementComponent,
        ListableObjectComponentLoaderComponent,
        ListableObjectDirective,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: XSRFService, useValue: {} },
        { provide: FileService, useValue: fileService },
        { provide: ThemeService, useValue: themeService },
        { provide: TruncatableService, useValue: truncatableService },
        { provide: VocabularyService, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: MetricsDataService, useValue: metricsDataService },
        { provide: LinkService, useValue: linkService },
      ],
    }).overrideComponent(ItemListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
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
