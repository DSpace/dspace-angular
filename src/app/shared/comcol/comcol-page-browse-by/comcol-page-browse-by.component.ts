import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EventType,
  NavigationEnd,
  Router,
  RouterLink,
  Scroll,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  take,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';
import { getCollectionPageRoute } from '../../../collection-page/collection-page-routing-paths';
import { getCommunityPageRoute } from '../../../community-page/community-page-routing-paths';
import { BrowseService } from '../../../core/browse/browse.service';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { BrowseDefinition } from '../../../core/shared/browse-definition.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { isNotEmpty } from '../../empty.util';

export interface ComColPageNavOption {
  id: string;
  label: string;
  routerLink: string;
  params?: any;
}

/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
@Component({
  selector: 'ds-base-comcol-page-browse-by',
  styleUrls: ['./comcol-page-browse-by.component.scss'],
  templateUrl: './comcol-page-browse-by.component.html',
  imports: [
    AsyncPipe,
    FormsModule,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
})
export class ComcolPageBrowseByComponent implements OnDestroy, OnInit {
  /**
   * The ID of the Community or Collection
   */
  @Input() id: string;
  @Input() contentType: string;

  allOptions$: Observable<ComColPageNavOption[]>;

  currentOption$: BehaviorSubject<ComColPageNavOption> = new BehaviorSubject(undefined);

  subs: Subscription[] = [];

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    public router: Router,
    private browseService: BrowseService,
  ) {
  }

  ngOnInit(): void {
    this.allOptions$ = this.browseService.getBrowseDefinitions().pipe(
      getFirstCompletedRemoteData(),
      map((browseDefListRD: RemoteData<PaginatedList<BrowseDefinition>>) => {
        const allOptions: ComColPageNavOption[] = [];
        if (browseDefListRD.hasSucceeded) {
          let comColRoute: string;
          if (this.contentType === 'collection') {
            comColRoute = getCollectionPageRoute(this.id);
            allOptions.push({
              id: 'search',
              label: 'collection.page.browse.search.head',
              routerLink: `${comColRoute}/search`,
            });
          } else if (this.contentType === 'community') {
            comColRoute = getCommunityPageRoute(this.id);
            allOptions.push({
              id: 'search',
              label: 'collection.page.browse.search.head',
              routerLink: `${comColRoute}/search`,
            });
            allOptions.push({
              id: 'comcols',
              label: 'community.all-lists.head',
              routerLink: `${comColRoute}/subcoms-cols`,
            });
          }

          allOptions.push(...browseDefListRD.payload.page.map((config: BrowseDefinition) => ({
            id: `browse_${config.id}`,
            label: `browse.comcol.by.${config.id}`,
            routerLink: `${comColRoute}/browse/${config.id}`,
          })));

          // When the default tab is not the "search" tab, the "search" tab is moved
          // at the end of the tabs ribbon for aesthetics purposes.
          if (this.appConfig[this.contentType].defaultBrowseTab !== 'search') {
            allOptions.push(allOptions.shift());
          }
        }
        return allOptions;
      }),
    );

    let comColRoute: string;
    if (this.contentType === 'collection') {
      comColRoute = getCollectionPageRoute(this.id);
    } else if (this.contentType === 'community') {
      comColRoute = getCommunityPageRoute(this.id);
    }

    this.subs.push(combineLatest([
      this.allOptions$,
      this.router.events.pipe(
        startWith(this.router),
        filter((next: Router|Scroll) => (isNotEmpty((next as Router)?.url) || (next as Scroll)?.type === EventType.Scroll)),
        map((next: Router|Scroll) => (next as Router)?.url || ((next as Scroll).routerEvent as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged(),
      ),
    ]).subscribe(([navOptions, url]: [ComColPageNavOption[], string]) => {
      for (const option of navOptions) {
        if (url?.split('?')[0] === comColRoute && option.id === this.appConfig[this.contentType].defaultBrowseTab) {
          void this.router.navigate([option.routerLink], { queryParams: option.params });
          break;
        } else if (option.routerLink === url?.split('?')[0]) {
          this.currentOption$.next(option);
          break;
        }
      }
    }));

    if (this.router.url?.split('?')[0] === comColRoute) {
      this.allOptions$.pipe(
        take(1),
      ).subscribe((allOptions: ComColPageNavOption[]) => {
        for (const option of allOptions) {
          if (option.id === this.appConfig[this.contentType].defaultBrowseTab) {
            this.currentOption$.next(option[0]);
            void this.router.navigate([option.routerLink], { queryParams: option.params });
            break;
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onSelectChange(event: any): void {
    this.allOptions$.pipe(
      take(1),
    ).subscribe((allOptions: ComColPageNavOption[]) => {
      for (const option of allOptions) {
        if (option.id === event.target.value) {
          this.currentOption$.next(option[0]);
          void this.router.navigate([option.routerLink], { queryParams: option.params });
          break;
        }
      }
    });
  }
}
