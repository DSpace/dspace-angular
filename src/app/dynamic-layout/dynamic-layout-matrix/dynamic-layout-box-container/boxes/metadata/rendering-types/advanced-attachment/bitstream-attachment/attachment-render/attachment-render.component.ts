import {
  Component,
  inject,
  Injector,
  Input,
} from '@angular/core';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { Item } from '@dspace/core/shared/item.model';

import { AbstractComponentLoaderComponent } from '../../../../../../../../../shared/abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../../../../../../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { ThemeService } from '../../../../../../../../../shared/theme-support/theme.service';
import {
  AttachmentRenderingType,
  getAttachmentTypeRendering,
} from '../attachment-type.decorator';

/**
 * Component that dynamically loads the correct attachment rendering component
 * based on the bitstream's rendering type.
 *
 * Extends {@link AbstractComponentLoaderComponent} to leverage automatic input wiring
 * and re-instantiation when the rendering type or bitstream changes.
 */
@Component({
  selector: 'ds-attachment-render',
  templateUrl: '../../../../../../../../../shared/abstract-component-loader/abstract-component-loader.component.html',
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
export class AttachmentRenderComponent extends AbstractComponentLoaderComponent<Component> {

  /**
   * Current DSpace Item
   */
  @Input() item: Item;

  /**
   * The bitstream to render
   */
  @Input() bitstream: Bitstream;

  /**
   * The rendering type for the attachment
   */
  @Input() renderingType: AttachmentRenderingType | string;

  /**
   * The tab name
   */
  @Input() tabName: string;

  /**
   * Input names that should be passed down to the dynamically created component.
   */
  protected inputNames: (keyof this & string)[] = [
    'item', 'bitstream',
  ];

  /**
   * When renderingType or bitstream changes, the component must be re-evaluated.
   */
  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'renderingType', 'bitstream',
  ];

  private injector: Injector = inject(Injector);

  constructor(
    protected themeService: ThemeService,
  ) {
    super(themeService);
  }

  /**
   * Fetch the component depending on the attachment rendering type.
   * Called by the abstract base class when instantiating or re-instantiating the component.
   *
   * @returns The constructor of the matching attachment render component
   */
  public getComponent(): GenericConstructor<Component> {
    const rendering = this.renderingType || AttachmentRenderingType.DOWNLOAD;
    return getAttachmentTypeRendering(rendering);
  }

  /**
   * Generate Component Injector object
   */
  getComponentInjector() {
    const providers = [
      { provide: 'itemProvider', useValue: this.item, deps: [] },
      { provide: 'bitstreamProvider', useValue: this.bitstream, deps: [] },
      { provide: 'tabNameProvider', useValue: this.tabName, deps: [] },
    ];
    return Injector.create({
      providers: providers,
      parent: this.injector,
    });
  }
}
