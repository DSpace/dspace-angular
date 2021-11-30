import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { GenericConstructor } from '../../../../../../core/shared/generic-constructor';
import { Item } from '../../../../../../core/shared/item.model';
import {
  CrisLayoutBox,
  LayoutField,
  MetadataBoxCell,
  MetadataBoxRow
} from '../../../../../../core/layout/models/box.model';
import { FieldRenderingType, getMetadataBoxFieldRendering } from '../rendering-types/metadata-box.decorator';

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

  /**
   * Current DSpace Item
   */
  @Input() item: Item;
  /**
   * Current layout box
   */
  @Input() box: CrisLayoutBox;
  /**
   * Current row configuration
   */
  @Input() row: MetadataBoxRow;

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild('thumbnailContainer', { static: true, read: ViewContainerRef }) thumbnailContainerViewRef: ViewContainerRef;

  /**
   * This property is true if the current row contains a thumbnail, false otherwise
   */
  hasThumbnail = false;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
/*    const fields = this.row.fields;

    this.thumbnailContainerViewRef.clear();

    // Search for all Thumbnail Fields to render
    const allThumbnailFields = this.row.fields
      .filter(field => isNotEmpty(field.rendering) && field.rendering.toUpperCase() === FieldRenderingType.THUMBNAIL);
    this.hasThumbnail = allThumbnailFields.length > 0;

    allThumbnailFields.forEach((field) => {
        const factory = this.computeThumbnailComponentFactory(FieldRenderingType.THUMBNAIL);
        if (factory) {
          const metadataComponentRef = this.generateThumbnailComponentRef(factory);
          this.populateThumbnailComponent(metadataComponentRef, field);
        }
    });*/
  }

  trackUpdate(index, field: LayoutField) {
    return field && field.metadata;
  }

  /**
   * Generate ComponentFactory for Thumbnail rendering
   * @param fieldRenderingType
   */
  computeThumbnailComponentFactory(fieldRenderingType: string | FieldRenderingType): ComponentFactory<any> {
    const constructor: GenericConstructor<Component> = getMetadataBoxFieldRendering(fieldRenderingType)?.componentRef;
    return constructor ? this.componentFactoryResolver.resolveComponentFactory(constructor) : null;
  }

  /**
   * Generate ComponentRef for Thumbnail rendering
   * @param factory
   */
  generateThumbnailComponentRef(factory: ComponentFactory<any>): ComponentRef<any> {
    let metadataRef: ComponentRef<Component>;
    metadataRef = this.thumbnailContainerViewRef.createComponent(factory);
    return metadataRef;
  }

  /**
   * Assign property to component instance
   * @param metadataRef
   * @param field
   */
  populateThumbnailComponent(metadataRef: ComponentRef<Component>, field: LayoutField): void {
    (metadataRef.instance as any).item = this.item;
    (metadataRef.instance as any).field = field;
  }

  /**
   * Return the list of all cell
   * belonging to the current row
   */
  getRowMetadataCells(): MetadataBoxCell[] {
    return this.row.cells;
  }
}
