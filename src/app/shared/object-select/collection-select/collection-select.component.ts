import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { isNotEmpty } from '../../empty.util';
import { ErrorComponent } from '../../error/error.component';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { VarDirective } from '../../utils/var.directive';
import { ObjectSelectService } from '../object-select.service';
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
export class CollectionSelectComponent extends ObjectSelectComponent<Collection> {

  constructor(
    protected objectSelectService: ObjectSelectService,
    protected authorizationService: AuthorizationDataService,
    public dsoNameService: DSONameService,
  ) {
    super(objectSelectService, authorizationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!isNotEmpty(this.confirmButton)) {
      this.confirmButton = 'collection.select.confirm';
    }
  }

}
