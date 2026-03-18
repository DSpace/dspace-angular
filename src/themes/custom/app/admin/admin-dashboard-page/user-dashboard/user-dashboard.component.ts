import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, take, catchError } from 'rxjs/operators';
import { AuthService } from '../../../../../../app/core/auth/auth.service';
import { DspaceRestService } from '../../../../../../app/core/dspace-rest/dspace-rest.service';
import { RESTURLCombiner } from '../../../../../../app/core/url-combiner/rest-url-combiner';
import { RawRestResponse } from '../../../../../../app/core/dspace-rest/raw-rest-response.model';
import { of } from 'rxjs';

export interface UserContentStats {
  mySubmission: {
    workspace: {
      total: number;
      rejected: number;
    };
    workflow: {
      total: number;
      reviewstep?: number;
      editstep?: number;
      finaleditstep: number;
    };
    archived: number;
    withdrawn: number;
  };
  myActions: {
    [step: string]: {
      [action: string]: number;
    };
  };
}

import { APP_CONFIG, AppConfig } from '../../../../../../config/app-config.interface';
import { Inject } from '@angular/core';

@Component({
  selector: 'ds-user-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  stats$: Observable<UserContentStats>;

  constructor(
    protected authService: AuthService,
    protected restService: DspaceRestService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) { }

  ngOnInit(): void {
    this.stats$ = this.authService.getAuthenticatedUserIdFromStore().pipe(
      take(1),
      switchMap((userId: string) => {
        if (!userId) {
          return of({} as UserContentStats);
        }
        const url = new RESTURLCombiner(this.appConfig.rest.baseUrl, 'statistics', 'usercontentstats', userId).toString();
        return this.restService.get(url).pipe(
          map((response: RawRestResponse) => response.payload as UserContentStats),
          catchError((err) => {
            console.error('Error fetching user content stats', err);
            return of({} as UserContentStats);
          })
        );
      }),
      shareReplay(1)
    );
  }

  /**
   * Helper to check if any submissions exist
   */
  hasSubmissions(stats: UserContentStats): boolean {
    if (!stats || !stats.mySubmission) {
      return false;
    }
    const s = stats.mySubmission;
    return (s.workspace?.total > 0) ||
      (s.workflow?.total > 0) ||
      (s.workflow?.reviewstep > 0) ||
      (s.workflow?.editstep > 0) ||
      (s.workflow?.finaleditstep > 0) ||
      (s.archived > 0) ||
      (s.withdrawn > 0);
  }

  /**
   * Helper to convert myActions object to an array for *ngFor
   */
  getActionEntries(actions: { [step: string]: { [action: string]: number } }): any[] {
    if (!actions) {
      return [];
    }
    return Object.entries(actions).map(([step, actionCounts]) => ({
      step,
      details: Object.entries(actionCounts).map(([action, count]) => ({ action, count }))
    }));
  }

  /**
   * Helper to find a count for a specific action (e.g. 'Approved') from the details array
   */
  getActionCount(details: any[], actionName: string): number {
    const detail = details.find(d => d.action.toLowerCase() === actionName.toLowerCase());
    return detail ? detail.count : 0;
  }

  /**
   * Convert technical step names to readable labels
   */
  getStepLabel(step: string): string {
    const labels = {
      'editstep': 'Edit Step',
      'reviewstep': 'Review Step',
      'finaleditstep': 'Final Edit Step'
    };
    return labels[step] || step;
  }
}
