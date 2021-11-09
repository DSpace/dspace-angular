import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutHorizontalComponent } from './cris-layout-horizontal.component';

describe('CrisLayoutHorizontalComponent', () => {
  let component: CrisLayoutHorizontalComponent;
  let fixture: ComponentFixture<CrisLayoutHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutHorizontalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
