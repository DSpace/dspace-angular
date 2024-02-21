import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownViewerComponent } from './markdown-viewer.component';
import { MarkdownPipe } from '../utils/markdown.pipe';
import { By } from '@angular/platform-browser';

describe('DsMarkdownViewerComponent', () => {
  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkdownViewerComponent, MarkdownPipe ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownViewerComponent);
    component = fixture.componentInstance;
    component.value = 'Test markdown';
    fixture.detectChanges();
  });

  it('should create', () => {
    const span = fixture.debugElement.query(By.css('span'));
    expect(span).toBeTruthy();
  });
});
