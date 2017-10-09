import { Component } from '@angular/core';
import { ViewMode } from '../../+search-page/search-options.model';
import { SearchService } from './../../+search-page/search-service/search.service';

/**
 * Component to switch between list and grid views.
 */
@Component({
  selector: 'ds-view-mode-switch',
  styleUrls: ['./view-mode-switch.component.scss'],
  templateUrl: './view-mode-switch.component.html'
})
export class ViewModeSwitchComponent {
  constructor(private searchService: SearchService) {
  }

  switchViewTo(viewMode: ViewMode) {
    this.searchService.setViewMode(viewMode);
  }
}
