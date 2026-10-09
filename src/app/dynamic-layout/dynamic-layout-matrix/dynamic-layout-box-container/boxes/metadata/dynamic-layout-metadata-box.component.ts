
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  DynamicLayoutBox,
  LayoutField,
  LayoutFieldType,
  MetadataBoxConfiguration,
  MetadataBoxRow,
} from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateService } from '@ngx-translate/core';

import { renderDynamicLayoutBoxFor } from '../../../../decorators/dynamic-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { DynamicLayoutBoxDirective } from '../../../../models/dynamic-layout-box-component.directive';
import { RowComponent } from './row/row.component';

/**
 * This component renders the metadata boxes of items
 */
@renderDynamicLayoutBoxFor(LayoutBox.METADATA)
@Component({
  selector: 'ds-dynamic-layout-metadata-box',
  templateUrl: './dynamic-layout-metadata-box.component.html',
  styleUrls: ['./dynamic-layout-metadata-box.component.scss'],
  imports: [
    RowComponent,
  ],
})
/**
 * For overwrite this component create a new one that extends DynamicLayoutBoxObj and
 * add the DynamicLayoutBoxModelComponent decorator indicating the type of box to overwrite
 */
export class DynamicLayoutMetadataBoxComponent extends DynamicLayoutBoxDirective implements OnInit {

  /**
   * Contains the fields configuration for current box
   */
  metadataBoxConfiguration: MetadataBoxConfiguration;


  constructor(
    public cdr: ChangeDetectorRef,
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: DynamicLayoutBox,
    @Inject('itemProvider') public itemProvider: Item,
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setMetadataComponents(this.box.configuration as MetadataBoxConfiguration);
  }

  /**
   * Set the metadataBoxConfiguration.
   * @param metadatacomponents
   */
  setMetadataComponents(metadatacomponents: MetadataBoxConfiguration) {
    this.metadataBoxConfiguration = metadatacomponents;
    this.cdr.detectChanges();
  }

  /**
   * Whether the given row contains at least one field that will render content.
   *
   * @param row the row configuration to check
   */
  rowHasFields(row: MetadataBoxRow): boolean {
    return (row?.cells ?? []).some((cell) => (cell?.fields ?? []).some((field) => this.fieldHasValue(field)));
  }

  /**
   * Whether the given field will render content for the current item.
   *
   * @param field the field configuration to check
   */
  private fieldHasValue(field: LayoutField): boolean {
    switch (field?.fieldType) {
      case LayoutFieldType.BITSTREAM.toString():
        return true;
      case LayoutFieldType.METADATAGROUP.toString():
        return (field.metadataGroup?.elements ?? []).some((element) => !!this.item.metadata[element.metadata]);
      case LayoutFieldType.METADATA.toString():
        return !!this.item.firstMetadataValue(field.metadata);
      default:
        return false;
    }
  }

}
