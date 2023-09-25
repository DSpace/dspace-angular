import { Component } from '@angular/core';
import { Collection } from '../../../core/shared/collection.model';
import { ObjectSelectComponent } from '../object-select/object-select.component';
import { isNotEmpty } from '../../empty.util';
import { ObjectSelectService } from '../object-select.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { ErrorComponent } from '../../error/error.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../pagination/pagination.component';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { VarDirective } from '../../utils/var.directive';

@Component({
    selector: 'ds-collection-select',
    templateUrl: './collection-select.component.html',
    styleUrls: ['./collection-select.component.scss'],
    standalone: true,
    imports: [VarDirective, NgIf, PaginationComponent, NgFor, FormsModule, RouterLink, ErrorComponent, ThemedLoadingComponent, NgClass, AsyncPipe, TranslateModule]
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
