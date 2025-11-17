import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AUDIT_PERSON_NOT_AVAILABLE } from '@dspace/core/data/audit-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { getDSORoute } from '@dspace/core/router/utils/dso-route.utils';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Audit } from '../../core/audit/model/audit.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { StringReplacePipe } from '../../shared/utils/string-replace.pipe';
import { VarDirective } from '../../shared/utils/var.directive';

@Component({
  selector: 'ds-audit-table',
  templateUrl: './audit-table.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    NgbCollapseModule,
    NgClass,
    NgTemplateOutlet,
    PaginationComponent,
    RouterLink,
    StringReplacePipe,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
export class AuditTableComponent {
  /**
   * The Audit items to be shown
   */
  @Input() audits: PaginatedList<Audit>;

  /**
   * Config for pagination
   */
  @Input() pageConfig: PaginationComponentOptions;

  /**
   * Whether the table is used for a an overview of all the site's Audits
   */
  @Input() isOverviewPage: boolean;

  /**
   * The DSpaceObject used in case of a detail audit page
   */
  @Input() object: DSpaceObject;

  protected readonly dataNotAvailable = AUDIT_PERSON_NOT_AVAILABLE;

  /**
   * Date format to use for start and end time of audits
   */
  protected readonly dateFormat = 'yyyy-MM-dd HH:mm:ss';

  constructor(
    public dsoNameService: DSONameService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}


  toggleCollapse(audit: Audit) {
    audit.isCollapsed = !audit.isCollapsed;
    this.changeDetectorRef.detectChanges();
  }

  getObjectRoute$(dso: Observable<RemoteData<DSpaceObject>>): Observable<string> {
    return dso.pipe(
      map(resolvedDso =>  new URLCombiner(getDSORoute(resolvedDso.payload), 'auditlogs').toString()),
    );
  }
}
