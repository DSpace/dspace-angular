import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsoPageEditButtonComponent } from './dso-page-edit-button.component';

describe('DsoPageEditButtonComponent', () => {
  let component: DsoPageEditButtonComponent;
  let fixture: ComponentFixture<DsoPageEditButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsoPageEditButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoPageEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
