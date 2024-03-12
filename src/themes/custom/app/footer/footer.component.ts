import { Component } from '@angular/core';

import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-footer',
  // styleUrls: ['./footer.component.scss'],
  styleUrls: ['../../../../app/footer/footer.component.scss'],
  // templateUrl: './footer.component.html'
  templateUrl: '../../../../app/footer/footer.component.html',
  standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe, DatePipe, TranslateModule]
})
export class FooterComponent extends BaseComponent {
}
