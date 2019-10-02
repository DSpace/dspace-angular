import { Component, InjectionToken, Injector, Input, OnInit } from '@angular/core';
import { ListableObject } from '../listable-object.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { hasValue } from '../../../empty.util';
import { getListableObjectComponent } from './listable-object.decorator';

@Component({
  selector: 'ds-listable-object-component-loader',
  styleUrls: ['./listable-object-component-loader.component.scss'],
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
   * The preferred view-mode to display
   */
  @Input() viewMode: ViewMode;

  @Input() context: Context;

  constructor(private injector: Injector) {
  }

  ngOnInit(): void {

  }

  /**
   * Fetch the component depending on the item's relationship type
   * @returns {string}
   */
  private getComponent(): string {
    return getListableObjectComponent(this.object, this.viewMode);
  }
}
