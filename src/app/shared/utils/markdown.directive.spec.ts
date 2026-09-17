/* eslint-disable max-classes-per-file */
import {
  Component,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MathService } from '@dspace/core/shared/math.service';
import { MockMathService } from '@dspace/core/shared/math.service.spec';

import { environment } from '../../../environments/environment.test';
import { MarkdownDirective } from './markdown.directive';

@Component({
  template: `<div [dsMarkdown]="'test<script>alert(1);</script>'"></div>`,
  imports: [
    MarkdownDirective,
  ],
})
class TestComponent {}

@Component({
  template: `<div [dsMarkdown]="'Les informations demandés.es ne sont pas disponibles.'"></div>`,
  imports: [
    MarkdownDirective,
  ],
})
class LinkifyTestComponent {}

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

  it('should sanitize the script element out of innerHTML (markdown disabled)', () => {
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

  it('should sanitize the script element out of innerHTML (markdown enabled)', () => {
    fixture.detectChanges();
    divEl = fixture.debugElement.query(By.css('div'));
    expect(divEl.nativeElement.innerHTML).toEqual('test');
  });

});

describe('MarkdownDirective linkify with markdown enabled', () => {
  let fixture: ComponentFixture<LinkifyTestComponent>;
  let divEl: DebugElement;
  // Enable markdown
  environment.markdown.enabled = true;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MathService, useClass: MockMathService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LinkifyTestComponent);
    divEl = fixture.debugElement.query(By.css('div'));
  });

  it('should not convert words with dots (e.g. demandés.es) to links (#2789)', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    divEl = fixture.debugElement.query(By.css('div'));
    expect(divEl.nativeElement.innerHTML).not.toContain('<a href');
  });

});
