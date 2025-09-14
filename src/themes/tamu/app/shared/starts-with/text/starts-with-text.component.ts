import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
// TAMU Customizations
import { RouterLink } from '@angular/router';
// END TAMU Customizations
import { TranslateModule } from '@ngx-translate/core';

import { StartsWithTextComponent as BaseComponent } from '../../../../../../app/shared/starts-with/text/starts-with-text.component';
import { StartsWithType } from '../../../../../../app/shared/starts-with/starts-with-type';
import { renderStartsWithFor } from '../../../../../../app/shared/starts-with/starts-with-decorator';


@Component({
  selector: 'ds-starts-with-text',
  // styleUrls: ['./starts-with-text.component.scss'],
  styleUrls: ['../../../../../../app/shared/starts-with/text/starts-with-text.component.scss'],
  templateUrl: './starts-with-text.component.html',
  // templateUrl: '../../../../../../app/shared/starts-with/text/starts-with-text.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    // TAMU Customizations
    RouterLink,
    // END TAMU Customizations
    TranslateModule,
  ],
})
@renderStartsWithFor(StartsWithType.text)
export class StartsWithTextComponent extends BaseComponent {
}
