import {
  Component,
  inject,
  Injector,
  Input,
} from '@angular/core';
import { DYNAMIC_FIELD_RENDERING_MAP } from '@dspace/config/app-config.interface';
import {
  DynamicLayoutBox,
  LayoutField,
} from '@dspace/core/layout/models/box.model';
import { PLACEHOLDER_PARENT_METADATA } from '@dspace/core/shared/form/ds-dynamic-form-constants';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { Item } from '@dspace/core/shared/item.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';

import { AbstractComponentLoaderComponent } from '../../../../../../../../shared/abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../../../../../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { ThemeService } from '../../../../../../../../shared/theme-support/theme.service';
import { FieldRenderingType } from '../../../rendering-types/field-rendering-type';
import {
  computeRenderingFn,
  getMetadataBoxFieldRenderOptionsFn,
} from '../../../rendering-types/metadata-box.decorator';
import {
  MetadataBoxFieldRenderOptions,
  RenderingTypeDirective,
} from '../../../rendering-types/rendering-type.directive';

@Component({
  selector: 'ds-metadata-render',
  templateUrl: '../../../../../../../../shared/abstract-component-loader/abstract-component-loader.component.html',
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
export class MetadataRenderComponent extends AbstractComponentLoaderComponent<RenderingTypeDirective> {

  /**
   * Current DSpace Item
   */
  @Input() item: Item;
  /**
   * Current layout box
   */
  @Input() box: DynamicLayoutBox;
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

  protected readonly layoutBoxesMap: Map<FieldRenderingType, MetadataBoxFieldRenderOptions> = inject(DYNAMIC_FIELD_RENDERING_MAP);
  private readonly parentInjector: Injector = inject(Injector);

  constructor(
    protected themeService: ThemeService,
  ) {
    super(themeService);
  }

  /**
   * Fetch the component depending on the field's rendering type
   */
  public async getComponent(): Promise<GenericConstructor<RenderingTypeDirective>> {
    this.renderingSubType = computeRenderingFn(this.field.rendering, true);
    const rendering = computeRenderingFn(this.field?.rendering);
    const metadataFieldRenderOptions = getMetadataBoxFieldRenderOptionsFn(this.layoutBoxesMap, rendering);
    return metadataFieldRenderOptions?.componentRef;
  }

  /**
   * Generate Component Injector object
   */
  public override getComponentInjector() {
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
      parent: this.parentInjector,
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
