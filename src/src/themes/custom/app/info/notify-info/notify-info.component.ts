import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NotifyInfoComponent as BaseComponent } from '../../../../../app/info/notify-info/notify-info.component';

@Component({
  selector: 'ds-themed-notify-info',
  templateUrl: './notify-info.component.html',
  styleUrls: ['./notify-info.component.scss'],
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class NotifyInfoComponent extends BaseComponent {
}
