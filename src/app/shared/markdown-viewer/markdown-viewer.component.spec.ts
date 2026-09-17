import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { MathService } from '../../core/shared/math.service';
import { MarkdownDirective } from '../utils/markdown.directive';
import { MarkdownViewerComponent } from './markdown-viewer.component';

describe('DsMarkdownViewerComponent', () => {
  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;

  const mathServiceMock = jasmine.createSpyObj('mathServiceMock', {
    ready: jasmine.createSpy('ready'),
    render: jasmine.createSpy('render'),
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownViewerComponent, MarkdownDirective],
      providers: [{
        provide: MathService,
        useValue: mathServiceMock,
      }],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownViewerComponent);
    component = fixture.componentInstance;
    component.value = 'Test markdown';
    mathServiceMock.ready.and.returnValue(of(false));
    fixture.detectChanges();
  });

  it('should create', () => {
    const span = fixture.debugElement.query(By.css('span'));
    expect(span).toBeTruthy();
  });
});
