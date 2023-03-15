import { Component } from '@angular/core';
import { renderStartsWithFor, StartsWithType } from '../../../../../../app/shared/starts-with/starts-with-decorator';
import {
  StartsWithTextComponent as BaseComponent
} from '../../../../../../app/shared/starts-with/text/starts-with-text.component';

@Component({
  selector: 'ds-starts-with-text',
  // styleUrls: ['./starts-with-text.component.scss'],
  styleUrls: ['../../../../../../app/shared/starts-with/text/starts-with-text.component.scss'],
  // templateUrl: './starts-with-text.component.html',
  templateUrl: '../../../../../../app/shared/starts-with/text/starts-with-text.component.html',
})
@renderStartsWithFor(StartsWithType.text)
export class StartsWithTextComponent extends BaseComponent {
}
