import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Breadcrumb } from '@dspace/core/breadcrumbs/models/breadcrumb.model';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  HostWindowService,
  WidthCategory,
} from '../shared/host-window.service';
import { VarDirective } from '../shared/utils/var.directive';
import { BreadcrumbsService } from './breadcrumbs.service';

/**
 * Component representing the breadcrumbs of a page
 */
@Component({
  selector: 'ds-base-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  imports: [
    AsyncPipe,
    NgbTooltip,
    NgTemplateOutlet,
    RouterLink,
    TranslateModule,
    VarDirective,
  ],
})
export class BreadcrumbsComponent implements OnInit {

  public isMobile$: Observable<boolean>;

  /**
   * Observable of max mobile width
  */
  maxMobileWidth = WidthCategory.SM;

  /**
   * Observable of the list of breadcrumbs for this page
   */
  breadcrumbs$: Observable<Breadcrumb[]>;

  /**
   * Whether or not to show breadcrumbs on this page
   */
  showBreadcrumbs$: Observable<boolean>;

  constructor(
    private breadcrumbsService: BreadcrumbsService,
    public windowService: HostWindowService,
  ) {
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
  }

  ngOnInit(): void {
    this.isMobile$ = this.windowService.isUpTo(this.maxMobileWidth);
  }

}
