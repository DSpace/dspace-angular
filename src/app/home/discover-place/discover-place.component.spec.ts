import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverPlaceComponent } from './discover-place.component';

describe('DiscoverPlaceComponent', () => {
  let component: DiscoverPlaceComponent;
  let fixture: ComponentFixture<DiscoverPlaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoverPlaceComponent]
    });
    fixture = TestBed.createComponent(DiscoverPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
