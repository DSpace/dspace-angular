import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionSectionAccessesComponent } from './section-accesses.component';

describe('SubmissionSectionAccessesComponent', () => {
  let component: SubmissionSectionAccessesComponent;
  let fixture: ComponentFixture<SubmissionSectionAccessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmissionSectionAccessesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionSectionAccessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
