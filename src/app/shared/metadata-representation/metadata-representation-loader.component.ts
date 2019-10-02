import { Component, ComponentFactoryResolver, InjectionToken, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { MetadataRepresentation } from '../../core/shared/metadata-representation/metadata-representation.model';
import { getMetadataRepresentationComponent } from './metadata-representation.decorator';
import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { MetadataRepresentationListElementComponent } from '../object-list/metadata-representation-list-element/metadata-representation-list-element.component';
import { MetadataRepresentationDirective } from './metadata-representation.directive';

@Component({
  selector: 'ds-metadata-representation-loader',
  // styleUrls: ['./metadata-representation-loader.component.scss'],
  templateUrl: './metadata-representation-loader.component.html'
})
/**
 * Component for determining what component to use depending on the item's relationship type (relationship.type)
 */
export class MetadataRepresentationLoaderComponent implements OnInit {
  /**
   * The item or metadata to determine the component for
   */
  @Input() mdRepresentation: MetadataRepresentation;
  @Input() context: Context;
  @ViewChild(MetadataRepresentationDirective) mdRepDirective: MetadataRepresentationDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.getComponent());

    const viewContainerRef = this.mdRepDirective.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<MetadataRepresentationListElementComponent>componentRef.instance).metadataRepresentation = this.mdRepresentation;
  }

  /**
   * Fetch the component depending on the item's relationship type
   * @returns {string}
   */
  private getComponent(): GenericConstructor<MetadataRepresentationListElementComponent> {
    return getMetadataRepresentationComponent(this.mdRepresentation.itemType, this.mdRepresentation.representationType, this.context);
  }
}
