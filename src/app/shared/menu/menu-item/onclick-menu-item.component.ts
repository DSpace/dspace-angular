
import {
  Component,
  Inject,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { OnClickMenuItemModel } from './models/onclick.model';

/**
 * Component that renders a menu section of type ONCLICK
 */
@Component({
  selector: 'ds-onclick-menu-item',
  styleUrls: ['./menu-item.component.scss', './onclick-menu-item.component.scss'],
  templateUrl: './onclick-menu-item.component.html',
  standalone: true,
  imports: [
    RouterLinkActive,
    TranslateModule,
  ],
})
export class OnClickMenuItemComponent {
  item: OnClickMenuItemModel;

  constructor(@Inject('itemModelProvider') item: OnClickMenuItemModel) {
    this.item = item;
  }

  public activate(event: any) {
    if (!this.item.disabled) {
      event.preventDefault();
      this.item.function();
      event.stopPropagation();
    }
  }
}
