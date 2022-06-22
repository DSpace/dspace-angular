import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDownloadButtonComponent } from './file-download-button.component';

describe('FileDownloadButtonComponent', () => {
  let component: FileDownloadButtonComponent;
  let fixture: ComponentFixture<FileDownloadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileDownloadButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
