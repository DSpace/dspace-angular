import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutCellComponent } from './cris-layout-cell.component';

describe('CrisLayoutCellComponent', () => {
  let component: CrisLayoutCellComponent;
  let fixture: ComponentFixture<CrisLayoutCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
