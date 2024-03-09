import { ChangeDetectionStrategy } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment.test';
import { AuthService } from '../../../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { FileService } from '../../../../../core/shared/file.service';
import { Item } from '../../../../../core/shared/item.model';
import { DynamicComponentLoaderDirective } from '../../../../abstract-component-loader/dynamic-component-loader.directive';
import { getMockThemeService } from '../../../../mocks/theme-service.mock';
import { ListableObjectComponentLoaderComponent } from '../../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { ActivatedRouteStub } from '../../../../testing/active-router.stub';
import { AuthServiceStub } from '../../../../testing/auth-service.stub';
import { AuthorizationDataServiceStub } from '../../../../testing/authorization-service.stub';
import { FileServiceStub } from '../../../../testing/file-service.stub';
import { TruncatableServiceStub } from '../../../../testing/truncatable-service.stub';
import { ThemeService } from '../../../../theme-support/theme.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { ItemListElementComponent } from './item-list-element.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
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
  let fileService: FileServiceStub;
  let themeService: ThemeService;
  let truncatableService: TruncatableServiceStub;

  beforeEach(waitForAsync(() => {
    activatedRoute = new ActivatedRouteStub();
    authService = new AuthServiceStub();
    authorizationService = new AuthorizationDataServiceStub();
    fileService = new FileServiceStub();
    themeService = getMockThemeService();
    truncatableService = new TruncatableServiceStub();

    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        ItemListElementComponent,
        ListableObjectComponentLoaderComponent,
        DynamicComponentLoaderDirective,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: FileService, useValue: fileService },
        { provide: ThemeService, useValue: themeService },
        { provide: TruncatableService, useValue: truncatableService },
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
      fixture.detectChanges();
    });

    it(`should contain a PublicationListElementComponent`, () => {
      const publicationListElement = fixture.debugElement.query(By.css(`ds-item-search-result-list-element`));
      expect(publicationListElement).not.toBeNull();
    });
  });
});
