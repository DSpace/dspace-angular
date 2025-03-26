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
  getAttachmentTypeRendering
} from '../attachment-type.decorator';
import { Item } from '../../../../../../../../../core/shared/item.model';
import { GenericConstructor } from '../../../../../../../../../core/shared/generic-constructor';
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
   * The tab name
   */
  @Input() tabName: string;

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
   * Generate ComponentFactory for attachment rendering
   */
  computeComponentFactory(): ComponentFactory<any> {
    const rendering = this.computeRendering();
    const attachmentTypeRenderOptions = getAttachmentTypeRendering(rendering);
    const constructor: GenericConstructor<Component> = attachmentTypeRenderOptions?.componentRef;
    return constructor ? this.componentFactoryResolver.resolveComponentFactory(constructor) : null;
  }

  /**
   * Generate ComponentRef for attachment rendering
   */
  generateComponentRef(): ComponentRef<any> {
    let attachentComponentRef: ComponentRef<Component>;
    const factory: ComponentFactory<any> = this.computeComponentFactory();
    if (factory) {
      attachentComponentRef = this.attachmentValueViewRef.createComponent(factory, 0, this.getComponentInjector());
      (attachentComponentRef.instance as any).item = this.item;
      (attachentComponentRef.instance as any).bitstream = this.bitstream;
      (attachentComponentRef.instance as any).tabName = this.tabName;
    }
    return attachentComponentRef;
  }

  /**
   * Generate Component Injector object
   */
  getComponentInjector() {
    const providers = [
      {provide: 'itemProvider', useValue: this.item, deps: []},
      {provide: 'bitstreamProvider', useValue: this.bitstream, deps: []},
      {provide: 'tabNameProvider', useValue: this.tabName, deps: []}
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

}
