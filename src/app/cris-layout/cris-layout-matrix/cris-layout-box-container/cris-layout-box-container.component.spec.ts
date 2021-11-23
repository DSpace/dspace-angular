import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutBoxContainerComponent } from './cris-layout-box-container.component';

describe('CrisLayoutBoxContainerComponent', () => {
  let component: CrisLayoutBoxContainerComponent;
  let fixture: ComponentFixture<CrisLayoutBoxContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutBoxContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutBoxContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
