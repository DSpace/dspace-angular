import {
  Component,
  ComponentRef,
  inject,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { CRIS_FIELD_RENDERING_MAP } from '../../../../../../../../../config/app-config.interface';
import {
  CrisLayoutBox,
  LayoutField,
} from '../../../../../../../../core/layout/models/box.model';
import { GenericConstructor } from '../../../../../../../../core/shared/generic-constructor';
import { Item } from '../../../../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../../../../core/shared/metadata.models';
import { isNotEmpty } from '../../../../../../../../shared/empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../../../../../../../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-constants';
import { CrisLayoutLoaderDirective } from '../../../../../../../directives/cris-layout-loader.directive';
import { FieldRenderingType } from '../../../rendering-types/field-rendering-type';
import {
  computeRenderingFn,
  getMetadataBoxFieldRenderOptionsFn,
} from '../../../rendering-types/metadata-box.decorator';
import { MetadataBoxFieldRenderOptions } from '../../../rendering-types/rendering-type.model';

@Component({
  selector: 'ds-metadata-render',
  templateUrl: './metadata-render.component.html',
  styleUrls: ['./metadata-render.component.scss'],
  standalone: true,
  imports: [CrisLayoutLoaderDirective],
})
export class MetadataRenderComponent implements OnInit {

  /**
   * Current DSpace Item
   */
  @Input() item: Item;
  /**
   * Current layout box
   */
  @Input() box: CrisLayoutBox;
  /**
   * The metadata field to render
   */
  @Input() field: LayoutField;
  /**
   * The metadata value
   */
  @Input() metadataValue: MetadataValue;

  /**
   * The rendering subtype, if exists
   * e.g. for type identifier.doi this property
   * contains the subtype doi
   */
  renderingSubType: string;

  /**
   * Directive hook used to place the dynamic render component
   */
  @ViewChild('metadataValue', {
    static: true,
    read: ViewContainerRef,
  }) metadataValueViewRef: ViewContainerRef;

  protected readonly layoutBoxesMap: Map<FieldRenderingType, MetadataBoxFieldRenderOptions> = inject(CRIS_FIELD_RENDERING_MAP);
  protected readonly injector: Injector = inject(Injector);

  ngOnInit(): void {
    this.metadataValueViewRef.clear();
    this.renderingSubType = computeRenderingFn(this.field.rendering, true);
    this.generateComponentRef();
  }

  /**
   * Generate Component for metadata rendering
   */
  computeComponent(): GenericConstructor<Component> {
    const rendering = computeRenderingFn(this.field?.rendering);
    const metadataFieldRenderOptions = getMetadataBoxFieldRenderOptionsFn(this.layoutBoxesMap, rendering);
    return  metadataFieldRenderOptions?.componentRef;
  }

  /**
   * Generate ComponentRef for metadata rendering
   */
  generateComponentRef(): ComponentRef<any> {
    const component: GenericConstructor<Component> = this.computeComponent();
    return this.metadataValueViewRef.createComponent(component, {
      injector: this.getComponentInjector(),
    });
  }

  /**
   * Generate Component Injector object
   */
  getComponentInjector() {
    const providers = [
      { provide: 'fieldProvider', useValue: this.field, deps: [] },
      { provide: 'itemProvider', useValue: this.item, deps: [] },
      { provide: 'renderingSubTypeProvider', useValue: this.renderingSubType, deps: [] },
    ];
    if (isNotEmpty(this.metadataValue)) {
      this.metadataValue = this.normalizeMetadataValue(this.metadataValue);
      providers.push({ provide: 'metadataValueProvider', useValue: (this.metadataValue as any), deps: [] });
    }

    return Injector.create({
      providers: providers,
      parent: this.injector,
    });
  }

  /**
   * Normalize value to display.
   * In case the value contains a PLACEHOLDER returns it as blank
   * @param metadataValue
   */
  private normalizeMetadataValue(metadataValue: MetadataValue): MetadataValue {
    const value = metadataValue.value;
    if (isNotEmpty(value) && value.includes(PLACEHOLDER_PARENT_METADATA)) {
      return Object.assign(new MetadataValue(), metadataValue, {
        value: '',
      });
    } else {
      return metadataValue;
    }
  }

}
