import { Component, Inject, OnInit } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { ConfigurationDataService } from '../../../../../../../core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../../core/shared/operators';
import { ConfigurationProperty } from '../../../../../../../core/shared/configuration-property.model';
import { TranslateService } from '@ngx-translate/core';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';

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
export class OrcidComponent extends RenderingTypeValueModelComponent implements OnInit {

  public orcidUrl: string;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: any,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    private configurationService: ConfigurationDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, translateService);
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
