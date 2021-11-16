import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutLeadingComponent } from './cris-layout-leading.component';

describe('CrisLayoutLeadingComponent', () => {
  let component: CrisLayoutLeadingComponent;
  let fixture: ComponentFixture<CrisLayoutLeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutLeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutLeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
