import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { EntityIconDirective } from './entity-icon.directive';

describe('EntityIconDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EntityIconDirective,
        TestComponent
      ]
    })
      .compileComponents();
  });

  describe('with default value provided', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display a text-success icon', () => {
      const successIcon = fixture.debugElement.query(By.css('[data-test="entityTestComponent"]')).query(By.css('i.text-success'));
      expect(successIcon).toBeTruthy();
    });

    it('should display a text-success icon after span', () => {
      const successIcon = fixture.debugElement.query(By.css('[data-test="entityTestComponent"]')).query(By.css('i.text-success'));
      const entityElement = fixture.debugElement.query(By.css('[data-test="entityTestComponent"]'));
      // position 1 because the icon is after the span
      expect(entityElement.nativeElement.children[1]).toBe(successIcon.nativeNode);
    });
  });

  describe('with primary value provided', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      component.metadata.entityType = 'person';
      component.metadata.entityStyle = 'personStaff';
      component.iconPosition = 'before';
      fixture.detectChanges();
    });

    it('should display a text-primary icon', () => {
      const primaryIcon = fixture.debugElement.query(By.css('[data-test="entityTestComponent"]')).query(By.css('i.text-primary'));
      expect(primaryIcon).toBeTruthy();
    });

    it('should display a text-primary icon before span', () => {
      const primaryIcon = fixture.debugElement.query(By.css('[data-test="entityTestComponent"]')).query(By.css('i.text-primary'));
      const entityElement = fixture.debugElement.query(By.css('[data-test="entityTestComponent"]'));
      // position 0 because the icon is before the span
      expect(entityElement.nativeElement.children[0]).toBe(primaryIcon.nativeNode);
    });
  });

  describe('when given type doesn\'t exist and fallback on default disabled', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      component.fallbackOnDefault = false;
      component.metadata.entityType = 'TESTFAKE';
      component.metadata.entityStyle = 'personFallback';
      component.iconPosition = 'before';
      fixture.detectChanges();
    });

    it('should not display a text-primary icon', () => {
      const primaryIcon = fixture.debugElement.query(By.css('[data-test="entityTestComponent"]')).query(By.css('i'));
      expect(primaryIcon).toBeFalsy();
    });
  });

  describe('when given style doesn\'t exist and fallback on default disabled', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      component.fallbackOnDefault = false;
      component.metadata.entityType = 'person';
      component.metadata.entityStyle = 'personFallback';
      component.iconPosition = 'before';
      fixture.detectChanges();
    });

    it('should not display a text-primary icon', () => {
      const primaryIcon = fixture.debugElement.query(By.css('[data-test="entityTestComponent"]')).query(By.css('i'));
      expect(primaryIcon).toBeFalsy();
    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: `<div [attr.data-test]="'entityTestComponent'">
              <span dsEntityIcon
                   [iconPosition]="iconPosition"
                   [entityType]="metadata.entityType"
                   [entityStyle]="metadata.entityStyle"
                   [fallbackOnDefault]="fallbackOnDefault">{{metadata.value}}</span></div>`
})
class TestComponent {

  metadata = {
    authority: null,
    value: 'Test',
    orcidAuthenticated: null,
    entityType: 'default',
    entityStyle: 'default'
  };
  iconPosition = 'after';
  fallbackOnDefault = true;

}
