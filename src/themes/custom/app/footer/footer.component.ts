import {
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';

@Component({
  selector: 'ds-themed-footer',
  // styleUrls: ['./footer.component.scss'],
  styleUrls: ['../../../../app/footer/footer.component.scss'],
  // templateUrl: './footer.component.html'
  templateUrl: '../../../../app/footer/footer.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    TranslateModule,
  ],
})
export class FooterComponent extends BaseComponent {
}
