import { NgClass } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { isNotEmpty } from '../../empty.util';
import { LinkMenuItemModel } from './models/link.model';

/**
 * Component that renders a menu section of type LINK
 */
@Component({
  selector: 'ds-link-menu-item',
  styleUrls: ['./menu-item.component.scss'],
  templateUrl: './link-menu-item.component.html',
  standalone: true,
  imports: [NgClass, RouterLink, TranslateModule],
})
export class LinkMenuItemComponent implements OnInit {
  item: LinkMenuItemModel;
  hasLink: boolean;
  constructor(
    @Inject('itemModelProvider') item: LinkMenuItemModel,
    private router: Router,
  ) {
    this.item = item;
  }

  ngOnInit(): void {
    this.hasLink = isNotEmpty(this.item.link);
  }

  getRouterLink() {
    if (this.hasLink) {
      return this.item.link;
    }
    return undefined;
  }

  navigate(event: any) {
    event.preventDefault();
    if (!this.item.disabled && this.getRouterLink()) {
      this.router.navigate([this.getRouterLink()]);
    }
    event.stopPropagation();
  }

}
