import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { ConfigurationDataService } from '../../../../../../../core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../../core/shared/operators';
import { ConfigurationProperty } from '../../../../../../../core/shared/configuration-property.model';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';

/**
 * This component renders the text metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-orcid]',
  templateUrl: './orcid.component.html',
  styleUrls: ['./orcid.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.ORCID)
export class OrcidComponent extends RenderingTypeValueModelComponent implements OnInit {

  orcidUrl$: Observable<string>;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: MetadataValue,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    private configurationService: ConfigurationDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

  ngOnInit() {
    this.orcidUrl$ = this.configurationService.findByPropertyName('orcid.domain-url').pipe(
      getFirstSucceededRemoteDataPayload(),
      map((property: ConfigurationProperty) => property?.values?.length > 0 ? property.values[0] : null)
    );
  }

  public hasOrcid(): boolean {
    return this.item.hasMetadata('person.identifier.orcid');
  }

  public hasOrcidBadge(): boolean {
    return this.item.hasMetadata('dspace.orcid.authenticated');
  }

}
