import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  map,
  Observable,
} from 'rxjs';

import { getCollectionPageRoute } from '../../../collection-page/collection-page-routing-paths';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Collection } from '../../../core/shared/collection.model';
import { getAllSucceededRemoteDataPayload } from '../../../core/shared/operators';
import {
  hasValueOperator,
  isNotEmpty,
} from '../../empty.util';
import { ErrorComponent } from '../../error/error.component';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { VarDirective } from '../../utils/var.directive';
import { DSpaceObjectSelect } from '../object-select.model';
import { ObjectSelectComponent } from '../object-select/object-select.component';

@Component({
  selector: 'ds-collection-select',
  templateUrl: './collection-select.component.html',
  styleUrls: ['./collection-select.component.scss'],
  standalone: true,
  imports: [VarDirective, NgIf, PaginationComponent, NgFor, FormsModule, RouterLink, ErrorComponent, ThemedLoadingComponent, NgClass, AsyncPipe, TranslateModule],
})

/**
 * A component used to select collections from a specific list and returning the UUIDs of the selected collections
 */
export class CollectionSelectComponent extends ObjectSelectComponent<Collection> implements OnInit {

  /**
   * Collection of all the data that is used to display the {@link Collection} in the HTML.
   * By collecting this data here it doesn't need to be recalculated on evey change detection.
   */
  selectCollections$: Observable<DSpaceObjectSelect<Collection>[]>;

  ngOnInit(): void {
    super.ngOnInit();
    if (!isNotEmpty(this.confirmButton)) {
      this.confirmButton = 'collection.select.confirm';
    }
    this.selectCollections$ = this.dsoRD$.pipe(
      hasValueOperator(),
      getAllSucceededRemoteDataPayload(),
      map((collections: PaginatedList<Collection>) => collections.page.map((collection: Collection) => Object.assign(new DSpaceObjectSelect<Collection>(), {
        dso: collection,
        canSelect$: this.canSelect(collection),
        selected$: this.getSelected(collection.id),
        route: getCollectionPageRoute(collection.id),
      } as DSpaceObjectSelect<Collection>))),
    );
  }

}
