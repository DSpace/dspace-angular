import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { GenericConstructor } from 'src/app/core/shared/generic-constructor';
import { getSearchLabelByOperator } from './search-label-loader.decorator';
import { AppliedFilter } from '../../models/applied-filter.model';
import { AbstractComponentLoaderComponent } from '../../../abstract-component-loader/abstract-component-loader.component';

@Component({
  selector: 'ds-search-label-loader',
  templateUrl: '../../../abstract-component-loader/abstract-component-loader.component.html',
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
    return getSearchLabelByOperator(this.appliedFilter.operator);
  }

}
