import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MathService } from '../../core/shared/math.service';
import { MarkdownDirective } from '../utils/markdown.directive';
import { MarkdownViewerComponent } from './markdown-viewer.component';

describe('DsMarkdownViewerComponent', () => {
  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkdownViewerComponent, MarkdownDirective ],
      providers: [{
        provide: MathService,
        useValue: {},
      } ],
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
