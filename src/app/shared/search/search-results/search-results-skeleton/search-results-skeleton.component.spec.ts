import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { SearchResultsSkeletonComponent } from './search-results-skeleton.component';

describe('SearchResultsSkeletonComponent', () => {
  let component: SearchResultsSkeletonComponent;
  let fixture: ComponentFixture<SearchResultsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsSkeletonComponent, NgxSkeletonLoaderModule],
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
