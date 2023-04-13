import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentRenderComponent } from './attachment-render.component';

describe('AttachmentRenderComponent', () => {
  let component: AttachmentRenderComponent;
  let fixture: ComponentFixture<AttachmentRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
