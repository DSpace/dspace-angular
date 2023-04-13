import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitstreamAttachmentComponent } from './bitstream-attachment.component';

describe('BitstreamAttachmentComponent', () => {
  let component: BitstreamAttachmentComponent;
  let fixture: ComponentFixture<BitstreamAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitstreamAttachmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitstreamAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
