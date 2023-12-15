import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompanionsComponent } from './my-companions.component';

describe('MyCompanionsComponent', () => {
  let component: MyCompanionsComponent;
  let fixture: ComponentFixture<MyCompanionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCompanionsComponent]
    });
    fixture = TestBed.createComponent(MyCompanionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
