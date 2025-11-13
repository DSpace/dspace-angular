import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { IdentifierDataService } from '@dspace/core/data/identifier-data.service';
import { IdentifierData } from '@dspace/core/shared/identifiers-data/identifier-data.model';
import { Item } from '@dspace/core/shared/item.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-identifier-data',
  templateUrl: './identifier-data.component.html',
  imports: [
    AsyncPipe,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component rendering an identifier, eg. DOI or handle
 */
export class IdentifierDataComponent implements OnInit {

  @Input() item: Item;
  identifiers$: Observable<IdentifierData>;

  /**
   * Initialize instance variables
   *
   * @param {IdentifierDataService} identifierDataService
   */
  constructor(private identifierDataService: IdentifierDataService) { }

  ngOnInit(): void {
    if (this.item == null) {
      // Do not show the identifier if the feature is inactive or if the item is null.
      return;
    }
    if (this.item.identifiers == null) {
      // In case the identifier has not been loaded, do it individually.
      this.item.identifiers = this.identifierDataService.getIdentifierDataFor(this.item);
    }
    this.identifiers$ = this.item.identifiers.pipe(
      map((identifierRD) => {
        if (identifierRD.statusCode !== 401 && hasValue(identifierRD.payload)) {
          return identifierRD.payload;
        } else {
          return null;
        }
      }),
    );
  }
}
