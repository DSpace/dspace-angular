import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { ItemPageCcLicenseFieldComponent } from '../../../../../../../item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { MetadataGroupComponent } from '../metadataGroup/metadata-group.component';

@Component({
  selector: 'ds-cc-license-small',
  imports: [
    ItemPageCcLicenseFieldComponent,
  ],
  templateUrl: './cc-license-small.component.html',
  styleUrl: './cc-license-small.component.scss',
})
export class CcLicenseSmallComponent extends MetadataGroupComponent implements  OnInit  {

  dcRights: any;
  dcRightsUri: any;

  constructor(
  @Inject('fieldProvider') public fieldProvider: LayoutField,
  @Inject('itemProvider') public itemProvider: Item,
  @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
  @Inject('tabNameProvider') public tabNameProvider: string,
  protected translateService: TranslateService,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }
  ngOnInit(): void {
    super.ngOnInit();
    const ccLicenseEntryMetadata = this.componentsToBeRenderedMap.get(0);
    [this.dcRights, this.dcRightsUri] = ccLicenseEntryMetadata.map((entryMeta) => entryMeta.field.metadata);

  }
}
