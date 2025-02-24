import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  SearchService,
  SearchServiceStub,
} from '@dspace/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { SearchResultsSkeletonComponent } from './search-results-skeleton.component';

describe('SearchResultsSkeletonComponent', () => {
  let component: SearchResultsSkeletonComponent;
  let fixture: ComponentFixture<SearchResultsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsSkeletonComponent, NgxSkeletonLoaderModule],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub() },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchResultsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
