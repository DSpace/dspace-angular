import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { StartsWithTextComponent as BaseComponent } from '../../../../../../app/shared/starts-with/text/starts-with-text.component';

@Component({
  selector: 'ds-starts-with-text',
  styleUrls: ['../../../../../../app/shared/starts-with/text/starts-with-text.component.scss'],
  templateUrl: './starts-with-text.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class StartsWithTextComponent extends BaseComponent {
}
