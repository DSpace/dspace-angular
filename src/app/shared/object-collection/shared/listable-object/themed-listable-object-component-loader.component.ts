import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ListableObjectComponentLoaderComponent } from './listable-object-component-loader.component';
import { ThemedComponent } from '../../../theme-support/themed.component';
import { ListableObject } from '../listable-object.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { CollectionElementLinkType } from '../../collection-element-link.type';

/**
 * Themed wrapper for ListableObjectComponentLoaderComponent
 */
@Component({
  selector: 'ds-themed-listable-object-component-loader',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedListableObjectComponentLoaderComponent extends ThemedComponent<ListableObjectComponentLoaderComponent> {
  protected inAndOutputNames: (keyof ListableObjectComponentLoaderComponent & keyof this)[] = [
    'object', 'index', 'viewMode', 'context', 'linkType', 'listID', 'linkType', 'showLabel', 'value', 'hideBadges', 'contentChange'];

  @Input() object: ListableObject;
  @Input() index: number;
  @Input() viewMode: ViewMode;
  @Input() context: Context;
  @Input() linkType: CollectionElementLinkType;
  @Input() listID: string;
  @Input() showLabel = true;
  @Input() value: string;
  @Input() hideBadges = false;
  @Output() contentChange = new EventEmitter<ListableObject>();

  protected getComponentName(): string {
    return 'ListableObjectComponentLoaderComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/object-collection/shared/listable-object/listable-object-component-loader.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./listable-object-component-loader.component');
  }
}
