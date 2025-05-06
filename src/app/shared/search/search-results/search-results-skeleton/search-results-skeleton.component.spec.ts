import { PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment';
import { SearchService } from '../../../../core/shared/search/search.service';
import { AlertComponent } from '../../../alert/alert.component';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { SearchServiceStub } from '../../../testing/search-service.stub';
import { VarDirective } from '../../../utils/var.directive';
import { SearchResultsSkeletonComponent } from './search-results-skeleton.component';

describe('SearchResultsSkeletonComponent', () => {
  let component: SearchResultsSkeletonComponent;
  let fixture: ComponentFixture<SearchResultsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchResultsSkeletonComponent,
        AlertComponent,
        NgxSkeletonLoaderModule,
        VarDirective,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub() },
        { provide: APP_CONFIG, useValue: environment },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).overrideComponent(SearchResultsSkeletonComponent, {
      remove: {
        imports: [
          AlertComponent,
        ],
      },
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchResultsSkeletonComponent);
    component = fixture.componentInstance;
    component.warningMessage = 'test warning message';
    component.errorMessage = 'test error message';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display warning message', fakeAsync(() => {
    component.warningMessageDelay = 0;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('label')).nativeElement;
    expect(label.textContent).toContain(component.warningMessage);
  }));

  it('should display error message', fakeAsync(() => {
    component.errorMessageDelay = 0;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.css('ds-alert'));
    expect(alert).toBeTruthy();
  }));
});
