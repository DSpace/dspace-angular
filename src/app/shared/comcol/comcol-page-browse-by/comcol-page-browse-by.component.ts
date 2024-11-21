import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Params,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

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
    RouterLinkActive,
    TranslateModule,
    AsyncPipe,
    NgIf,
  ],
  standalone: true,
})
export class ComcolPageBrowseByComponent implements OnInit {
  /**
   * The ID of the Community or Collection
   */
  @Input() id: string;
  @Input() contentType: string;

  allOptions: ComColPageNavOption[];

  allOptions$: Observable<ComColPageNavOption[]>;

  currentOptionId$: Observable<string>;

  constructor(
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
        let options = [this.getFirstOptionByContentType()];
        if (configProperty) {
          options = [...options, ...configProperty.values.map((configValue: string) => ({
            id: configValue,
            label: `browse.comcol.by.${configValue}`,
            routerLink: `/browse/${configValue}`,
            params: { scope: this.id },
          }))];
        }
        this.allOptions = options;
        return options;
      }),
    );

    this.currentOptionId$ = this.route.params.pipe(
      map((params: Params) => params.id),
    );
  }

  onSelectChange(newId: string) {
    const selectedOption = this.allOptions
      .find((option: ComColPageNavOption) => option.id === newId);

    this.router.navigate([selectedOption.routerLink], { queryParams: selectedOption.params });
  }

  calculateBrowseProperty(): Observable<string> {
    if (this.contentType === 'collection') {
      return this.collectionService.findById(this.id).pipe(
        getFirstSucceededRemoteDataPayload(),
        map( (collection) => collection.firstMetadataValue('dspace.entity.type') ),
        map ( (entityType) => entityType ? 'browse.collection.' + entityType : 'browse.collection' ),
      );
    }
    return of('browse.' + this.contentType);
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

  getFirstOptionByContentType(): ComColPageNavOption {
    if (this.contentType === 'collection') {
      return {
        id: this.id,
        label: 'collection.page.browse.recent.head',
        routerLink: getCollectionPageRoute(this.id),
      };
    } else if (this.contentType === 'community') {
      return {
        id: this.id,
        label: 'community.all-lists.head',
        routerLink: getCommunityPageRoute(this.id),
      };
    }
    return null;
  }

}
