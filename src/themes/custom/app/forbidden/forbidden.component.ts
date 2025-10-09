import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ForbiddenComponent as BaseComponent } from '../../../../app/forbidden/forbidden.component';

@Component({
  selector: 'ds-themed-forbidden',
  // templateUrl: './forbidden.component.html',
  templateUrl: '../../../../app/forbidden/forbidden.component.html',
  // styleUrls: ['./forbidden.component.scss']
  styleUrls: ['../../../../app/forbidden/forbidden.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
export class ForbiddenComponent extends BaseComponent {
}
