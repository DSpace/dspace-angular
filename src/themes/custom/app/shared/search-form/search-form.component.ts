import { Component } from '@angular/core';
import {
  SearchFormComponent as BaseComponent,
} from '../../../../../app/shared/search-form/search-form.component';

@Component({
  selector: 'ds-search-form',
  // styleUrls: ['./search-form.component.scss'],
  styleUrls: ['../../../../../app/shared/search-form/search-form.component.scss'],
  // templateUrl: './search-form.component.html',
  templateUrl: '../../../../../app/shared/search-form/search-form.component.html',
})
export class SearchFormComponent extends BaseComponent {
}
