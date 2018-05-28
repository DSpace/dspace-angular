import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SetViewMode } from '../view-mode';
import { SearchService } from './../../+search-page/search-service/search.service';

/**
 * Component to switch between list and grid views.
 */
@Component({
  selector: 'ds-view-mode-switch',
  styleUrls: ['./view-mode-switch.component.scss'],
  templateUrl: './view-mode-switch.component.html'
})
export class ViewModeSwitchComponent implements OnInit, OnDestroy {
  currentMode: SetViewMode = SetViewMode.List;
  viewModeEnum = SetViewMode;
  private sub: Subscription;

  constructor(private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.sub = this.searchService.getViewMode().subscribe((viewMode: SetViewMode) => {
      this.currentMode = viewMode;
    });
  }

  switchViewTo(viewMode: SetViewMode) {
    this.searchService.setViewMode(viewMode);
  }

  ngOnDestroy() {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}
