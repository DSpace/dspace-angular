import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisionOrderStatusComponent } from './supervision-order-status.component';

describe('SupervisionOrderStatusComponent', () => {
  let component: SupervisionOrderStatusComponent;
  let fixture: ComponentFixture<SupervisionOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisionOrderStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
