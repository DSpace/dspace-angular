import { Component } from '@angular/core';
import { Router } from '@angular/router';

export enum SearchTabOptions {
  'Your submissions',
  'All tasks'
}

@Component({
  selector: 'ds-search-tab',
  styleUrls: ['./search-tab.component.scss'],
  templateUrl: './search-tab.component.html',
})
export class SearchTabComponent {

  constructor(private router: Router) {
  }

  public tabOptions = SearchTabOptions;

  onSelect(event: Event) {
    /*const value = (event.target.selectedIndex === 0) ? 'submissions' : 'tasks';
    console.log(event.target.value);
    this.router.navigate(['/mydspace', {'f.show': value}]);*/
  }
}
