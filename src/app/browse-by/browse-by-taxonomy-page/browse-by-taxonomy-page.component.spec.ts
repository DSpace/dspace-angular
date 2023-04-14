import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseByTaxonomyPageComponent } from './browse-by-taxonomy-page.component';

describe('BrowseByTaxonomyPageComponent', () => {
  let component: BrowseByTaxonomyPageComponent;
  let fixture: ComponentFixture<BrowseByTaxonomyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseByTaxonomyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByTaxonomyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
