import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionSectionUploadFileReplaceComponent } from './submission-section-upload-file-replace.component';

describe('SubmissionSectionUploadFileReplaceComponent', () => {
  let component: SubmissionSectionUploadFileReplaceComponent;
  let fixture: ComponentFixture<SubmissionSectionUploadFileReplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionSectionUploadFileReplaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionSectionUploadFileReplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
