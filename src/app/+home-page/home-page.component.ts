import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { Options } from '../shared/notifications/interfaces/options.type';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  public notificationOptions: Options = {
    position: ['top', 'right'],
    timeOut: 0,
    lastOnBottom: true,
    clickIconToClose: false,
    showProgressBar: true,
  };

  @ViewChild('example') example: TemplateRef<any>;

  constructor(private notificationsService: NotificationsService) {
  }

  createNotification() {
    const n1 = this.notificationsService.success('Welcome in DSpace', 'Good choice!',
      {
        showProgressBar: false,
        animate: 'rotate',
        timeout: 2000});
    const n2 = this.notificationsService.error('Error in DSpace', 'This is a fake error!');
    const n3 = this.notificationsService.info(this.example);
    console.log('Notifications pushed');
    console.log(n1);
    console.log(n2);
  }

  notificationCreated(event) {
    console.log('Notification created');
    console.log(event);
  }

  notificationDestroyed() {
    console.log('Notification destroyed');
    console.log(event);
  }
}
