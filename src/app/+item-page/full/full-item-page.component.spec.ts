import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemDataService } from '../../core/data/item-data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { TruncatePipe } from '../../shared/utils/truncate.pipe';
import { FullItemPageComponent } from './full-item-page.component';
import { MetadataService } from '../../core/metadata/metadata.service';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { VarDirective } from '../../shared/utils/var.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { Item } from '../../core/shared/item.model';
import { of as observableOf } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { AuthService } from '../../core/auth/auth.service';
import { createPaginatedList } from '../../shared/testing/utils.test';

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
const routeStub = Object.assign(new ActivatedRouteStub(), {
  data: observableOf({ dso: createSuccessfulRemoteDataObject(mockItem) })
});
const metadataServiceStub = {
  /* tslint:disable:no-empty */
  processRemoteData: () => {
  }
  /* tslint:enable:no-empty */
};

describe('FullItemPageComponent', () => {
  let comp: FullItemPageComponent;
  let fixture: ComponentFixture<FullItemPageComponent>;

  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {}
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), RouterTestingModule.withRoutes([]), BrowserAnimationsModule],
      declarations: [FullItemPageComponent, TruncatePipe, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ItemDataService, useValue: {} },
        { provide: MetadataService, useValue: metadataServiceStub },
        { provide: AuthService, useValue: authService },
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(FullItemPageComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FullItemPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should display the item\'s metadata', () => {
    const table = fixture.debugElement.query(By.css('table'));
    for (const metadatum of mockItem.allMetadata([])) {
      expect(table.nativeElement.innerHTML).toContain(metadatum.value);
    }
  });
});
