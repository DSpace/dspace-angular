import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglePlacesSearchComponent } from './google-places-search.component';

describe('GooglePlacesSearchComponent', () => {
  let component: GooglePlacesSearchComponent;
  let fixture: ComponentFixture<GooglePlacesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GooglePlacesSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GooglePlacesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
