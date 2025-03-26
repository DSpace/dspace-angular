import { ConfigurationProperty } from './../../../core/shared/configuration-property.model';
import { getFirstSucceededRemoteDataPayload } from './../../../core/shared/operators';
import { ConfigurationDataService } from './../../../core/data/configuration-data.service';
import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'ds-metadata-link-view-orcid',
  templateUrl: './metadata-link-view-orcid.component.html',
  styleUrls: ['./metadata-link-view-orcid.component.scss'],
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
        getFirstSucceededRemoteDataPayload(),
        map((property: ConfigurationProperty) =>
          property?.values?.length > 0 ? property.values[0] : null
        )
      );
    this.metadataValue = this.itemValue.firstMetadataValue(
      'person.identifier.orcid'
    );
  }

  public hasOrcid(): boolean {
    return this.itemValue.hasMetadata('person.identifier.orcid');
  }

  public hasOrcidBadge(): boolean {
    return this.itemValue.hasMetadata('dspace.orcid.authenticated');
  }
}
