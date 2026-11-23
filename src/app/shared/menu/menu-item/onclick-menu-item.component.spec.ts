import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { OnClickMenuItemModel } from './models/onclick.model';
import { OnClickMenuItemComponent } from './onclick-menu-item.component';

describe('OnClickMenuItemComponent', () => {
  let component: OnClickMenuItemComponent;
  let fixture: ComponentFixture<OnClickMenuItemComponent>;
  let debugElement: DebugElement;
  const text = 'HELLO';
  const func = () => {
    /* comment */
  };
  const item = Object.assign(new OnClickMenuItemModel(), { text, function: func });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), OnClickMenuItemComponent],
      providers: [
        { provide: 'itemModelProvider', useValue: item },
        { provide: 'useAriaMenuRoles', useValue: true },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    spyOn(item, 'function');
    fixture = TestBed.createComponent(OnClickMenuItemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should contain the correct text', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the text element', () => {
    const textContent = debugElement.query(By.css('a')).nativeElement.textContent;
    expect(textContent).toEqual(text);
  });

  it('should call the function on the item when clicked', () => {
    debugElement.query(By.css('a.ds-menu-item')).triggerEventHandler('click', new Event(('click')));
    expect(item.function).toHaveBeenCalled();
  });

  it('should declare role="menuitem" on the activated control', () => {
    expect(debugElement.query(By.css('a.ds-menu-item')).nativeElement.getAttribute('role')).toBe('menuitem');
  });

  describe('when the item is disabled', () => {
    beforeEach(() => {
      component.item = Object.assign(new OnClickMenuItemModel(), { text, function: func, disabled: true });
      fixture.detectChanges();
    });

    it('should declare role="menuitem" with aria-disabled so parent menus satisfy aria-required-children', () => {
      const disabledItem = debugElement.query(By.css('[data-test="' + text + '"]')).nativeElement;
      expect(disabledItem.getAttribute('role')).toBe('menuitem');
      expect(disabledItem.getAttribute('aria-disabled')).toBe('true');
    });
  });
});
