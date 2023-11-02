import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionSectionCoarNotifyComponent } from './section-coar-notify.component';

fdescribe('LdnServiceComponent', () => {
  let component: SubmissionSectionCoarNotifyComponent;
  let fixture: ComponentFixture<SubmissionSectionCoarNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmissionSectionCoarNotifyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SubmissionSectionCoarNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
