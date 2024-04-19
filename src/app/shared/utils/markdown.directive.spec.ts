import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownDirective } from './markdown.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MathService } from '../../core/shared/math.service';
import { MockMathService } from '../../core/shared/math.service.spec';

@Component({
  template: `<div dsMarkdown="test"></div>`
})
class TestComponent {}

describe('MarkdownDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestComponent, MarkdownDirective ],
      providers: [
        { provide: MathService, useClass: MockMathService },
      ]
    }).compileComponents();
    spyOn(MarkdownDirective.prototype, 'render');
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    divEl = fixture.debugElement.query(By.css('div'));
  });

  it('should call render method', () => {
    fixture.detectChanges();
    expect(MarkdownDirective.prototype.render).toHaveBeenCalled();
  });
});
