import { Component, ComponentFactoryResolver, InjectionToken, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { MetadataRepresentation } from '../../core/shared/metadata-representation/metadata-representation.model';
import { getMetadataRepresentationComponent } from './metadata-representation.decorator';
import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { MetadataRepresentationListElementComponent } from '../object-list/metadata-representation-list-element/metadata-representation-list-element.component';
import { MetadataRepresentationDirective } from './metadata-representation.directive';
import { hasValue } from '../empty.util';

@Component({
  selector: 'ds-metadata-representation-loader',
  // styleUrls: ['./metadata-representation-loader.component.scss'],
  templateUrl: './metadata-representation-loader.component.html'
})
/**
 * Component for determining what component to use depending on the item's relationship type (relationship.type), its metadata representation and, optionally, its context
 */
export class MetadataRepresentationLoaderComponent implements OnInit {
  private componentRefInstance: MetadataRepresentationListElementComponent;

  /**
   * The item or metadata to determine the component for
   */
  private _mdRepresentation: MetadataRepresentation;
  get mdRepresentation(): MetadataRepresentation {
    return this._mdRepresentation;
  }
  @Input() set mdRepresentation(nextValue: MetadataRepresentation) {
    this._mdRepresentation = nextValue;
    if (hasValue(this.componentRefInstance)) {
      this.componentRefInstance.metadataRepresentation = nextValue;
    }
  }

  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * Directive to determine where the dynamic child component is located
   */
  @ViewChild(MetadataRepresentationDirective, {static: true}) mdRepDirective: MetadataRepresentationDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  /**
   * Set up the dynamic child component
   */
  ngOnInit(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.getComponent());

    const viewContainerRef = this.mdRepDirective.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentRefInstance = componentRef.instance as MetadataRepresentationListElementComponent;
    this.componentRefInstance.metadataRepresentation = this.mdRepresentation;
  }

  /**
   * Fetch the component depending on the item's relationship type, metadata representation type and context
   * @returns {string}
   */
  private getComponent(): GenericConstructor<MetadataRepresentationListElementComponent> {
    return getMetadataRepresentationComponent(this.mdRepresentation.itemType, this.mdRepresentation.representationType, this.context);
  }
}
