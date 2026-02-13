import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  map,
  Observable,
} from 'rxjs';

@Component({
  selector: 'ds-metadata-link-view-orcid',
  templateUrl: './metadata-link-view-orcid.component.html',
  styleUrls: ['./metadata-link-view-orcid.component.scss'],
  imports: [
    AsyncPipe,
    NgbTooltipModule,
    TranslateModule,
  ],
})
export class MetadataLinkViewOrcidComponent implements OnInit {
  /**
   * Item value to display the metadata for
   */
  @Input() itemValue: Item;

  metadataValue: string;

  orcidUrl$: Observable<string>;

  constructor(protected configurationService: ConfigurationDataService) {}

  ngOnInit(): void {
    this.orcidUrl$ = this.configurationService
      .findByPropertyName('orcid.domain-url')
      .pipe(
        getFirstCompletedRemoteData(),
        map((propertyPayload: RemoteData<ConfigurationProperty>) =>
          propertyPayload.hasSucceeded ?
            (propertyPayload.payload?.values?.length > 0 ? propertyPayload.payload.values[0] : null)
            : null,
        ),
      );
    this.metadataValue = this.itemValue.firstMetadataValue(
      'person.identifier.orcid',
    );
  }

  public hasOrcid(): boolean {
    return this.itemValue.hasMetadata('person.identifier.orcid');
  }

  public hasOrcidBadge(): boolean {
    return this.itemValue.hasMetadata('dspace.orcid.authenticated');
  }
}
