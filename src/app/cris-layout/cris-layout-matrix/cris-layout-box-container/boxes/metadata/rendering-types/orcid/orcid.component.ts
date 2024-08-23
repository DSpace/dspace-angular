import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigurationDataService } from '../../../../../../../core/data/configuration-data.service';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { ConfigurationProperty } from '../../../../../../../core/shared/configuration-property.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../../core/shared/operators';
import {
  FieldRenderingType,
  MetadataBoxFieldRendering,
} from '../metadata-box.decorator';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, AsyncPipe } from '@angular/common';

/**
 * This component renders the text metadata fields
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'span[ds-orcid]',
    templateUrl: './orcid.component.html',
    styleUrls: ['./orcid.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgbTooltipModule,
        AsyncPipe,
        TranslateModule,
    ],
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
    protected translateService: TranslateService,
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

  ngOnInit() {
    this.orcidUrl$ = this.configurationService.findByPropertyName('orcid.domain-url').pipe(
      getFirstSucceededRemoteDataPayload(),
      map((property: ConfigurationProperty) => property?.values?.length > 0 ? property.values[0] : null),
    );
  }

  public hasOrcid(): boolean {
    return this.item.hasMetadata('person.identifier.orcid');
  }

  public hasOrcidBadge(): boolean {
    return this.item.hasMetadata('dspace.orcid.authenticated');
  }

}
