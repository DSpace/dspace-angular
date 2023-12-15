import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFavouritesTripComponent } from './my-favourites-trip.component';

describe('MyFavouritesTripComponent', () => {
  let component: MyFavouritesTripComponent;
  let fixture: ComponentFixture<MyFavouritesTripComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyFavouritesTripComponent]
    });
    fixture = TestBed.createComponent(MyFavouritesTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
