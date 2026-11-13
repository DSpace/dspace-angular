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
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    spyOn(item, 'function');
    fixture = TestBed.createComponent(OnClickMenuItemComponent);
    component = fixture.componentInstance;
    component.item = item;
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

  describe('icon rendering', () => {
    beforeEach(() => {
      item.icon = undefined;
      item.disabled = false;
      fixture.detectChanges();
    });

    it('should render the icon when item.icon is provided and enabled', () => {
      item.icon = 'users';
      fixture.detectChanges();

      const icon = debugElement.query(By.css('a.ds-menu-item i.fa-users'));

      expect(icon).toBeTruthy();
      expect(icon.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('should render the icon when item.icon is provided and disabled', () => {
      item.icon = 'users';
      item.disabled = true;
      fixture.detectChanges();

      const icon = debugElement.query(By.css('span.ds-menu-item i.fa-users'));

      expect(icon).toBeTruthy();
      expect(icon.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('should not render the icon when item.icon is not provided', () => {
      fixture.detectChanges();

      const icon = debugElement.query(By.css('i.fas'));

      expect(icon).toBeFalsy();
    });
  });
});
