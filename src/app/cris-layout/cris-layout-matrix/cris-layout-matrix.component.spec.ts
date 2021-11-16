import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutMatrixComponent } from './cris-layout-matrix.component';

describe('CrisLayoutMatrixComponent', () => {
  let component: CrisLayoutMatrixComponent;
  let fixture: ComponentFixture<CrisLayoutMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
