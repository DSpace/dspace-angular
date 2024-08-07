import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  first,
  map,
  switchMap,
} from 'rxjs/operators';

import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { ItemTemplateDataService } from '../../core/data/item-template-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { Item } from '../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { ThemedDsoEditMetadataComponent } from '../../dso-shared/dso-edit-metadata/themed-dso-edit-metadata.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertType } from '../../shared/alert/alert-type';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { getCollectionEditRoute } from '../collection-page-routing-paths';

@Component({
  selector: 'ds-base-edit-item-template-page',
  templateUrl: './edit-item-template-page.component.html',
  imports: [
    ThemedDsoEditMetadataComponent,
    RouterLink,
    AsyncPipe,
    VarDirective,
    NgIf,
    TranslateModule,
    ThemedLoadingComponent,
    AlertComponent,
  ],
  standalone: true,
})
/**
 * Component for editing the item template of a collection
 */
export class EditItemTemplatePageComponent implements OnInit {

  /**
   * The collection to edit the item template for
   */
  collectionRD$: Observable<RemoteData<Collection>>;

  /**
   * The template item
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  AlertTypeEnum = AlertType;

  constructor(
    protected route: ActivatedRoute,
    public itemTemplateService: ItemTemplateDataService,
    public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.parent.data.pipe(first(), map((data) => data.dso));
    this.itemRD$ = this.collectionRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((collection) => this.itemTemplateService.findByCollectionID(collection.id)),
    );
  }

  /**
   * Get the URL to the collection's edit page
   * @param collection
   */
  getCollectionEditUrl(collection: Collection): string {
    if (collection) {
      return getCollectionEditRoute(collection.uuid);
    } else {
      return '';
    }
  }

}
