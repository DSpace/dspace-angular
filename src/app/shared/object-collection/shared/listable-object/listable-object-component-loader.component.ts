import { Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ListableObject } from '../listable-object.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { getListableObjectComponent } from './listable-object.decorator';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ListableObjectDirective } from './listable-object.directive';
import { CollectionElementLinkType } from '../../collection-element-link.type';
import { hasValue } from '../../../empty.util';

@Component({
  selector: 'ds-listable-object-component-loader',
  // styleUrls: ['./listable-object-component-loader.component.scss'],
  templateUrl: './listable-object-component-loader.component.html'
})
/**
 * Component for determining what component to use depending on the item's relationship type (relationship.type)
 */
export class ListableObjectComponentLoaderComponent implements OnInit {
  /**
   * The item or metadata to determine the component for
   */
  @Input() object: ListableObject;

  /**
   * The index of the object in the list
   */
  @Input() index: number;

  /**
   * The preferred view-mode to display
   */
  @Input() viewMode: ViewMode;

  /**
   * The context of listable object
   */
  @Input() context: Context;

  /**
   * The type of link used to render the links inside the listable object
   */
  @Input() linkType: CollectionElementLinkType;

  /**
   * The identifier of the list this element resides in
   */
  @Input() listID: string;

  /**
   * Whether to show the badge label or not
   */
  @Input() showLabel = true;

  /**
   * The value to display for this element
   */
  @Input() value: string;

  /**
   * Whether or not informational badges (e.g. Private, Withdrawn) should be hidden
   */
  @Input() hideBadges = false;

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(ListableObjectDirective, {static: true}) listableObjectDirective: ListableObjectDirective;

  /**
   * View on the badges template, to be passed on to the loaded component (which will place the badges in the desired
   * location, or on top if not specified)
   */
  @ViewChild('badges', { static: true }) badges: ElementRef;

  /**
   * Whether or not the "Private" badge should be displayed for this listable object
   */
  privateBadge = false;

  /**
   * Whether or not the "Withdrawn" badge should be displayed for this listable object
   */
  withdrawnBadge = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  /**
   * Setup the dynamic child component
   */
  ngOnInit(): void {
    this.initBadges();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.getComponent());

    const viewContainerRef = this.listableObjectDirective.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(
      componentFactory,
      0,
      undefined,
      [
        [this.badges.nativeElement],
      ]);
    (componentRef.instance as any).object = this.object;
    (componentRef.instance as any).index = this.index;
    (componentRef.instance as any).linkType = this.linkType;
    (componentRef.instance as any).listID = this.listID;
    (componentRef.instance as any).showLabel = this.showLabel;
    (componentRef.instance as any).context = this.context;
    (componentRef.instance as any).viewMode = this.viewMode;
    (componentRef.instance as any).value = this.value;
  }

  /**
   * Initialize which badges should be visible in the listable component
   */
  initBadges() {
    let objectAsAny = this.object as any;
    if (hasValue(objectAsAny.indexableObject)) {
      objectAsAny = objectAsAny.indexableObject;
    }
    const objectExistsAndValidViewMode = hasValue(objectAsAny) && this.viewMode !== ViewMode.StandalonePage;
    this.privateBadge = objectExistsAndValidViewMode && hasValue(objectAsAny.isDiscoverable) && !objectAsAny.isDiscoverable;
    this.withdrawnBadge = objectExistsAndValidViewMode && hasValue(objectAsAny.isWithdrawn) && objectAsAny.isWithdrawn;
  }

  /**
   * Fetch the component depending on the item's relationship type, view mode and context
   * @returns {GenericConstructor<Component>}
   */
  private getComponent(): GenericConstructor<Component> {
    return getListableObjectComponent(this.object.getRenderTypes(), this.viewMode, this.context)
  }
}
