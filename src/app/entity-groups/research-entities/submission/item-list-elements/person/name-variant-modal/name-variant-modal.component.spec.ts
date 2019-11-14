import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameVariantModalComponent } from './name-variant-modal.component';

describe('NameVariantModalComponent', () => {
  let component: NameVariantModalComponent;
  let fixture: ComponentFixture<NameVariantModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameVariantModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameVariantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
