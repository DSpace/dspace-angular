import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { NotificationOptions } from '../shared/notifications/models/notification-options.model';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  @ViewChild('example') example: TemplateRef<any>;

  private htmlNotification;

  constructor(private notificationsService: NotificationsService) {
  }

  createNotification() {
    const n1 = this.notificationsService.success('Welcome in DSpace', 'Good choice!',
      new NotificationOptions(10000, true, 'fromLeft', ['bottom', 'left']));
  }

  createNotification1() {
    const n1 = this.notificationsService.warning('Welcome in DSpace', 'Good choice!',
      new NotificationOptions(10000, false, 'fromLeft', ['bottom', 'left']));
  }

  createNotification2() {
    const html = "<h1>Html Alert</h1> <p><button [routerLink]=\"['/mydspace']\">Go to mydspace</button></p>";
    this.htmlNotification = this.notificationsService.info('Ciao', null, null, html);
  }

  deleteHtmlNotification() {
    this.notificationsService.remove(this.htmlNotification);
  }

  deleteAllNotifications() {
    this.notificationsService.removeAll();
  }
}
