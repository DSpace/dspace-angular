import { Component, OnInit } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';
import { ConfigurationDataService } from '../../../../../core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { ConfigurationProperty } from '../../../../../core/shared/configuration-property.model';
import { TranslateService } from '@ngx-translate/core';

/**
 * This component renders the text metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-orcid]',
  templateUrl: './orcid.component.html',
  styleUrls: ['./orcid.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.ORCID)
export class OrcidComponent extends RenderingTypeModelComponent implements OnInit {

  public orcidUrl: string;

  constructor(private configurationService: ConfigurationDataService, protected translateService: TranslateService) {
    super(translateService);
  }

  ngOnInit() {
    this.configurationService.findByPropertyName('orcid.domain-url')
      .pipe(getFirstSucceededRemoteDataPayload()).subscribe(
        (property: ConfigurationProperty) => {
          this.orcidUrl = property?.values?.length > 0 ? property.values[0] : null;
        });
  }


  public hasOrcid(): boolean {
    return this.item.hasMetadata('person.identifier.orcid');
  }

  public hasOrcidBadge(): boolean {
    return this.item.hasMetadata('cris.orcid.authenticated');
  }

}
