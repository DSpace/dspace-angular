import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  AttachmentRenderingType,
  AttachmentTypeFieldRenderOptions,
  getAttachmentTypeRendering
} from '../attachment-type.decorator';
import { Item } from '../../../../../../../../../core/shared/item.model';
import { GenericConstructor } from '../../../../../../../../../core/shared/generic-constructor';
import { isEmpty } from '../../../../../../../../../shared/empty.util';
import { Bitstream } from '../../../../../../../../../core/shared/bitstream.model';

@Component({
  selector: 'ds-attachment-render',
  templateUrl: './attachment-render.component.html',
  styleUrls: ['./attachment-render.component.scss']
})
export class AttachmentRenderComponent implements OnInit {

  /**
   * Current DSpace Item
   */
  @Input() item: Item;
  /**
   * The bitstream
   */
  @Input() bitstream: Bitstream;
  /**
   * The bitstream
   */
  @Input() renderingType: AttachmentRenderingType | string;

  /**
   * Directive hook used to place the dynamic render component
   */
  @ViewChild('attachmentValue', {
    static: true,
    read: ViewContainerRef
  }) attachmentValueViewRef: ViewContainerRef;

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {

  }

  ngOnInit(): void {
    this.attachmentValueViewRef.clear();
    this.generateComponentRef();
  }

  /**
   * Generate ComponentFactory for metadata rendering
   */
  computeComponentFactory(): ComponentFactory<any> {
    const rendering = this.computeRendering();
    const metadataFieldRenderOptions = this.getMetadataBoxFieldRenderOptions(rendering);
    const constructor: GenericConstructor<Component> = metadataFieldRenderOptions?.componentRef;
    return constructor ? this.componentFactoryResolver.resolveComponentFactory(constructor) : null;
  }

  /**
   * Generate ComponentRef for metadata rendering
   */
  generateComponentRef(): ComponentRef<any> {
    let metadataRef: ComponentRef<Component>;
    const factory: ComponentFactory<any> = this.computeComponentFactory();
    metadataRef = this.attachmentValueViewRef.createComponent(factory, 0, this.getComponentInjector());
    (metadataRef.instance as any).item = this.item;
    (metadataRef.instance as any).bitstream = this.bitstream;
    return metadataRef;
  }

  /**
   * Generate Component Injector object
   */
  getComponentInjector() {
    const providers = [
      {provide: 'itemProvider', useValue: this.item, deps: []},
      {provide: 'bitstreamProvider', useValue: this.bitstream, deps: []}
    ];

    return Injector.create({
      providers: providers,
      parent: this.injector
    });
  }

  /**
   * Return the rendering type of the field to render
   *
   * @return the rendering type
   */
  computeRendering(): string | AttachmentRenderingType {
    return this.renderingType || AttachmentRenderingType.DOWNLOAD;
  }

  /**
   * Return the rendering option related to the given rendering type
   * @param fieldRenderingType
   */
  getMetadataBoxFieldRenderOptions(fieldRenderingType: string): AttachmentTypeFieldRenderOptions {
    let renderOptions = getAttachmentTypeRendering(fieldRenderingType);
    // If the rendering type not exists will use DOWNLOAD type rendering
    if (isEmpty(renderOptions)) {
      renderOptions = getAttachmentTypeRendering(AttachmentRenderingType.DOWNLOAD);
    }
    return renderOptions;
  }

}
