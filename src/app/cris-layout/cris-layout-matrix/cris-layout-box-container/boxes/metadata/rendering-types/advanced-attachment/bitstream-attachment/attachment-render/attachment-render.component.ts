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

import { Bitstream } from '../../../../../../../../../core/shared/bitstream.model';
import { GenericConstructor } from '../../../../../../../../../core/shared/generic-constructor';
import { Item } from '../../../../../../../../../core/shared/item.model';
import { CrisLayoutLoaderDirective } from '../../../../../../../../directives/cris-layout-loader.directive';
import {
  AttachmentRenderingType,
  getAttachmentTypeRendering,
} from '../attachment-type.decorator';

@Component({
  selector: 'ds-attachment-render',
  templateUrl: './attachment-render.component.html',
  styleUrls: ['./attachment-render.component.scss'],
  standalone: true,
  imports: [CrisLayoutLoaderDirective],
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
    read: ViewContainerRef,
  }) attachmentValueViewRef: ViewContainerRef;

  private injector: Injector = inject(Injector);

  ngOnInit(): void {
    this.attachmentValueViewRef.clear();
    this.generateComponentRef();
  }

  /**
   * Generate ComponentFactory for attachment rendering
   */
  computeComponentFactory(): GenericConstructor<Component> {
    const rendering = this.computeRendering();
    const attachmentTypeRenderOptions = getAttachmentTypeRendering(rendering);
    return attachmentTypeRenderOptions?.componentRef || null;
  }

  /**
   * Generate ComponentRef for attachment rendering
   */
  generateComponentRef(): ComponentRef<any> {
    let attachmentComponentRef: ComponentRef<Component>;
    const component: GenericConstructor<Component> = this.computeComponentFactory();
    if (component) {
      attachmentComponentRef = this.attachmentValueViewRef.createComponent(component, {
        index: 0,
        injector: this.getComponentInjector(),
      });
      (attachmentComponentRef.instance as any).item = this.item;
      (attachmentComponentRef.instance as any).bitstream = this.bitstream;
      (attachmentComponentRef.instance as any).tabName = this.tabName;
    }
    return attachmentComponentRef;
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

  /**
   * Return the rendering type of the field to render
   *
   * @return the rendering type
   */
  computeRendering(): string | AttachmentRenderingType {
    return this.renderingType || AttachmentRenderingType.DOWNLOAD;
  }

}
