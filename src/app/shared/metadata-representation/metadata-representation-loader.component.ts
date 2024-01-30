import { Component, ComponentFactoryResolver, Inject, Input, OnInit, ViewChild, OnChanges, SimpleChanges, ComponentRef, ViewContainerRef, ComponentFactory } from '@angular/core';
import {
  MetadataRepresentation,
  MetadataRepresentationType
} from '../../core/shared/metadata-representation/metadata-representation.model';
import { METADATA_REPRESENTATION_COMPONENT_FACTORY } from './metadata-representation.decorator';
import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { MetadataRepresentationListElementComponent } from '../object-list/metadata-representation-list-element/metadata-representation-list-element.component';
import { MetadataRepresentationDirective } from './metadata-representation.directive';
import { hasValue, isNotEmpty, hasNoValue } from '../empty.util';
import { ThemeService } from '../theme-support/theme.service';

@Component({
  selector: 'ds-metadata-representation-loader',
  templateUrl: './metadata-representation-loader.component.html'
})
/**
 * Component for determining what component to use depending on the item's entity type (dspace.entity.type), its metadata representation and, optionally, its context
 */
export class MetadataRepresentationLoaderComponent implements OnInit, OnChanges {

  /**
   * The item or metadata to determine the component for
   */
  private _mdRepresentation: MetadataRepresentation;
  get mdRepresentation(): MetadataRepresentation {
    return this._mdRepresentation;
  }
  @Input() set mdRepresentation(nextValue: MetadataRepresentation) {
    this._mdRepresentation = nextValue;
    if (hasValue(this.compRef?.instance)) {
      this.compRef.instance.mdRepresentation = nextValue;
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

  /**
   * The reference to the dynamic component
   */
  protected compRef: ComponentRef<MetadataRepresentationListElementComponent>;

  protected inAndOutputNames: (keyof this)[] = [
    'context',
    'mdRepresentation',
  ];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private themeService: ThemeService,
    @Inject(METADATA_REPRESENTATION_COMPONENT_FACTORY) private getMetadataRepresentationComponent: (entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context, theme: string) => GenericConstructor<any>,
  ) {
  }

  /**
   * Set up the dynamic child component
   */
  ngOnInit(): void {
    this.instantiateComponent();
  }

  /**
   * Whenever the inputs change, update the inputs of the dynamic component
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (hasNoValue(this.compRef)) {
      // sometimes the component has not been initialized yet, so it first needs to be initialized
      // before being called again
      this.instantiateComponent(changes);
    } else {
      // if an input or output has changed
      if (this.inAndOutputNames.some((name: any) => hasValue(changes[name]))) {
        this.connectInputsAndOutputs();
        if (this.compRef?.instance && 'ngOnChanges' in this.compRef.instance) {
          (this.compRef.instance as any).ngOnChanges(changes);
        }
      }
    }
  }

  private instantiateComponent(changes?: SimpleChanges): void {
    const componentFactory: ComponentFactory<MetadataRepresentationListElementComponent> = this.componentFactoryResolver.resolveComponentFactory(this.getComponent());

    const viewContainerRef: ViewContainerRef = this.mdRepDirective.viewContainerRef;
    viewContainerRef.clear();

    this.compRef = viewContainerRef.createComponent(componentFactory);

    if (hasValue(changes)) {
      this.ngOnChanges(changes);
    } else {
      this.connectInputsAndOutputs();
    }
  }

  /**
   * Fetch the component depending on the item's entity type, metadata representation type and context
   * @returns {string}
   */
  private getComponent(): GenericConstructor<MetadataRepresentationListElementComponent> {
    return this.getMetadataRepresentationComponent(this.mdRepresentation.itemType, this.mdRepresentation.representationType, this.context, this.themeService.getThemeName());
  }

  /**
   * Connect the in and outputs of this component to the dynamic component,
   * to ensure they're in sync
   */
  protected connectInputsAndOutputs(): void {
    if (isNotEmpty(this.inAndOutputNames) && hasValue(this.compRef) && hasValue(this.compRef.instance)) {
      this.inAndOutputNames.filter((name: any) => this[name] !== undefined).forEach((name: any) => {
        this.compRef.instance[name] = this[name];
      });
    }
  }
}
