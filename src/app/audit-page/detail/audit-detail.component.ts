import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { RemoteData } from '../../core/data/remote-data';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { Audit } from '../../core/audit/model/audit.model';
import { AuditDataService } from '../../core/audit/audit-data.service';
import { AuthService } from '../../core/auth/auth.service';

/**
 * A component displaying detailed information about a DSpace Audit
 */
@Component({
  selector: 'ds-audit-detail',
  templateUrl: './audit-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditDetailComponent implements OnInit {

  /**
   * The Audit's Remote Data
   */
  auditRD$: Observable<RemoteData<Audit>>;

  /**
   * Date format to use for start and end time of audits
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  constructor(protected authService: AuthService,
              protected route: ActivatedRoute,
              protected router: Router,
              protected auditService: AuditDataService,
              protected nameService: DSONameService) {
  }

  /**
   * Initialize component properties
   * Display a 404 if the audit doesn't exist
   */
  ngOnInit(): void {
    this.auditRD$ = this.route.data.pipe(
      map((data) => data.process as RemoteData<Audit>),
      redirectOn4xx(this.router, this.authService)
    );
  }

  /**
   * Get the name of an EPerson by ID
   * @param audit  Audit object
   */
  getEpersonName(audit: Audit): Observable<string> {
    return this.auditService.getEpersonName(audit);
  }

}
