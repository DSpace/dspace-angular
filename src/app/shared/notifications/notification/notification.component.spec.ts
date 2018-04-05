import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { ChangeDetectorRef, DebugElement } from '@angular/core';

import { NotificationComponent } from './notification.component';
import { NotificationsService } from '../notifications.service';
import { NotificationType } from '../models/notification-type';
import { notificationsReducer } from '../notifications.reducers';
import { StoreModule } from '@ngrx/store';
import { NotificationOptions } from '../models/notification-options.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoadingComponent (inline template)', () => {

  let comp: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let deTitle: DebugElement;
  let elTitle: HTMLElement;
  let deContent: DebugElement;
  let elContent: HTMLElement;
  let elType: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({notificationsReducer})],
      declarations: [NotificationComponent], // declare the test component
      providers: [
        NotificationsService,
        ChangeDetectorRef]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    comp = fixture.componentInstance;
    comp.item = {
      id: '1',
      type: NotificationType.Info,
      title: 'Notif. title',
      content: 'Notif. content',
      options: new NotificationOptions()
    };

    fixture.detectChanges();

    deTitle = fixture.debugElement.query(By.css('.sn-title'));
    elTitle = deTitle.nativeElement;
    deContent = fixture.debugElement.query(By.css('.sn-content'));
    elContent = deContent.nativeElement;
    elType = fixture.debugElement.query(By.css('.fa-info')).nativeElement;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should set Title', () => {
    fixture.detectChanges();
    expect(elTitle.textContent).toBe(comp.item.title as string);
  });

  it('should set Content', () => {
    fixture.detectChanges();
    expect(elContent.textContent).toBe(comp.item.content as string);
  });

  it('should set type', () => {
    fixture.detectChanges();
    expect(elType).toBeDefined();
  });

});
