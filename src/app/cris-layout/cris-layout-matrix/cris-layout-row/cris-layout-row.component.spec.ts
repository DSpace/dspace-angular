import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutRowComponent } from './cris-layout-row.component';

describe('CrisLayoutRowComponent', () => {
  let component: CrisLayoutRowComponent;
  let fixture: ComponentFixture<CrisLayoutRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
