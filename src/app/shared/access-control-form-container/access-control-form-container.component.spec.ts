import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlFormContainerComponent } from './access-control-form-container.component';

describe('AccessControlFormContainerComponent', () => {
  let component: AccessControlFormContainerComponent;
  let fixture: ComponentFixture<AccessControlFormContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessControlFormContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
