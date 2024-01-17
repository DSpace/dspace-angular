import { waitForAsync, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { JournalListElementComponent } from './journal-list-element.component';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { environment } from 'src/environments/environment.test';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthServiceMock } from '../../../../shared/mocks/auth.service.mock';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'creativeworkseries.issn': [
      {
        language: 'en_US',
        value: '1234'
      }
    ]
  }
});

describe('JournalListElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
    collapse: (id: number) => null,
    expand: (id: number) => null
  };

  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
    imports: [TruncatePipe, TranslateModule.forRoot()],
    declarations: [JournalListElementComponent],
    providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} },
    ],
    schemas: [NO_ERRORS_SCHEMA]
}).overrideComponent(JournalListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the journal is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a JournalListElementComponent`, () => {
      const journalListElement = fixture.debugElement.query(By.css(`ds-journal-search-result-list-element`));
      expect(journalListElement).not.toBeNull();
    });
  });
});
