import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchServiceStub } from '../../../testing/search-service.stub';
import { SearchResultsSkeletonComponent } from './search-results-skeleton.component';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment';
import { ChangeDetectorRef } from '@angular/core';

describe('SearchResultsSkeletonComponent', () => {
  let component: SearchResultsSkeletonComponent;
  let fixture: ComponentFixture<SearchResultsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxSkeletonLoaderModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      declarations: [SearchResultsSkeletonComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub() },
        { provide: APP_CONFIG, useValue: environment },
        ChangeDetectorRef,
      ],
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

  it('should display warning message', () => {
    component.loading = true;
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('label')).nativeElement;
    expect(label.textContent).toContain(component.warningMessage);
  });

  it('should display error message', () => {
    component.loading = false;
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.css('ds-alert'));
    expect(alert).toBeTruthy();
  });
});
