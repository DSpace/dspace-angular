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

import { TextMenuItemComponent } from './text-menu-item.component';

describe('TextMenuItemComponent', () => {
  let component: TextMenuItemComponent;
  let fixture: ComponentFixture<TextMenuItemComponent>;
  let debugElement: DebugElement;
  const text = 'HELLO';
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), TextMenuItemComponent],
      providers: [
        { provide: 'itemModelProvider', useValue: { text: text } },
        { provide: 'useAriaMenuRoles', useValue: false },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextMenuItemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should contain the correct text', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the text element', () => {
    const textContent = debugElement.query(By.css('span')).nativeElement.textContent;
    expect(textContent).toEqual(text);
  });

  it('should be plain text without a nested widget role so parent menuitems stay valid', () => {
    const label = debugElement.query(By.css('span')).nativeElement;
    expect(label.getAttribute('role')).toBeNull();
    expect(label.getAttribute('tabindex')).toBeNull();
  });
});
