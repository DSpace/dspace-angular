import {
  Component,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { environment } from '../../../environments/environment.test';
import { MathService } from '../../core/shared/math.service';
import { MockMathService } from '../../core/shared/math.service.spec';
import { MarkdownDirective } from './markdown.directive';

@Component({
  template: `<div [dsMarkdown]="'test<script>alert(1);</script>'"></div>`,
  standalone: true,
  imports: [
    MarkdownDirective,
  ],
})
class TestComponent {}

describe('MarkdownDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MathService, useClass: MockMathService },
      ],
    }).compileComponents();
    spyOn(MarkdownDirective.prototype, 'render');
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should call render method', () => {
    fixture.detectChanges();
    expect(MarkdownDirective.prototype.render).toHaveBeenCalled();
  });

});

describe('MarkdownDirective sanitization with markdown disabled', () => {
  let fixture: ComponentFixture<TestComponent>;
  let divEl: DebugElement;
  // Disable markdown
  environment.markdown.enabled = false;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MathService, useClass: MockMathService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    divEl = fixture.debugElement.query(By.css('div'));

  });

  it('should sanitize the script element out of innerHTML (markdown disabled)',() => {
    fixture.detectChanges();
    divEl = fixture.debugElement.query(By.css('div'));
    expect(divEl.nativeElement.innerHTML).toEqual('test');
  });

});

describe('MarkdownDirective sanitization with markdown enabled', () => {
  let fixture: ComponentFixture<TestComponent>;
  let divEl: DebugElement;
  // Enable markdown
  environment.markdown.enabled = true;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MathService, useClass: MockMathService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    divEl = fixture.debugElement.query(By.css('div'));

  });

  it('should sanitize the script element out of innerHTML (markdown enabled)',() => {
    fixture.detectChanges();
    divEl = fixture.debugElement.query(By.css('div'));
    expect(divEl.nativeElement.innerHTML).toEqual('test');
  });

});
