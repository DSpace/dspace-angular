import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
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
  of,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { getCollectionPageRoute } from '../../../collection-page/collection-page-routing-paths';
import { getCommunityPageRoute } from '../../../community-page/community-page-routing-paths';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import {
  getFinishedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { isNotEmpty } from '../../../shared/empty.util';

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
    FormsModule,
    NgForOf,
    RouterLink,
    TranslateModule,
    AsyncPipe,
    NgIf,
  ],
  standalone: true,
})
export class ComcolPageBrowseByComponent implements OnDestroy, OnInit {
  /**
   * The ID of the Community or Collection
   */
  @Input() id: string;
  @Input() contentType: string;

  allOptions: ComColPageNavOption[];

  allOptions$: Observable<ComColPageNavOption[]>;

  currentOptionId$: BehaviorSubject<string> = new BehaviorSubject(undefined);

  subs: Subscription[] = [];

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private route: ActivatedRoute,
    private router: Router,
    private configurationService: ConfigurationDataService,
    private collectionService: CollectionDataService) {
  }

  ngOnInit(): void {
    this.allOptions$ = this.calculateBrowseProperty().pipe(
      switchMap ( (browseProperty) => this.configurationService.findByPropertyName( browseProperty) ),
      getFinishedRemoteData(),
      switchMap( (remoteData) => this.searchForBaseBrowseCollectionPropertyIfDataNotFound(remoteData)),
      getFinishedRemoteData(),
      getRemoteDataPayload(),
      map ( (configProperty) => {
        const comColRoute = (this.contentType === 'collection') ? getCollectionPageRoute(this.id) : getCommunityPageRoute(this.id);
        let options = this.initOptionsByContentType(comColRoute);
        if (configProperty) {
          options = [...options, ...configProperty.values.map((configValue: string) => ({
            id: configValue,
            label: `browse.comcol.by.${configValue}`,
            routerLink: `${comColRoute}/browse/${configValue}`,
          }))];
        }
        // When the default tab is not the "search" tab, the "search" tab is moved
        // at the end of the tabs ribbon for aesthetics purposes.
        if (this.appConfig[this.contentType].defaultBrowseTab !== 'search') {
          options.push(options.shift());
        }
        this.allOptions = options;
        return options;
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
          this.currentOptionId$.next(option.id);
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
            this.currentOptionId$.next(option[0].id);
            void this.router.navigate([option.routerLink], { queryParams: option.params });
            break;
          }
        }
      });
    }
  }

  /**
   * Search for the base browse.collection property if the current content type is
   * a collection and no remoteData was found.
   * @param remoteData the remote data coming from the previous search
   */
  searchForBaseBrowseCollectionPropertyIfDataNotFound(remoteData: RemoteData<ConfigurationProperty>): Observable<RemoteData<ConfigurationProperty>> {
    if (remoteData.hasFailed && remoteData.statusCode === 404 && this.contentType === 'collection') {
      return this.configurationService.findByPropertyName('browse.collection')
        .pipe(getFinishedRemoteData());
    } else {
      return of(remoteData);
    }
  }

  private calculateBrowseProperty(): Observable<string> {
    if (this.contentType === 'collection') {
      return this.collectionService.findById(this.id).pipe(
        getFirstSucceededRemoteDataPayload(),
        map( (collection) => collection.firstMetadataValue('dspace.entity.type') ),
        map ( (entityType) => entityType ? 'browse.collection.' + entityType : 'browse.collection' ),
      );
    }
    return of('browse.' + this.contentType);
  }

  private initOptionsByContentType(comColRoute: string): ComColPageNavOption[] {
    const allOptions = [];
    if (this.contentType === 'collection') {
      allOptions.push({
        id: 'search',
        label: 'collection.page.browse.search.head',
        routerLink: `${comColRoute}/search`,
      });
    } else if (this.contentType === 'community') {
      allOptions.push({
        id: 'search',
        label: 'community.page.browse.search.head',
        routerLink: `${comColRoute}/search`,
      });
      allOptions.push({
        id: 'comcols',
        label: 'community.all-lists.head',
        routerLink: `${comColRoute}/subcoms-cols`,
      });
    }

    return allOptions;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onSelectChange(newId: string) {
    const selectedOption = this.allOptions
      .find((option: ComColPageNavOption) => option.id === newId);

    this.router.navigate([selectedOption.routerLink], { queryParams: selectedOption.params });
  }
}
