import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChartHorizontalComponent } from './search-chart-horizontal.component';

describe('SearchChartHorizontalComponent', () => {
  let component: SearchChartHorizontalComponent;
  let fixture: ComponentFixture<SearchChartHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchChartHorizontalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
