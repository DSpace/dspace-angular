import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { CrisLayoutLoaderDirective } from 'src/app/layout/directives/cris-layout-loader.directive';
import { GenericConstructor } from 'src/app/core/shared/generic-constructor';
import { getMetadataBoxFieldRendering } from '../metadata-box.decorator';
import { Item } from 'src/app/core/shared/item.model';
import { LayoutBox } from 'src/app/layout/enums/layout-box.enum';
import { LinkI18nComponent } from '../link-i18n/link-i18n.component';
import { Box } from 'src/app/core/layout/models/box.model';

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: '[ds-row]',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class RowComponent implements OnInit {

  @Input() item: Item;
  @Input() box: Box;
  @Input() row: any;

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(CrisLayoutLoaderDirective, {static: true}) crisLayoutLoader: CrisLayoutLoaderDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    const fields = this.row.fields;

    const viewContainerRef = this.crisLayoutLoader.viewContainerRef;
    viewContainerRef.clear();
    fields.forEach((field) => {
      if (field.fieldType === LayoutBox.METADATA) {
        const metadataFactory = this.componentFactoryResolver.resolveComponentFactory(
          this.getComponent(field.rendering)
        );
        const metadataRef = viewContainerRef.createComponent(metadataFactory);
        (metadataRef.instance as any).item = this.item;
        (metadataRef.instance as any).field = field;
        if (metadataRef.instance instanceof LinkI18nComponent) {
          (metadataRef.instance as any).box = this.box;
        }
      }
    });
  }

  private getComponent(fieldRenderingType: string): GenericConstructor<Component> {
    return getMetadataBoxFieldRendering(fieldRenderingType);
  }

}
