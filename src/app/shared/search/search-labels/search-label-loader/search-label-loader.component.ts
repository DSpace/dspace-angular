import {
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { GenericConstructor } from 'src/app/core/shared/generic-constructor';

import { AbstractComponentLoaderComponent } from '../../../abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../../abstract-component-loader/dynamic-component-loader.directive';
import { AppliedFilter } from '../../models/applied-filter.model';
import { getSearchLabelByOperator } from './search-label-loader.decorator';

@Component({
  selector: 'ds-search-label-loader',
  standalone: true,
  templateUrl: '../../../abstract-component-loader/abstract-component-loader.component.html',
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
export class SearchLabelLoaderComponent extends AbstractComponentLoaderComponent<Component> implements OnInit, OnChanges {

  @Input() inPlaceSearch: boolean;

  @Input() appliedFilter: AppliedFilter;

  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'appliedFilter',
  ];

  protected inputNames: (keyof this & string)[] = [
    'inPlaceSearch',
    'appliedFilter',
  ];

  public getComponent(): GenericConstructor<Component> {
    return getSearchLabelByOperator(this.appliedFilter.operator, this.themeService.getThemeName());
  }

}
