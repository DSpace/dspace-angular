import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ForbiddenComponent as BaseComponent } from '../../../../app/forbidden/forbidden.component';


@Component({
  selector: 'ds-forbidden',
  // templateUrl: './forbidden.component.html',
  templateUrl: '../../../../app/forbidden/forbidden.component.html',
  // styleUrls: ['./forbidden.component.scss']
  styleUrls: ['../../../../app/forbidden/forbidden.component.scss'],
  standalone: true,
  imports: [RouterLink, TranslateModule],
})
/**
 * This component representing the `Forbidden` DSpace page.
 */
export class ForbiddenComponent extends BaseComponent {}
