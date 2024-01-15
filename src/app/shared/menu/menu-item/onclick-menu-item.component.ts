import { Component, Inject } from '@angular/core';
import { OnClickMenuItemModel } from './models/onclick.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

/**
 * Component that renders a menu section of type ONCLICK
 */
@Component({
    selector: 'ds-onclick-menu-item',
    styleUrls: ['./onclick-menu-item.component.scss'],
    templateUrl: './onclick-menu-item.component.html',
    standalone: true,
    imports: [NgIf, TranslateModule]
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
