import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NotificationType, ListableNotificationObject } from '@dspace/core'
import { TranslateModule } from '@ngx-translate/core';

import { ListableNotificationObjectComponent } from './listable-notification-object.component';

describe('ListableNotificationObjectComponent', () => {
  let component: ListableNotificationObjectComponent;
  let fixture: ComponentFixture<ListableNotificationObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ListableNotificationObjectComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListableNotificationObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ui', () => {
    it('should display the given error message', () => {
      component.object = new ListableNotificationObject(NotificationType.Error, 'test error message');
      fixture.detectChanges();

      const listableNotificationObject: Element = fixture.debugElement.query(By.css('.alert')).nativeElement;
      expect(listableNotificationObject.className).toContain(NotificationType.Error);
      expect(listableNotificationObject.innerHTML).toBe('test error message');
    });
  });

  afterEach(() => {
    fixture.debugElement.nativeElement.remove();
  });
});
