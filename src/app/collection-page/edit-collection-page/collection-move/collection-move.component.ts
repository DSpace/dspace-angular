import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { getCollectionPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { Community } from 'src/app/core/shared/community.model';
import { AuthorizedCommunitySelectorComponent } from 'src/app/shared/dso-selector/dso-selector/authorized-community-selector/authorized-community-selector.component';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { Collection } from '../../../core/shared/collection.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import {
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { getCollectionEditRoute } from '../../collection-page-routing-paths';

@Component({
  selector: 'ds-item-move',
  templateUrl: './collection-move.component.html',
  imports: [
    AsyncPipe,
    AuthorizedCommunitySelectorComponent,
    BtnDisabledDirective,
    FormsModule,
    NgbModule,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component that handles the moving of an item to a different collection
 */
export class CollectionMoveComponent implements OnInit {
  /**
   * TODO: There is currently no backend support to change the owningCollection and inherit policies,
   * TODO: when this is added, the inherit policies option should be used.
   */

  selectorType = DSpaceObjectType.COMMUNITY;

  collectionRD$: Observable<RemoteData<Collection>>;
  originalCommunity: Community;

  selectedCommunityName: string;
  selectedCommunity: Community;
  canSubmit = false;

  collection: Collection;
  processing = false;

  /**
   * Route to the item's page
   */
  collectionPageRoute$: Observable<string>;

  COMMUNITIES = [DSpaceObjectType.COMMUNITY];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              private collectionDataService: CollectionDataService,
              private translateService: TranslateService,
              private requestService: RequestService,
              protected dsoNameService: DSONameService,
  ) {}

  ngOnInit(): void {
    this.collectionRD$ = this.route.parent.data.pipe(
      map((data) => data.dso as RemoteData<Collection>),
    );

    this.collectionRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((collection) => {
      this.collection = collection;
    });

    this.collectionPageRoute$ = this.collectionRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((collection) => getCollectionPageRoute(collection.id)),
    );

    this.collectionRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((collection) => collection.parentCommunity),
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((community) => {
      this.originalCommunity = community;
    });
  }


  /**
   * Set the collection name and id based on the selected value
   * @param data - obtained from the ds-input-suggestions component
   */
  selectDso(data: any): void {
    this.selectedCommunity = data;
    this.selectedCommunityName = this.dsoNameService.getName(data);
    this.canSubmit = true;
  }

  /**
   * @returns {string} the current URL
   */
  getCurrentUrl() {
    return this.router.url;
  }

  /**
   * Moves the item to a new collection based on the selected collection
   */
  moveToCommunity() {
    this.processing = true;
    const move$ = this.collectionDataService.moveToCommunity(this.collection?.id, this.selectedCommunity)
      .pipe(getFirstCompletedRemoteData());

    move$.subscribe((response: RemoteData<any>) => {
      if (response.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('collection.edit.move.success'));
      } else {
        this.notificationsService.error(this.translateService.get('collection.edit.move.error'));
      }
    });

    move$.pipe(
      switchMap(() => this.requestService.setStaleByHrefSubstring(this.collection?.id)),
      switchMap(() =>
        this.collectionDataService.findById(
          this.collection?.id,
          false,
          true,
          followLink('parentCommunity'),
        )),
      getFirstCompletedRemoteData(),
    ).subscribe(() => {
      this.processing = false;
      this.router.navigate([getCollectionEditRoute(this.collection.id)]);
    });
  }

  discard(): void {
    this.selectedCommunity = null;
    this.canSubmit = false;
  }

  get canMove(): boolean {
    return this.canSubmit && this.selectedCommunity?.id !== this.originalCommunity?.id;
  }
}
