import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRelationCorrectionTypeComponent } from './manage-relation-correction-type.component';

describe('ManageRelationCorrectionTypeComponent', () => {
  let component: ManageRelationCorrectionTypeComponent;
  let fixture: ComponentFixture<ManageRelationCorrectionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRelationCorrectionTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRelationCorrectionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
