import { CdkTreeModule } from '@angular/cdk/tree';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  shareReplay,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';
import { CommunityListComponent as BaseComponent } from '../../../../../app/community-list-page/community-list/community-list.component';
import { CommunityListService } from '../../../../../app/community-list-page/community-list-service';
import { DSONameService } from '../../../../../app/core/breadcrumbs/dso-name.service';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TruncatableComponent } from '../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';

@Component({
  selector: 'ds-themed-community-list',
  styleUrls: ['./community-list.component.scss'],
  templateUrl: './community-list.component.html',
  imports: [
    AsyncPipe,
    CdkTreeModule,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class CommunityListComponent extends BaseComponent {

  private countCache = new Map<string, Observable<number>>();

  constructor(
    communityListService: CommunityListService,
    dsoNameService: DSONameService,
    private http: HttpClient,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
  ) {
    super(communityListService, dsoNameService);
  }

  /**
   * Fetches the archived item count for a community via the search API.
   * Results are cached per UUID so only one HTTP request is made per community.
   */
  getItemCount(uuid: string): Observable<number> {
    if (!uuid) { return of(0); }
    if (!this.countCache.has(uuid)) {
      const url = `${this.appConfig.rest.baseUrl}/api/discover/search/objects?scope=${uuid}&dsoType=item&size=0`;
      this.countCache.set(uuid,
        this.http.get<any>(url).pipe(
          map((r: any) => r?._embedded?.searchResult?.page?.totalElements ?? 0),
          catchError(() => of(0)),
          shareReplay(1),
        ),
      );
    }
    return this.countCache.get(uuid);
  }

}
