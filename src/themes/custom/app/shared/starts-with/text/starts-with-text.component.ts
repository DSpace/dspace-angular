import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { StartsWithTextComponent as BaseComponent } from '../../../../../../app/shared/starts-with/text/starts-with-text.component';

@Component({
  selector: 'ds-starts-with-text',
  // styleUrls: ['./starts-with-text.component.scss'],
  styleUrls: ['../../../../../../app/shared/starts-with/text/starts-with-text.component.scss'],
  // templateUrl: './starts-with-text.component.html',
  templateUrl: '../../../../../../app/shared/starts-with/text/starts-with-text.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class StartsWithTextComponent extends BaseComponent {
}
