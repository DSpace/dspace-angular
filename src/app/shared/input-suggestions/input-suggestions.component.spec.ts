import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { InputSuggestionsComponent } from './input-suggestions.component';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('InputSuggestionsComponent', () => {

  let comp: InputSuggestionsComponent;
  let fixture: ComponentFixture<InputSuggestionsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const suggestions = ['suggestion uno', 'suggestion dos', 'suggestion tres'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, FormsModule],
      declarations: [InputSuggestionsComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(InputSuggestionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSuggestionsComponent);

    comp = fixture.componentInstance; // LoadingComponent test instance
    comp.suggestions = suggestions;
    // query for the message <label> by CSS element selector
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('when the input field is in focus', () => {

    beforeEach(() => {
      const inputElement = de.query(By.css('#suggestion_input'));
      inputElement.nativeElement.focus();
      fixture.detectChanges();

    });

    it('should not have any element in focus', () => {
      const activeElement = el.ownerDocument.activeElement;
      expect(activeElement.nodeName.toLowerCase()).not.toEqual('a');
    });

    describe('when key up is pressed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(comp, 'shiftFocusUp');
        const form = de.query(By.css('form'));
        form.triggerEventHandler('keydown.arrowup', {});
        fixture.detectChanges();
      }));

      it('should call shiftFocusUp()', () => {
        expect(comp.shiftFocusUp).toHaveBeenCalled();
      });
    });

    describe('when shiftFocusUp() triggered', () => {
      beforeEach(fakeAsync(() => {
        comp.shiftFocusUp(new KeyboardEvent('keydown.arrowup'));
        fixture.detectChanges();
      }));

      it('should put the focus on the last element ', fakeAsync(() => {
        const lastLink = de.query(By.css('.list-unstyled > li:last-child a'));
        const activeElement = el.ownerDocument.activeElement;
        expect(activeElement).toEqual(lastLink.nativeElement);
      }));
    });

    describe('when key down is pressed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(comp, 'shiftFocusDown');
        const form = de.query(By.css('form'));
        form.triggerEventHandler('keydown.arrowdown', {});
        fixture.detectChanges();
      }));

      it('should call shiftFocusDown()', () => {
        expect(comp.shiftFocusDown).toHaveBeenCalled();
      });
    });

    describe('when shiftFocusDown() triggered', () => {
      beforeEach(fakeAsync(() => {
        comp.shiftFocusDown(new KeyboardEvent('keydown.arrowdown'));
        fixture.detectChanges();
      }));

      it('should put the focus on the first element ', fakeAsync(() => {
        const lastLink = de.query(By.css('.list-unstyled > li:first-child a'));
        const activeElement = el.ownerDocument.activeElement;
        expect(activeElement).toEqual(lastLink.nativeElement);
      }));
    });
  });



});
