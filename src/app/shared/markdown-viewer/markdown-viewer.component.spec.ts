import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownViewerComponent } from './markdown-viewer.component';
import { By } from '@angular/platform-browser';
import { MarkdownDirective } from '../utils/markdown.directive';
import { MathService } from '../../core/shared/math.service';

describe('DsMarkdownViewerComponent', () => {
  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkdownViewerComponent, MarkdownDirective ],
      providers: [{
        provide: MathService,
        useValue: {}
      } ]
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
